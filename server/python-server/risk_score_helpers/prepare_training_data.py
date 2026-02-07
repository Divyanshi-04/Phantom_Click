# backend/python-ai/stage2/prepare_training_data.py

"""
Prepare Training Dataset
Extract features from all URLs for ML training
"""

import pandas as pd
from pathlib import Path
from feature_extractor import URLFeatureExtractor
from whois_analyzer import WHOISAnalyzer
from ssl_checker import SSLChecker
import tldextract

def get_project_root():
    """Get project root directory"""
    script_path = Path(__file__).resolve()
    project_root = script_path.parent.parent.parent.parent
    return project_root

def prepare_dataset():
    """Prepare complete feature dataset"""
    
    project_root = get_project_root()
    data_dir = project_root / 'data' / 'datasets'
    
    print("=" * 70)
    print("🔧 PREPARING TRAINING DATASET")
    print("=" * 70)
    
    # Load phishing and legitimate URLs
    phishing_file = data_dir / 'phishing_urls.csv'
    legit_file = data_dir / 'legitimate_urls.csv'
    
    print(f"📂 Loading data from:")
    print(f"   {phishing_file}")
    print(f"   {legit_file}")
    
    try:
        phishing_df = pd.read_csv(phishing_file)
        legit_df = pd.read_csv(legit_file)
    except FileNotFoundError as e:
        print(f"❌ ERROR: File not found - {e}")
        return None
    
    # Combine
    all_urls = pd.concat([
        phishing_df[['url', 'label']],
        legit_df[['url', 'label']]
    ]).reset_index(drop=True)
    
    print("\n" + "=" * 70)
    print("📊 DATASET STATISTICS")
    print("=" * 70)
    print(f"   Total URLs: {len(all_urls)}")
    print(f"   Phishing (1): {len(phishing_df)}")
    print(f"   Legitimate (0): {len(legit_df)}")
    print("=" * 70)
    
    # Initialize feature extractors
    print("\n🔧 Initializing feature extractors...")
    url_extractor = URLFeatureExtractor()
    whois_analyzer = WHOISAnalyzer()  # Add API key if you have one
    ssl_checker = SSLChecker()
    
    features_list = []
    errors = 0
    
    print("\n" + "=" * 70)
    print("⚙️  EXTRACTING FEATURES (This may take a few minutes)")
    print("=" * 70)
    
    for idx, row in all_urls.iterrows():
        # Progress indicator
        if idx % 50 == 0:
            print(f"📊 Processing {idx}/{len(all_urls)}... ({(idx/len(all_urls)*100):.1f}%)")
        
        url = row['url']
        label = row['label']
        
        try:
            # Extract URL features (fast)
            url_features = url_extractor.extract_all_features(url)
            
            # Get domain for WHOIS/SSL
            extracted = tldextract.extract(url)
            domain = f"{extracted.domain}.{extracted.suffix}"
            
            # WHOIS features - COMMENTED OUT (too slow for training)
            # Uncomment if you want domain age features
            # whois_features = whois_analyzer.analyze_domain(domain)
            
            # SSL features - COMMENTED OUT (too slow for training)
            # Uncomment if you want SSL certificate features
            # ssl_features = ssl_checker.check_certificate(url)
            
            # Combine all features
            combined = {
                **url_features,
                # **whois_features,  # Uncomment if using WHOIS
                # **ssl_features,     # Uncomment if using SSL
                'label': label
            }
            
            features_list.append(combined)
        
        except Exception as e:
            errors += 1
            if errors <= 5:  # Only print first 5 errors
                print(f"⚠️  Error processing {url}: {e}")
            continue
    
    print(f"\n✅ Feature extraction complete!")
    print(f"   Successful: {len(features_list)}")
    print(f"   Errors: {errors}")
    
    # Create DataFrame
    print("\n🔧 Creating feature DataFrame...")
    df = pd.DataFrame(features_list)
    
    print(f"📋 All columns: {list(df.columns)}")
    
    # Remove non-numeric columns for ML
    # Keep only numeric columns + label
    non_numeric_cols = ['domain', 'suffix', 'full_domain', 'closest_legit_domain']
    
    # Drop non-numeric columns
    df_numeric = df.drop(columns=[col for col in non_numeric_cols if col in df.columns])
    
    print(f"\n📊 Numeric features: {list(df_numeric.columns)}")
    
    # Save
    output_file = data_dir / 'features_dataset.csv'
    df_numeric.to_csv(output_file, index=False)
    
    print("\n" + "=" * 70)
    print("✅ FEATURE DATASET SAVED")
    print("=" * 70)
    print(f"📄 File: {output_file}")
    print(f"📊 Samples: {len(df_numeric)}")
    print(f"🔢 Features: {len(df_numeric.columns) - 1}")
    print(f"📋 Feature names: {list(df_numeric.columns)}")
    print("=" * 70)
    
    return df_numeric

if __name__ == "__main__":
    try:
        print("\n🚀 Starting feature extraction pipeline...")
        result = prepare_dataset()
        
        if result is not None:
            print("\n🎉 SUCCESS! Dataset ready for training.")
            print("💡 Next step: Run train_model.py")
        else:
            print("\n❌ Failed to prepare dataset. Check errors above.")
    
    except KeyboardInterrupt:
        print("\n\n⚠️  Process interrupted by user.")
    except Exception as e:
        print(f"\n❌ FATAL ERROR: {e}")
        import traceback
        traceback.print_exc()