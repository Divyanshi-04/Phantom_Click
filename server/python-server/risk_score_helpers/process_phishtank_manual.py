# backend/python-ai/stage2/process_phishtank_manual.py

"""
Process manually downloaded PhishTank file
"""

import pandas as pd
from pathlib import Path

def get_project_root():
    script_path = Path(__file__).resolve()
    project_root = script_path.parent.parent.parent.parent
    return project_root

def process_phishtank():
    """Process manually downloaded phishtank_raw.csv"""
    
    project_root = get_project_root()
    data_dir = project_root / 'data' / 'datasets'
    
    raw_file = data_dir / 'phishtank_raw.csv'
    
    print("=" * 70)
    print("🔄 PROCESSING PHISHTANK DATA")
    print("=" * 70)
    
    if not raw_file.exists():
        print(f"❌ File not found: {raw_file}")
        print("\n📥 Please download manually:")
        print("1. Go to: http://data.phishtank.com/data/online-valid.csv")
        print("2. Save as: phishtank_raw.csv")
        print(f"3. Move to: {data_dir}")
        return None
    
    try:
        # Load raw data
        print(f"📂 Loading: {raw_file}")
        df = pd.read_csv(raw_file)
        
        print(f"📊 Loaded {len(df)} rows")
        print(f"📋 Columns: {list(df.columns)}")
        
        # Keep relevant columns
        columns_to_keep = ['url', 'phish_id', 'verified', 'submission_time']
        
        # Check if columns exist
        available_cols = [col for col in columns_to_keep if col in df.columns]
        
        if 'url' not in available_cols:
            print("❌ ERROR: 'url' column not found!")
            return None
        
        df_clean = df[available_cols].copy()
        df_clean['label'] = 1  # 1 = phishing
        
        # Save cleaned data
        clean_file = data_dir / 'phishing_urls.csv'
        df_clean.to_csv(clean_file, index=False)
        
        print("=" * 70)
        print("✅ SUCCESS")
        print("=" * 70)
        print(f"📄 Created: phishing_urls.csv ({len(df_clean)} URLs)")
        print(f"📂 Location: {clean_file}")
        print("=" * 70)
        
        return df_clean
    
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    process_phishtank()