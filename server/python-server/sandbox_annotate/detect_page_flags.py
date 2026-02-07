import json
import re
from gemini_client import ask_gemini

USE_AI = False

PROMPT = """
You are a cybersecurity analyst.

Analyze the provided webpage HTML and detect phishing, fraud, or malware indicators.

Return STRICT JSON only.

For EACH suspicious element, return BOTH:
1) the visible text
2) hints to help locate the exact DOM element

Return format:

{
  "flags": [
    {
      "text": "...exact visible phrase...",
      "type": "urgency | credential | financial | branding | malware | general",
      "reason": "short explanation for user",

      "tag_hint": "input | button | form | link | text | container",
      "match": "text | attribute | form | button",
      "selector_hint": "optional css-like selector if obvious"
    }
  ]
}

Detection rules:

- urgency → countdowns, threats, deadlines
- branding → fake/generic bank names or logos
- credential → login/password/OTP fields
- financial → card/account/payment details
- malware → downloads, APK/EXE files, install prompts
- general → suspicious instructions or phishing flow

Location hint rules (IMPORTANT):

- If it is an input field → tag_hint = input, match = attribute
- If it is a form submission → tag_hint = form, match = form
- If it is a button → tag_hint = button, match = text
- If it is a download link → tag_hint = link
- If it is normal page text → tag_hint = text
- If it is a large section/banner → tag_hint = container

selector_hint examples:
- input[type=password]
- form[action*=harvest]
- a[href$=".apk"]
- button:has-text("Confirm")

Be precise. Prefer element-level targeting over generic text.
Return only the most relevant element for each flag.
Do NOT return duplicates.
"""

MOCK_RESPONSES = [
    # ---- Call 1 ----
    {
        "flags": [
            {
                "text": "Your Account IS TEMPORARILY Blocked!",
                "type": "urgency",
                "reason": "Uses high-pressure language and threats of permanent suspension to force immediate action.",
                "tag_hint": "container",
                "match": "text",
                "selector_hint": ".blocked-banner"
            },
            {
                "text": "SECURITY SESSION EXPIRES IN: 02:00",
                "type": "urgency",
                "reason": "Artificial countdown timer creates false urgency, a common phishing tactic.",
                "tag_hint": "text",
                "match": "text",
                "selector_hint": "#clock"
            },
            {
                "text": "Secure Identification Portal",
                "type": "general",
                "reason": "Form submits to suspicious endpoint '/api/harvest-login', indicating credential harvesting.",
                "tag_hint": "form",
                "match": "form",
                "selector_hint": "form[action='/api/harvest-login']"
            },
            {
                "text": "Login Password",
                "type": "credential",
                "reason": "Requests the user's primary banking login password.",
                "tag_hint": "input",
                "match": "attribute",
                "selector_hint": "input[name='password']"
            },
            {
                "text": "Transaction Password",
                "type": "credential",
                "reason": "Requests a secondary sensitive password used for authorizing transfers.",
                "tag_hint": "input",
                "match": "attribute",
                "selector_hint": "input[name='txn_password']"
            },
            {
                "text": "Debit/ATM Card Number",
                "type": "financial",
                "reason": "Harvests full card number, expiry, and CVV details.",
                "tag_hint": "input",
                "match": "attribute",
                "selector_hint": "input[name='card_number']"
            },
            {
                "text": "ATM Pin",
                "type": "financial",
                "reason": "Requests ATM PIN, which legitimate banks never collect via web forms.",
                "tag_hint": "input",
                "match": "attribute",
                "selector_hint": "input[name='pin']"
            },
            {
                "text": "Email Password",
                "type": "credential",
                "reason": "Requests email password, a strong indicator of account takeover attempts.",
                "tag_hint": "input",
                "match": "attribute",
                "selector_hint": "input[name='email_pass']"
            },
            {
                "text": "ENTER THE CORRESPONDING GRID VALUES FROM THE BACK OF YOUR CARD",
                "type": "financial",
                "reason": "Attempts to harvest physical card security grid values used for MFA.",
                "tag_hint": "container",
                "match": "text",
                "selector_hint": ".grid-section"
            },
            {
                "text": "i-Secure Bank",
                "type": "branding",
                "reason": "Generic and suspicious bank name commonly used in phishing kits.",
                "tag_hint": "text",
                "match": "text",
                "selector_hint": ".logo-box"
            }
        ]
    },

    # ---- Call 2 ----
    {
        "flags": [
            {
                "text": "i-Secure Bank",
                "type": "branding",
                "reason": "Generic bank name often used in phishing templates.",
                "tag_hint": "text",
                "match": "text",
                "selector_hint": ".logo-box div:last-child"
            },
            {
                "text": "Remaining Time: 01:59",
                "type": "urgency",
                "reason": "Countdown timer pressures users into entering credentials without verification.",
                "tag_hint": "text",
                "match": "text",
                "selector_hint": "#clock"
            },
            {
                "text": "ENTER 6-8 DIGIT OTP",
                "type": "credential",
                "reason": "Designed to capture one-time passwords used for authentication bypass.",
                "tag_hint": "input",
                "match": "attribute",
                "selector_hint": "input[name='otp']"
            },
            {
                "text": "Verify & Proceed",
                "type": "credential",
                "reason": "Form submits to suspicious endpoint '/api/harvest-otp' indicating OTP harvesting.",
                "tag_hint": "form",
                "match": "form",
                "selector_hint": "form[action*='harvest-otp']"
            },
            {
                "text": "🛡️ Secure 256-bit encrypted session ID: #KYC-9921",
                "type": "general",
                "reason": "Fake security indicators and technical jargon used to falsely build trust.",
                "tag_hint": "text",
                "match": "text",
                "selector_hint": "p:contains('Secure 256-bit')"
            }
        ]
    },

    # ---- Call 3 ----
    {
        "flags": [
            {
                "text": "i-Secure Bank",
                "type": "branding",
                "reason": "Spoofed or generic financial institution name used to impersonate legitimacy.",
                "tag_hint": "text",
                "match": "text",
                "selector_hint": ".header .logo-box"
            },
            {
                "text": "Your profile has been successfully unblocked.",
                "type": "general",
                "reason": "Fake success message used to build trust before delivering malicious payload.",
                "tag_hint": "text",
                "match": "text",
                "selector_hint": ".content-body p"
            },
            {
                "text": "Download (.APK)",
                "type": "malware",
                "reason": "Prompts APK download, a common delivery method for mobile malware.",
                "tag_hint": "link",
                "match": "text",
                "selector_hint": "a[href$='.apk']"
            }
        ]
    }
]


mock_index = 0

async def analyze_page_text(html: str):
    global mock_index

    # ========================================
    # 🔥 DEV MODE — skip Gemini completely
    # ========================================
    if not USE_AI:
        idx = mock_index % len(MOCK_RESPONSES)

        print(f"⚡ Using MOCK AI response #{idx + 1}")

        mock_index += 1

        return MOCK_RESPONSES[idx]


    # ========================================
    # REAL GEMINI (via ask_gemini wrapper ✅)
    # ========================================
    prompt = f"""
    {PROMPT}

    PAGE CONTENT:
    {html[:12000]}
    """

    raw = await ask_gemini(prompt)

    print(raw)

    try:
        json_str = re.search(r'\{{.*\}}', raw, re.S).group(0)
        return json.loads(json_str)
    except Exception:
        return {"flags": []}
