import os
import json
import re
from typing import List, Dict, Any
from openai import OpenAI
from prompts import symptom_extraction_messages, risk_classification_messages
from rag import RAGIndex, load_guidelines, embed_documents, retrieve_context
from redflag import urgent_alert

SAFE_WORD_BLACKLIST = {"tablet", "capsule", "syrup", "antibiotic", "ibuprofen", "paracetamol", "medicine", "drug"}

def sanitize_actions(actions: List[str]) -> List[str]:
    out = []
    for a in actions:
        t = a.lower()
        if any(w in t for w in SAFE_WORD_BLACKLIST):
            continue
        out.append(a)
    return out

def parse_json(text: str) -> Dict[str, Any]:
    try:
        return json.loads(text)
    except Exception:
        m = re.search(r"\{[\s\S]*\}", text)
        if m:
            try:
                return json.loads(m.group(0))
            except Exception:
                return {}
        return {}

class TriageEngine:
    def __init__(self, guidelines_path: str) -> None:
        self.index = RAGIndex(load_guidelines(guidelines_path))
        embed_documents(self.index)
        self.client = None
        try:
            self.client = OpenAI(base_url=os.getenv("OPENAI_API_BASE"), api_key=os.getenv("OPENAI_API_KEY"))
        except Exception:
            self.client = None

    def extract_symptoms_llm(self, text: str) -> List[str]:
        msgs = symptom_extraction_messages(text)
        res = self.client.chat.completions.create(model=os.getenv("CHAT_MODEL", "gpt-4o-mini"), messages=msgs, temperature=0)
        content = res.choices[0].message.content
        data = parse_json(content)
        arr = data.get("symptoms", [])
        if isinstance(arr, list):
            return [str(x).strip() for x in arr if str(x).strip()]
        return []

    def extract_symptoms_fallback(self, text: str) -> List[str]:
        lowers = text.lower()
        parts = re.split(r"[;,]|\band\b|\with\b|\n", lowers)
        arr = []
        for p in parts:
            p = p.strip()
            if not p:
                continue
            arr.append(p)
        return arr[:10]

    def classify_risk_llm(self, symptoms: List[str], contexts: List[Dict[str, Any]]) -> Dict[str, Any]:
        msgs = risk_classification_messages(symptoms, contexts)
        res = self.client.chat.completions.create(model=os.getenv("CHAT_MODEL", "gpt-4o-mini"), messages=msgs, temperature=0)
        content = res.choices[0].message.content
        data = parse_json(content)
        actions = data.get("recommended_actions", [])
        if isinstance(actions, list):
            data["recommended_actions"] = sanitize_actions([str(x).strip() for x in actions if str(x).strip()])
        else:
            data["recommended_actions"] = []
        rl = str(data.get("risk_level", "")).strip()
        rn = bool(data.get("referral_needed", False))
        pr = str(data.get("possible_risk_pattern", "")).strip()
        return {"possible_risk_pattern": pr, "risk_level": rl, "recommended_actions": data["recommended_actions"], "referral_needed": rn}

    def classify_risk_fallback(self, symptoms: List[str], contexts: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not contexts:
            return {"possible_risk_pattern": "", "risk_level": "Low", "recommended_actions": [], "referral_needed": False}
        top = contexts[0]
        risks = {"Low": 0, "Medium": 1, "High": 2}
        max_risk = top.get("risk", "Low")
        referral = top.get("referral", False)
        actions = []
        for c in contexts:
            if risks.get(c.get("risk", "Low"), 0) > risks.get(max_risk, 0):
                max_risk = c.get("risk", "Low")
            if c.get("referral", False):
                referral = True
            actions.extend(c.get("safe_actions", []))
        actions = sanitize_actions(list(dict.fromkeys(actions)))
        return {"possible_risk_pattern": str(top.get("title", "")), "risk_level": str(max_risk), "recommended_actions": actions[:8], "referral_needed": bool(referral)}

    def analyze_case(self, text: str) -> Dict[str, Any]:
        if self.client:
            try:
                symptoms = self.extract_symptoms_llm(text)
            except Exception:
                symptoms = self.extract_symptoms_fallback(text)
        else:
            symptoms = self.extract_symptoms_fallback(text)
        query = text + " " + " ".join(symptoms)
        contexts = retrieve_context(self.index, query, top_k=3)
        if self.client:
            try:
                result = self.classify_risk_llm(symptoms, contexts)
            except Exception:
                result = self.classify_risk_fallback(symptoms, contexts)
        else:
            result = self.classify_risk_fallback(symptoms, contexts)
        alert = urgent_alert(result.get("risk_level", ""), symptoms)
        final = {
            "symptoms": symptoms,
            "possible_risk_pattern": result.get("possible_risk_pattern", ""),
            "risk_level": result.get("risk_level", ""),
            "recommended_actions": result.get("recommended_actions", []),
            "referral_needed": result.get("referral_needed", False),
            "urgent_alert": alert
        }
        return final
