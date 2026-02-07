# backend/python-ai/stage2/download_legitimate_domains.py

# backend/python-ai/stage2/download_legitimate_domains.py

import json
import os

# Get the project root directory (3 levels up from this file)
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))

# Define paths relative to project root
data_dir = os.path.join(project_root, 'data', 'legitimate-domains')

# Create directory if it doesn't exist
os.makedirs(data_dir, exist_ok=True)

# Create legitimate_indian_domains.json
legitimate_domains = {
    "banks": [
        "sbi.co.in", "hdfcbank.com", "icicibank.com", "axisbank.com",
        "pnbindia.in", "bankofbaroda.in", "kotakbank.com", "yesbank.in",
        "idbibank.in", "unionbankofindia.co.in", "indianbank.in",
        "canarabank.com", "bankofindia.co.in", "dbs.com/in",
        "sc.com/in", "citibank.co.in", "indusind.com", "rblbank.com",
        "federalbank.co.in", "bandhanbank.com"
    ],
    "government": [
        "gov.in", "india.gov.in", "uidai.gov.in", "incometax.gov.in",
        "npci.org.in", "rbi.org.in", "nic.in", "mygov.in",
        "epfindia.gov.in", "irctc.co.in", "passportindia.gov.in",
        "digitalindia.gov.in", "nsdl.com", "utiitsl.com"
    ],
    "utilities": [
        "adanielectricity.com", "bsesdelhi.com", "mahadiscom.in",
        "cesc.co.in", "tatapower.com", "torrentpower.com",
        "bescom.org", "apspdcl.in"
    ],
    "telecom": [
        "airtel.in", "jio.com", "vi.com", "bsnl.co.in",
        "myvi.in", "airtel.com"
    ],
    "payment": [
        "paytm.com", "phonepe.com", "googlepay.com", "amazonpay.in",
        "mobikwik.com", "freecharge.in", "bhimupi.org.in",
        "bharatpe.com", "cred.club"
    ]
}

# Save to file
output_file = os.path.join(data_dir, 'indian_domains.json')

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(legitimate_domains, f, indent=2)

print("=" * 60)
print("✅ SUCCESS: Legitimate domains saved!")
print("=" * 60)
print(f"📂 Location: {output_file}")
print(f"📊 Total domains: {sum(len(v) for v in legitimate_domains.values())}")
print("\nBreakdown:")
for category, domains in legitimate_domains.items():
    print(f"  • {category.capitalize()}: {len(domains)} domains")
print("=" * 60)