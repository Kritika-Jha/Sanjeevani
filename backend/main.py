import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from triage import TriageEngine

class AnalyzeRequest(BaseModel):
    text: str

engine = TriageEngine(os.path.join(os.path.dirname(__file__), "guidelines.json"))

app = FastAPI(title="Sanjeevani AI Triage Assistant", version="0.1.0")

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze_case")
def analyze_case(req: AnalyzeRequest):
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="text is required")
    result = engine.analyze_case(req.text.strip())
    return result
