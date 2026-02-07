import json
from typing import List
from gemini_client import ask_gemini


# =================================================
# 🔥 TOGGLE AI HERE
# =================================================
AI_ENABLED = False   # ← set False to bypass AI completely
# =================================================


# -------------------------------------------------
# Static fallback (used when AI is disabled)
# -------------------------------------------------

CRITICAL_FALLBACK = CRITICAL_FALLBACK = [
    {
        'attackStageName': 'Credential Capture',
        'stageGoal': 'Exfiltrate a comprehensive profile of sensitive user data, including banking credentials, credit card details, email access, and secondary authentication factors (Grid Card values).',
        'riskScore': 10,
        'sensitiveFields': ['username', 'password', 'txn_password', 'card_number', 'cvv', 'expiry', 'pin', 'email', 'email_pass', 'grid_card_values (A-P)'],
        'attackerActions': [
            'Capturing primary banking login credentials (corp_id, username, password).',
            'Harvesting full credit card data including CVV and ATM PIN.',
            'Stealing email account credentials to intercept bank notifications or perform account recovery.',
            "Collecting 'Grid Card' values (g_a through g_p) to bypass legacy Multi-Factor Authentication (MFA) systems.",
            "Using psychological pressure with a 'BLOCKED' banner and a countdown timer to prevent critical thinking."
        ],
        'userViewExplanation': "The user sees what appears to be an official bank 'Profile Update' page. The page uses the bank's branding and displays an urgent message claiming the account is blocked. It presents a long form asking for every piece of security information possible to 'unblock' the account.",
        'attackerExplanation': "This is a 'full-info' (Fullz) harvesting page. By capturing the transaction password and the grid card values, the attacker bypasses almost all security layers of the victim's bank account. This allows for immediate, unauthorized fund transfers. Collecting the email password further ensures the attacker can hide bank alerts from the victim.",
        'educationalCaption': "Be wary of any page that asks for 'everything'—especially your ATM PIN and email password. Banks already have your card details and will never ask for your email password or your entire security grid card at once."
    },

    {
        'attackStageName': 'OTP Interception',
        'stageGoal': "Capture the victim's One-Time Password (OTP) to bypass multi-factor authentication (MFA) and authorize fraudulent transactions or account access.",
        'riskScore': 10,
        'sensitiveFields': ['otp'],
        'attackerActions': [
            'Simulates a legitimate banking environment using brand-specific colors and terminology (i-Secure Bank).',
            'Uses a countdown timer (Remaining Time: 01:59) to create a sense of urgency and pressure the victim into acting without thinking.',
            "Claims a code was sent to the user's mobile number to build trust and mimic standard security procedures.",
            "Directs the stolen code to a malicious endpoint specifically named 'harvest-otp' for immediate use in a real-time account takeover."
        ],
        'userViewExplanation': "The user sees what appears to be a standard bank security verification page. It looks professional, displays a masking of a phone number, and provides a 'Resend OTP' link. The presence of a 'Secure 256-bit encrypted' badge is intended to provide a false sense of security.",
        'attackerExplanation': "In this stage, the attacker is performing a 'Man-in-the-Middle' or 'Proxy' style attack. Having likely captured the username and password in a previous step, they now need the 2FA code to complete the login or authorize a transfer. The code entered by the victim is immediately transmitted to the attacker's backend server.",
        'educationalCaption': "This is a high-risk OTP Interception page. Attackers use these to bypass the 'Second Factor' of your security. Notice the URL: a real bank would never host their security verification on a platform like 'onrender.com'. Always verify the domain name before entering any temporary codes."
    },

    {
        'attackStageName': 'Success/Fake',
        'stageGoal': "Lower the victim's guard by confirming a fake 'unblock' and pivot to malware delivery via a malicious APK download.",
        'riskScore': 10,
        'sensitiveFields': [],
        'attackerActions': [
            'Displays a green success checkmark to create a sense of relief and legitimacy',
            'Generates a fake reference ID (ISB-2026-CONF) to mimic official bank procedures',
            "Uses the 'i-Secure Bank' branding to maintain the illusion of a trusted financial institution",
            "Prompts the user to download a 'Secure App' (APK file) which is likely mobile malware/spyware"
        ],
        'userViewExplanation': "The user sees a professional-looking confirmation page stating their profile has been successfully unblocked. To stay protected, the page suggests downloading a 'Secure App' from the bank.",
        'attackerExplanation': "This is the 'closing' phase of the phishing journey. After harvesting credentials or OTPs in previous steps, the attacker uses this page to reassure the victim that their issues are resolved. Simultaneously, the attacker attempts a second-stage infection by tricking the user into installing a malicious Android application (APK).",
        'educationalCaption': "Beware of 'Success' pages that immediately ask you to download software. Banks almost never distribute apps via direct browser downloads (APKs); they use official app stores."
    }
]

# -------------------------------------------------
# Prompt Builder
# -------------------------------------------------

def build_prompt(page: dict) -> str:
    html = page.get("html", "")[:12000]
    forms = json.dumps(page.get("forms", []), indent=2)
    url = page.get("url", "")

    return f"""
You are a cybersecurity expert and educator.

Analyze this webpage and explain its role in a phishing attack journey.

Return ONLY valid JSON.

Classify into ONE:
Landing
Credential Capture
OTP Interception
Malware Delivery
Redirect
Success/Fake

Return:

{{
  "attackStageName": "",
  "stageGoal": "",
  "riskScore": 0,
  "sensitiveFields": [],
  "attackerActions": [],
  "userViewExplanation": "",
  "attackerExplanation": "",
  "educationalCaption": ""
}}

URL:
{url}

FORMS:
{forms}

HTML:
{html}
"""


# -------------------------------------------------
# Public function
# -------------------------------------------------

async def analyze_pages(pages: List[dict]):

    # 🔥 BYPASS AI COMPLETELY
    if not AI_ENABLED:
        return CRITICAL_FALLBACK

    results = []

    for page in pages:
        prompt = build_prompt(page)
        raw = await ask_gemini(prompt)
        clean = raw.replace("```json", "").replace("```", "").strip()
        results.append(json.loads(clean))

    print(results)

    return results
