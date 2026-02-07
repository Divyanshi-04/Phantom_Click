# backend/python-ai/stage2/download_phishing_data.py

"""
Download Phishing Datasets - EXACTLY as per original roadmap
Creates files: phishtank_raw.csv, phishing_urls.csv, openphish.csv, legitimate_urls.csv
"""

import requests
import pandas as pd
from pathlib import Path
import json

def get_project_root():
    """Get project root directory"""
    script_path = Path(__file__).resolve()
    project_root = script_path.parent.parent.parent.parent
    return project_root

def download_phishtank():
    """Download verified phishing URLs from PhishTank"""
    
    project_root = get_project_root()
    data_dir = project_root / 'data' / 'datasets'
    data_dir.mkdir(parents=True, exist_ok=True)
    
    print("=" * 70)
    print("📥 STEP 1: DOWNLOADING PHISHTANK DATA")
    print("=" * 70)
    
    url = "http://data.phishtank.com/data/online-valid.csv"
    
    try:
        print(f"⬇️  Downloading from: {url}")
        print("⏳ Please wait (30-60 seconds)...")
        
        response = requests.get(url, timeout=120)
        response.raise_for_status()
        
        # Save raw data - EXACT filename from roadmap
        raw_file = data_dir / 'phishtank_raw.csv'
        with open(raw_file, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Saved: phishtank_raw.csv")
        
        # Load and process
        df = pd.read_csv(raw_file)
        
        # Keep relevant columns - EXACT as per roadmap
        df_clean = df[['url', 'phish_id', 'verified', 'submission_time']].copy()
        df_clean['label'] = 1  # 1 = phishing
        
        # Save cleaned data - EXACT filename from roadmap
        clean_file = data_dir / 'phishing_urls.csv'
        df_clean.to_csv(clean_file, index=False)
        
        print(f"✅ Saved: phishing_urls.csv ({len(df_clean)} URLs)")
        print("=" * 70)
        
        return df_clean
    
    except Exception as e:
        print(f"❌ ERROR: {e}")
        print("💡 TIP: PhishTank may be slow. Try again or skip.")
        return None

def download_openphish():
    """Download from OpenPhish - EXACT as per roadmap"""
    
    project_root = get_project_root()
    data_dir = project_root / 'data' / 'datasets'
    
    print("\n" + "=" * 70)
    print("📥 STEP 2: DOWNLOADING OPENPHISH DATA")
    print("=" * 70)
    
    url = "https://openphish.com/feed.txt"
    
    try:
        print(f"⬇️  Downloading from: {url}")
        response = requests.get(url, timeout=60)
        response.raise_for_status()
        
        urls = response.text.strip().split('\n')
        urls = [u.strip() for u in urls if u.strip()]
        
        df = pd.DataFrame({
            'url': urls,
            'label': 1,
            'source': 'openphish'
        })
        
        # Save - EXACT filename from roadmap
        output_file = data_dir / 'openphish.csv'
        df.to_csv(output_file, index=False)
        
        print(f"✅ Saved: openphish.csv ({len(df)} URLs)")
        print("=" * 70)
        
        return df
    
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return None

def create_legitimate_dataset():
    """Create legitimate URL dataset - EXACT as per roadmap"""
    
    project_root = get_project_root()
    data_dir = project_root / 'data' / 'datasets'
    domains_file = project_root / 'data' / 'legitimate-domains' / 'indian_domains.json'
    
    print("\n" + "=" * 70)
    print("📥 STEP 3: CREATING LEGITIMATE URLS")
    print("=" * 70)
    
    legitimate_urls = []
    
    # Add known legitimate domains
    if domains_file.exists():
        with open(domains_file, 'r') as f:
            domains = json.load(f)
            for category, urls in domains.items():
                for url in urls:
                    legitimate_urls.append({
                        'url': f'https://{url}',
                        'label': 0,  # 0 = legitimate
                        'source': 'curated'
                    })
    else:
        print("⚠️  indian_domains.json not found. Run download_legitimate_domains.py first!")
    
    # Add international legitimate sites
    top_sites = [
        'google.com', 'facebook.com', 'amazon.com', 'twitter.com',
        'linkedin.com', 'microsoft.com', 'apple.com', 'github.com',
        'stackoverflow.com', 'reddit.com', 'wikipedia.org', 'netflix.com'
    ]
    
    for site in top_sites:
        legitimate_urls.append({
            'url': f'https://{site}',
            'label': 0,
            'source': 'top_sites'
        })
    
    df_legit = pd.DataFrame(legitimate_urls)
    
    # Save - EXACT filename from roadmap
    output_file = data_dir / 'legitimate_urls.csv'
    df_legit.to_csv(output_file, index=False)
    
    print(f"✅ Saved: legitimate_urls.csv ({len(df_legit)} URLs)")
    print("=" * 70)
    
    return df_legit

def main():
    """Main function - follows EXACT roadmap sequence"""
    
    print("\n🚀 PHISHING DATA DOWNLOAD (Original Roadmap)")
    print("=" * 70)
    
    # Step 1: PhishTank
    download_phishtank()
    
    # Step 2: OpenPhish
    download_openphish()
    
    # Step 3: Legitimate URLs
    create_legitimate_dataset()
    
    # Summary
    project_root = get_project_root()
    data_dir = project_root / 'data' / 'datasets'
    
    print("\n" + "=" * 70)
    print("✅ DOWNLOAD COMPLETE - FILES CREATED:")
    print("=" * 70)
    
    files = [
        'phishtank_raw.csv',
        'phishing_urls.csv',
        'openphish.csv',
        'legitimate_urls.csv'
    ]
    
    for filename in files:
        filepath = data_dir / filename
        if filepath.exists():
            size_kb = filepath.stat().st_size / 1024
            print(f"  ✅ {filename:25} ({size_kb:.1f} KB)")
        else:
            print(f"  ❌ {filename:25} (NOT FOUND)")
    
    print("=" * 70)
    print(f"📂 Location: {data_dir}")
    print("\n💡 NEXT STEP: Run prepare_training_data.py")
    print("=" * 70)

if __name__ == "__main__":
    main()