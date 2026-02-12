from typing import List, Dict, Any

def symptom_extraction_messages(text: str) -> List[Dict[str, str]]:
    system = "You are an assistant for rural health triage. Extract symptoms from input. Output only JSON with key 'symptoms' as an array of short phrases. Do not diagnose. Do not include medications."
    user = f"Input: {text}\nReturn JSON: {{\"symptoms\": []}}"
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]

def risk_classification_messages(symptoms: List[str], contexts: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    ctx_text = "\n\n".join([f"Title: {c.get('title','')}\nGuideline: {c.get('guideline','')}\nRisk:{c.get('risk','')}\nReferral:{c.get('referral',False)}\nSafe:{', '.join(c.get('safe_actions',[]))}" for c in contexts])
    system = "You assist triage based only on provided rural guideline context. Identify possible risk pattern, classify risk level Low/Medium/High, suggest safe non-prescription actions, and state whether referral is needed. Do not diagnose. Do not prescribe medicine. Output only JSON with keys: possible_risk_pattern, risk_level, recommended_actions, referral_needed."
    user = f"Symptoms: {symptoms}\nContext:\n{ctx_text}\nReturn JSON: {{\"possible_risk_pattern\":\"\",\"risk_level\":\"\",\"recommended_actions\":[],\"referral_needed\":false}}"
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]
