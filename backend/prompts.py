from typing import List, Dict, Any

def symptom_extraction_messages(text: str) -> List[Dict[str, str]]:
    system = "You assist rural health triage. Extract only symptoms mentioned. Output only JSON with key 'symptoms' as an array of short phrases. Do not diagnose. Do not include medications."
    user = f"Input: {text}\nReturn JSON: {{\"symptoms\": []}}"
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]

def risk_classification_messages(symptoms: List[str], contexts: List[Dict[str, Any]], fallback_mode: bool = False, related_risks: List[str] = None) -> List[Dict[str, str]]:
    ctx_text = "\n\n".join([f"Title: {c.get('title','')}\nGuideline: {c.get('guideline','')}\nRisk:{c.get('risk','')}\nReferral:{c.get('referral',False)}\nSafe:{', '.join(c.get('safe_actions',[]))}" for c in contexts])
    if not fallback_mode:
        system = (
            "You assist rural health triage and must rely strictly on the provided guideline context and the input symptoms. "
            "Tie the possible_risk_pattern directly to the input symptoms. "
            "If the context does not clearly match the symptoms, set possible_risk_pattern to 'No clear matching pattern in guidelines' and risk_level to 'Medium'. "
            "Do not assume conditions that are not mentioned, including fever or jaundice unless explicitly in symptoms. "
            "Suggest only safe non-prescription actions. "
            "State whether referral is needed. "
            "Do not diagnose. Do not prescribe medicine. "
            "Output only JSON with keys: possible_risk_pattern, risk_level, recommended_actions, referral_needed."
        )
    else:
        system = (
            "You assist rural health triage using general safe triage knowledge when specific guideline matches are not found. "
            "Tie the possible_risk_pattern strictly to the input symptoms. "
            "If uncertain, set possible_risk_pattern to 'No clear matching pattern in guidelines' and risk_level to 'Medium'. "
            "Do not assume unrelated conditions. "
            "Suggest only safe non-prescription actions and state whether referral is needed based on symptoms. "
            "Do not diagnose. Do not prescribe medicine. "
            "Output only JSON with keys: possible_risk_pattern, risk_level, recommended_actions, referral_needed."
        )
    related = related_risks or []
    rel_line = f"\nRelated risks from medical knowledge graph: {', '.join(related)}" if related else ""
    user = (
        f"Symptoms: {symptoms}\n"
        f"Context:\n{ctx_text}{rel_line}\n"
        "Return JSON: {\"possible_risk_pattern\":\"\",\"risk_level\":\"\",\"recommended_actions\":[],\"referral_needed\":false}"
    )
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]
