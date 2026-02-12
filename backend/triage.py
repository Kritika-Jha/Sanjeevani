import os
import json
import re
from typing import List, Dict, Any, Literal
from pydantic import BaseModel
from openai import OpenAI, AsyncOpenAI
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
        self.async_client = None
        try:
            key = os.getenv("OPENAI_API_KEY")
            base = os.getenv("OPENAI_API_BASE")
            if base:
                self.client = OpenAI(base_url=base, api_key=key)
            else:
                self.client = OpenAI(api_key=key)
            if base:
                self.async_client = AsyncOpenAI(base_url=base, api_key=key)
            else:
                self.async_client = AsyncOpenAI(api_key=key)
        except Exception:
            self.client = None
            self.async_client = None

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

    def classify_risk_llm(self, symptoms: List[str], contexts: List[Dict[str, Any]], fallback_mode: bool = False) -> Dict[str, Any]:
        class RiskClassification(BaseModel):
            possible_risk_pattern: str
            risk_level: Literal["Low", "Medium", "High"]
            recommended_actions: List[str]
            referral_needed: bool
        related_risks = []
        try:
            import json as _json
            import os as _os
            kg_path = _os.path.join(_os.path.dirname(__file__), "knowledge_graph.json")
            with open(kg_path, "r", encoding="utf-8") as f:
                graph = _json.load(f)
            sset = {s.lower().strip() for s in symptoms}
            for s in sset:
                related_risks.extend(graph.get(s, []))
        except Exception:
            related_risks = []
        msgs = risk_classification_messages(symptoms, contexts, fallback_mode=fallback_mode, related_risks=list(dict.fromkeys(related_risks)))
        try:
            res = self.client.chat.completions.create(
                model=os.getenv("CHAT_MODEL", "gpt-4o-mini"),
                messages=msgs,
                temperature=0,
                response_format={"type": "json_object"}
            )
            content = res.choices[0].message.content
            data = parse_json(content)
        except Exception:
            res = self.client.chat.completions.create(model=os.getenv("CHAT_MODEL", "gpt-4o-mini"), messages=msgs, temperature=0)
            content = res.choices[0].message.content
            data = parse_json(content)
        try:
            parsed = RiskClassification(**{
                "possible_risk_pattern": str(data.get("possible_risk_pattern", "")),
                "risk_level": str(data.get("risk_level", "")) if data.get("risk_level", "") in ["Low", "Medium", "High"] else "Medium",
                "recommended_actions": [str(x).strip() for x in data.get("recommended_actions", []) if str(x).strip()],
                "referral_needed": bool(data.get("referral_needed", False))
            })
            actions = sanitize_actions(parsed.recommended_actions)
            return {"possible_risk_pattern": parsed.possible_risk_pattern, "risk_level": parsed.risk_level, "recommended_actions": actions, "referral_needed": parsed.referral_needed}
        except Exception:
            actions = data.get("recommended_actions", [])
            if isinstance(actions, list):
                actions = sanitize_actions([str(x).strip() for x in actions if str(x).strip()])
            else:
                actions = []
            rl = str(data.get("risk_level", "")).strip()
            if rl not in ["Low", "Medium", "High"]:
                rl = "Medium"
            rn = bool(data.get("referral_needed", False))
            pr = str(data.get("possible_risk_pattern", "")).strip()
            return {"possible_risk_pattern": pr, "risk_level": rl, "recommended_actions": actions, "referral_needed": rn}

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

    def _clean_symptoms(self, arr: List[str]) -> List[str]:
        out = []
        for a in arr:
            a = re.sub(r"[^a-zA-Z0-9\\s]", " ", a.lower()).strip()
            if a:
                out.append(a)
        return out

    def analyze_case(self, text: str) -> Dict[str, Any]:
        if self.client:
            try:
                symptoms = self.extract_symptoms_llm(text)
            except Exception:
                symptoms = self.extract_symptoms_fallback(text)
        else:
            symptoms = self.extract_symptoms_fallback(text)
        cleaned = self._clean_symptoms(symptoms)
        query = " ".join(cleaned) if cleaned else re.sub(r"[^a-zA-Z0-9\\s]", " ", text.lower())
        print({"query": query, "cleaned_symptoms": cleaned})
        contexts = retrieve_context(self.index, query, top_k=5)
        syn = {
            "shortness of breath": ["breathlessness", "difficulty breathing"],
            "severe chest pain": ["chest pain"]
        }
        match_terms = set(cleaned)
        for k, vs in syn.items():
            if k in match_terms:
                for v in vs:
                    match_terms.add(v)
        def _score(c):
            text = (c.get("title","") + " " + c.get("guideline","")).lower()
            base = sum(1 for s in match_terms if s in text)
            tags = c.get("tags", [])
            tag_score = sum(2 for s in match_terms for t in tags if s in (t or "").lower())
            if base == 0 and tag_score == 0:
                return -100
            return base + tag_score
        contexts = sorted(contexts, key=_score, reverse=True)[:3]
        print({"retrieved": [c.get("title","") for c in contexts]})
        max_score = -100 if not contexts else max(
            [sum(1 for s in match_terms if s in (c.get("title","") + " " + c.get("guideline","")).lower()) for c in contexts]
        )
        fallback_mode = max_score <= 0
        if self.client:
            try:
                result = self.classify_risk_llm(symptoms, contexts, fallback_mode=fallback_mode)
            except Exception:
                result = self.classify_risk_fallback(symptoms, contexts)
        else:
            result = self.classify_risk_fallback(symptoms, contexts)
        alert = urgent_alert(result.get("risk_level", ""), symptoms)
        subjective = f"Patient reports: {text}"
        objective = f"Extracted symptoms: {', '.join(symptoms) or 'none'}. Vital signs: none recorded."
        assessment = f"Risk level: {result.get('risk_level','')}. Possible pattern: {result.get('possible_risk_pattern','')}. Urgent: {alert}"
        plan = f"Recommended actions: {', '.join(result.get('recommended_actions', [])) or 'none'}. Referral needed: {'yes' if result.get('referral_needed', False) else 'no'}. Follow-up advice: monitor and seek professional help."
        final = {
            "symptoms": symptoms,
            "possible_risk_pattern": result.get("possible_risk_pattern", ""),
            "risk_level": result.get("risk_level", ""),
            "recommended_actions": result.get("recommended_actions", []),
            "referral_needed": result.get("referral_needed", False),
            "urgent_alert": alert,
            "retrieved_contexts": [{"title": c.get("title",""), "risk": c.get("risk",""), "referral": c.get("referral",False)} for c in contexts]
        }
        try:
            import json as _json
            import os as _os
            kg_path = _os.path.join(_os.path.dirname(__file__), "knowledge_graph.json")
            with open(kg_path, "r", encoding="utf-8") as f:
                graph = _json.load(f)
            sset = {s.lower().strip() for s in symptoms}
            related = set()
            for s in sset:
                for r in graph.get(s, []):
                    related.add(r)
            final["graph_insights"] = list(related)
        except Exception:
            final["graph_insights"] = []
        final["soap_note"] = {
            "subjective": subjective,
            "objective": objective,
            "assessment": assessment,
            "plan": plan
        }
        return final

    async def extract_symptoms_llm_async(self, text: str) -> List[str]:
        msgs = symptom_extraction_messages(text)
        res = await self.async_client.chat.completions.create(model=os.getenv("CHAT_MODEL", "gpt-4o-mini"), messages=msgs, temperature=0, response_format={"type": "json_object"})
        content = res.choices[0].message.content
        data = parse_json(content)
        arr = data.get("symptoms", [])
        if isinstance(arr, list):
            return [str(x).strip() for x in arr if str(x).strip()]
        return []

    async def classify_risk_llm_async(self, symptoms: List[str], contexts: List[Dict[str, Any]], fallback_mode: bool = False) -> Dict[str, Any]:
        class RiskClassification(BaseModel):
            possible_risk_pattern: str
            risk_level: Literal["Low", "Medium", "High"]
            recommended_actions: List[str]
            referral_needed: bool
        related_risks = []
        try:
            import json as _json
            import os as _os
            kg_path = _os.path.join(_os.path.dirname(__file__), "knowledge_graph.json")
            with open(kg_path, "r", encoding="utf-8") as f:
                graph = _json.load(f)
            sset = {s.lower().strip() for s in symptoms}
            for s in sset:
                related_risks.extend(graph.get(s, []))
        except Exception:
            related_risks = []
        msgs = risk_classification_messages(symptoms, contexts, fallback_mode=fallback_mode, related_risks=list(dict.fromkeys(related_risks)))
        try:
            res = await self.async_client.chat.completions.create(
                model=os.getenv("CHAT_MODEL", "gpt-4o-mini"),
                messages=msgs,
                temperature=0,
                response_format={"type": "json_object"}
            )
            content = res.choices[0].message.content
            data = parse_json(content)
        except Exception:
            res = await self.async_client.chat.completions.create(model=os.getenv("CHAT_MODEL", "gpt-4o-mini"), messages=msgs, temperature=0)
            content = res.choices[0].message.content
            data = parse_json(content)
        try:
            parsed = RiskClassification(**{
                "possible_risk_pattern": str(data.get("possible_risk_pattern", "")),
                "risk_level": str(data.get("risk_level", "")) if data.get("risk_level", "") in ["Low", "Medium", "High"] else "Medium",
                "recommended_actions": [str(x).strip() for x in data.get("recommended_actions", []) if str(x).strip()],
                "referral_needed": bool(data.get("referral_needed", False))
            })
            actions = sanitize_actions(parsed.recommended_actions)
            return {"possible_risk_pattern": parsed.possible_risk_pattern, "risk_level": parsed.risk_level, "recommended_actions": actions, "referral_needed": parsed.referral_needed}
        except Exception:
            actions = data.get("recommended_actions", [])
            if isinstance(actions, list):
                actions = sanitize_actions([str(x).strip() for x in actions if str(x).strip()])
            else:
                actions = []
            rl = str(data.get("risk_level", "")).strip()
            if rl not in ["Low", "Medium", "High"]:
                rl = "Medium"
            rn = bool(data.get("referral_needed", False))
            pr = str(data.get("possible_risk_pattern", "")).strip()
            return {"possible_risk_pattern": pr, "risk_level": rl, "recommended_actions": actions, "referral_needed": rn}

    async def analyze_case_async(self, text: str) -> Dict[str, Any]:
        if self.async_client:
            try:
                symptoms = await self.extract_symptoms_llm_async(text)
            except Exception:
                symptoms = self.extract_symptoms_fallback(text)
        else:
            symptoms = self.extract_symptoms_fallback(text)
        cleaned = self._clean_symptoms(symptoms)
        query = " ".join(cleaned) if cleaned else re.sub(r"[^a-zA-Z0-9\\s]", " ", text.lower())
        print({"query": query, "cleaned_symptoms": cleaned})
        contexts = retrieve_context(self.index, query, top_k=5)
        syn = {
            "shortness of breath": ["breathlessness", "difficulty breathing"],
            "severe chest pain": ["chest pain"]
        }
        match_terms = set(cleaned)
        for k, vs in syn.items():
            if k in match_terms:
                for v in vs:
                    match_terms.add(v)
        def _score(c):
            text = (c.get("title","") + " " + c.get("guideline","")).lower()
            base = sum(1 for s in match_terms if s in text)
            tags = c.get("tags", [])
            tag_score = sum(2 for s in match_terms for t in tags if s in (t or "").lower())
            if base == 0 and tag_score == 0:
                return -100
            return base + tag_score
        contexts = sorted(contexts, key=_score, reverse=True)[:3]
        print({"retrieved": [c.get("title","") for c in contexts]})
        max_score = -100 if not contexts else max(
            [sum(1 for s in match_terms if s in (c.get("title","") + " " + c.get("guideline","")).lower()) for c in contexts]
        )
        fallback_mode = max_score <= 0
        if self.async_client:
            try:
                result = await self.classify_risk_llm_async(symptoms, contexts, fallback_mode=fallback_mode)
            except Exception:
                result = self.classify_risk_fallback(symptoms, contexts)
        else:
            result = self.classify_risk_fallback(symptoms, contexts)
        alert = urgent_alert(result.get("risk_level", ""), symptoms)
        subjective = f"Patient reports: {text}"
        objective = f"Extracted symptoms: {', '.join(symptoms) or 'none'}. Vital signs: none recorded."
        assessment = f"Risk level: {result.get('risk_level','')}. Possible pattern: {result.get('possible_risk_pattern','')}. Urgent: {alert}"
        plan = f"Recommended actions: {', '.join(result.get('recommended_actions', [])) or 'none'}. Referral needed: {'yes' if result.get('referral_needed', False) else 'no'}. Follow-up advice: monitor and seek professional help."
        final = {
            "symptoms": symptoms,
            "possible_risk_pattern": result.get("possible_risk_pattern", ""),
            "risk_level": result.get("risk_level", ""),
            "recommended_actions": result.get("recommended_actions", []),
            "referral_needed": result.get("referral_needed", False),
            "urgent_alert": alert,
            "retrieved_contexts": [{"title": c.get("title",""), "risk": c.get("risk",""), "referral": c.get("referral",False)} for c in contexts]
        }
        try:
            import json as _json
            import os as _os
            kg_path = _os.path.join(_os.path.dirname(__file__), "knowledge_graph.json")
            with open(kg_path, "r", encoding="utf-8") as f:
                graph = _json.load(f)
            sset = {s.lower().strip() for s in symptoms}
            related = set()
            for s in sset:
                for r in graph.get(s, []):
                    related.add(r)
            final["graph_insights"] = list(related)
        except Exception:
            final["graph_insights"] = []
        final["soap_note"] = {
            "subjective": subjective,
            "objective": objective,
            "assessment": assessment,
            "plan": plan
        }
        return final
