import json
from gemini_client import ask_gemini


async def generate_explanation(report: dict):
    verdict = report.get("verdict", {})
    evidence = report.get("evidence", {})

    stolen = ", ".join(evidence.get("stolenDataTypes", []))
    behaviors = ", ".join(evidence.get("suspiciousBehaviors", []))

    prompt = f"""
    You are a cybersecurity analyst explaining phishing attacks to normal users.

    Explain clearly and simply.

    Risk Level: {verdict.get('riskLevel')}
    Risk Score: {verdict.get('score')}
    Sensitive Data Requested: {stolen}
    Suspicious Behaviors: {behaviors}

    Return ONLY JSON:

    {{
    "plainEnglish": "...",
    "tacticsUsed": ["...", "..."],
    "whatWouldHappen": "...",
    "advice": "..."
    }}
    """

    raw = await ask_gemini(prompt)

    try:
        return json.loads(raw)
    except:
        return {"plainEnglish": raw}
