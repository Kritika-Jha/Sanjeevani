from typing import List

RED_FLAGS = {"unconscious", "severe bleeding", "chest pain"}

def has_red_flag(symptoms: List[str]) -> bool:
    s = {x.lower().strip() for x in symptoms}
    for flag in RED_FLAGS:
        if any(flag in y for y in s):
            return True
    return False

def urgent_alert(risk_level: str, symptoms: List[str]) -> bool:
    if risk_level.lower() == "high":
        return True
    return has_red_flag(symptoms)
