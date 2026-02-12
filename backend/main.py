import os
import subprocess
import time
from dotenv import load_dotenv
import io
load_dotenv()  # looks for .env in current dir or parent dirs
from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from triage import TriageEngine
from openai import OpenAI
import whisper
import shutil
import asyncio
# Create a dedicated audio temp folder (create it once)
AUDIO_TEMP_DIR = os.path.join(os.path.dirname(__file__), "audio_temp")
os.makedirs(AUDIO_TEMP_DIR, exist_ok=True)
WHISPER_MODEL = whisper.load_model(os.getenv("LOCAL_WHISPER_MODEL", "tiny"))  # tiny/base for CPU speed
HAS_FFMPEG = shutil.which("ffmpeg") is not None
USE_LOCAL = os.getenv("USE_LOCAL_WHISPER", "1") == "1"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
from dotenv import load_dotenv
load_dotenv()

class AnalyzeRequest(BaseModel):
    text: str

class RetrievedContext(BaseModel):
    title: str
    risk: Optional[str] = None
    referral: Optional[bool] = None

class SoapNote(BaseModel):
    subjective: str
    objective: str
    assessment: str
    plan: str

class AnalyzeResponse(BaseModel):
    symptoms: List[str]
    possible_risk_pattern: str
    risk_level: str
    recommended_actions: List[str]
    referral_needed: bool
    urgent_alert: bool
    retrieved_contexts: List[RetrievedContext]
    soap_note: SoapNote
    graph_insights: Optional[List[str]] = []

engine = TriageEngine(os.path.join(os.path.dirname(__file__), "guidelines.json"))

app = FastAPI(title="Sanjeevani AI Triage Assistant", version="0.1.0")

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_rate_state = {}
_RATE_LIMIT = 30
_WINDOW = 60.0

def _allow(ip: str) -> bool:
    now = time.time()
    bucket = _rate_state.get(ip, [])
    bucket = [t for t in bucket if now - t < _WINDOW]
    if len(bucket) >= _RATE_LIMIT:
        _rate_state[ip] = bucket
        return False
    bucket.append(now)
    _rate_state[ip] = bucket
    return True

@app.post("/analyze_case", response_model=AnalyzeResponse)
async def analyze_case(req: AnalyzeRequest, request: Request):
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="text is required")
    ip = request.client.host if request.client else "unknown"
    if not _allow(ip):
        raise HTTPException(status_code=429, detail="rate limit exceeded")
    result = await engine.analyze_case_async(req.text.strip())
    return result

@app.get("/health")
def health():
    return {
        "status": "ok",
        "version": "0.1.0",
        "use_local_whisper": USE_LOCAL,
        "ffmpeg": HAS_FFMPEG,
        "whisper_model": os.getenv("LOCAL_WHISPER_MODEL", "tiny")
    }



@app.post("/transcribe")
async def transcribe(
    language: str = Form("hi"),
    audio: UploadFile = File(...)
):
    if not audio.content_type.startswith("audio/"):
        return {"text": "", "error": "Invalid audio format"}

    audio_bytes = await audio.read()

    # Use fixed path with timestamp to avoid conflicts
    import time
    filename = f"voice_{int(time.time() * 1000)}.webm"
    temp_path = os.path.join(AUDIO_TEMP_DIR, filename)
    temp_wav = temp_path.replace(".webm", ".wav")

    try:
        # Write audio bytes directly
        with open(temp_path, "wb") as f:
            f.write(audio_bytes)

        # Transcribe
        lang_map = {"hi": "hi", "en": "en", "ta": "ta", "te": "te", "bn": "bn"}
        lang_code = lang_map.get(language.lower(), "en")

        # Prefer local whisper; ensure ffmpeg availability
        if USE_LOCAL:
            if HAS_FFMPEG:
                # Convert to 16kHz mono WAV for maximum compatibility
                try:
                    subprocess.run(
                        ["ffmpeg", "-y", "-i", temp_path, "-ar", "16000", "-ac", "1", temp_wav],
                        check=True,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                    )
                    source_path = temp_wav
                except Exception:
                    # Fallback to original WEBM if conversion fails
                    source_path = temp_path

                audio_arr = whisper.load_audio(source_path)
                result = WHISPER_MODEL.transcribe(
                    audio_arr,
                    language=lang_code,
                    fp16=False
                )
                text = result.get("text", "").strip()
                return {
                    "text": text,
                    "language": language,
                    "detected": result.get("language", "unknown")
                }
            else:
                return {
                    "text": "",
                    "language": language,
                    "error": "Local Whisper requires ffmpeg. Install ffmpeg and ensure it is in PATH."
                }
        else:
            # Explicitly use OpenAI Whisper API path
            if not OPENAI_API_KEY:
                return {"text": "", "language": language, "error": "OPENAI_API_KEY not configured"}
            client = OpenAI(api_key=OPENAI_API_KEY)
            file_like = io.BytesIO(audio_bytes)
            file_like.name = "audio.webm"
            api_result = client.audio.transcriptions.create(
                model="whisper-1",
                file=file_like,
                language=lang_code
            )
            text = (getattr(api_result, "text", "") or "").strip()
            return {"text": text, "language": language, "detected": lang_code}

    except Exception as e:
        msg = str(e)
        if "WinError 2" in msg and USE_LOCAL:
            return {
                "text": "",
                "language": language,
                "error": "Transcription failed: ffmpeg not found (WinError 2). Install ffmpeg and ensure it's in PATH."
            }
        return {
            "text": "",
            "language": language,
            "error": f"Transcription failed: {msg}"
        }

    finally:
        # Clean up after a short delay (helps Windows release lock)
        await asyncio.sleep(1)  # 1 second delay
        if os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except:
                pass
        if os.path.exists(temp_wav):
            try:
                os.unlink(temp_wav)
            except:
                pass
