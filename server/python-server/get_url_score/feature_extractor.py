# backend/python-ai/stage2/feature_extractor.py

"""
URL Feature Extractor
Extracts technical features from URLs for ML model
"""

import tldextract
import re
import math
from urllib.parse import urlparse
import Levenshtein
import json
from pathlib import Path

class URLFeatureExtractor:
    
    def __init__(self):
        """Initialize feature extractor with legitimate domains list"""
        
        BASE_DIR = Path(__file__).resolve().parent
        ROOT_DIR = BASE_DIR.parent

        domains_file = ROOT_DIR / 'data' / 'legitimate-domains' / 'indian_domains.json'


        if domains_file.exists():
            with open(domains_file, 'r') as f:
                self.legitimate_domains = json.load(f)
        else:
            print(f"⚠️  Warning: {domains_file} not found")
            self.legitimate_domains = {}
        
        # Flatten all domains into one list
        self.all_legit_domains = []
        for category, domains in self.legitimate_domains.items():
            self.all_legit_domains.extend(domains)
    
    def extract_all_features(self, url):
        """
        Extract all features from a URL
        
        Args:
            url (str): URL to analyze
            
        Returns:
            dict: Dictionary of extracted features
        """
        
        features = {}
        
        try:
            # Basic URL parsing
            features.update(self._extract_basic_features(url))
            
            # Look-alike detection
            features.update(self._detect_lookalike(url))
            
            # URL entropy
            features['entropy'] = self._calculate_entropy(url)
            
            # Suspicious patterns
            features.update(self._detect_suspicious_patterns(url))
            
        except Exception as e:
            print(f"Error extracting features from {url}: {e}")
            # Return default features on error
            features = self._get_default_features()
        
        return features
    
    def _extract_basic_features(self, url):
        """Extract basic URL components"""
        
        parsed = urlparse(url)
        extracted = tldextract.extract(url)
        
        return {
            'url_length': len(url),
            'domain_length': len(extracted.domain),
            'subdomain_count': len(extracted.subdomain.split('.')) if extracted.subdomain else 0,
            'path_length': len(parsed.path),
            'has_ip': 1 if self._is_ip_address(extracted.domain) else 0,
            'has_at_symbol': 1 if '@' in url else 0,
            'has_double_slash': 1 if '//' in parsed.path else 0,
            'dash_count': url.count('-'),
            'dot_count': url.count('.'),
            'digit_count': sum(c.isdigit() for c in url),
            'domain': extracted.domain,
            'suffix': extracted.suffix,
            'full_domain': f"{extracted.domain}.{extracted.suffix}"
        }
    
    def _detect_lookalike(self, url):
        """
        Detect look-alike domains using Levenshtein distance
        Compares URL domain against known legitimate domains
        """
        
        extracted = tldextract.extract(url)
        test_domain = f"{extracted.domain}.{extracted.suffix}".lower()
        
        if not self.all_legit_domains:
            # If no legitimate domains loaded, return defaults
            return {
                'levenshtein_distance': -1,
                'closest_legit_domain': 'unknown',
                'lookalike_score': 0,
                'is_potential_lookalike': 0
            }
        
        min_distance = float('inf')
        closest_legit_domain = None
        
        for legit_domain in self.all_legit_domains:
            distance = Levenshtein.distance(test_domain, legit_domain.lower())
            
            if distance < min_distance:
                min_distance = distance
                closest_legit_domain = legit_domain
        
        # Calculate similarity score (0-100)
        max_len = max(len(test_domain), len(closest_legit_domain))
        similarity = (1 - (min_distance / max_len)) * 100 if max_len > 0 else 0
        
        return {
            'levenshtein_distance': min_distance,
            'closest_legit_domain': closest_legit_domain,
            'lookalike_score': round(similarity, 2),
            'is_potential_lookalike': 1 if (min_distance <= 3 and similarity > 70) else 0
        }
    
    def _calculate_entropy(self, url):
        """
        Calculate Shannon entropy of URL
        High entropy = random characters = suspicious
        """
        
        if not url:
            return 0
        
        # Calculate character frequency
        char_freq = {}
        for char in url:
            char_freq[char] = char_freq.get(char, 0) + 1
        
        # Calculate entropy
        entropy = 0
        url_len = len(url)
        
        for freq in char_freq.values():
            probability = freq / url_len
            if probability > 0:
                entropy -= probability * math.log2(probability)
        
        return round(entropy, 2)
    
    def _detect_suspicious_patterns(self, url):
        """Detect common phishing patterns in URL"""
        
        url_lower = url.lower()
        
        # Suspicious keywords commonly used in phishing
        suspicious_keywords = [
            'verify', 'account', 'update', 'confirm', 'login', 'signin',
            'banking', 'secure', 'kyc', 'upi', 'payment', 'suspended',
            'locked', 'unusual', 'click', 'urgent', 'immediately', 'blocked',
            'expires', 'limited', 'verify-account', 'suspend'
        ]
        
        keyword_count = sum(1 for keyword in suspicious_keywords if keyword in url_lower)
        
        # Known suspicious TLDs (often used by scammers)
        suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.gq']
        
        # Indian brand names (if in URL but not official domain)
        indian_brands = ['sbi', 'hdfc', 'icici', 'axis', 'paytm', 'phonepe', 'googlepay']
        
        return {
            'suspicious_keyword_count': keyword_count,
            'has_https': 1 if url.startswith('https://') else 0,
            'has_suspicious_tld': 1 if any(tld in url_lower for tld in suspicious_tlds) else 0,
            'has_brand_name': 1 if any(brand in url_lower for brand in indian_brands) else 0
        }
    
    def _is_ip_address(self, string):
        """Check if string is an IP address"""
        ip_pattern = r'^(\d{1,3}\.){3}\d{1,3}$'
        return bool(re.match(ip_pattern, string))
    
    def _get_default_features(self):
        """Return default feature values on error"""
        return {
            'url_length': 0,
            'domain_length': 0,
            'subdomain_count': 0,
            'path_length': 0,
            'has_ip': 0,
            'has_at_symbol': 0,
            'has_double_slash': 0,
            'dash_count': 0,
            'dot_count': 0,
            'digit_count': 0,
            'domain': '',
            'suffix': '',
            'full_domain': '',
            'levenshtein_distance': -1,
            'closest_legit_domain': 'unknown',
            'lookalike_score': 0,
            'is_potential_lookalike': 0,
            'entropy': 0,
            'suspicious_keyword_count': 0,
            'has_https': 0,
            'has_suspicious_tld': 0,
            'has_brand_name': 0
        }


# Test the feature extractor
if __name__ == "__main__":
    print("=" * 70)
    print("🧪 TESTING URL FEATURE EXTRACTOR")
    print("=" * 70)
    
    extractor = URLFeatureExtractor()
    
    # Test URLs
    test_urls = [
        "https://sbi-kyc-update.in/verify",
        "https://www.sbi.co.in/personal-banking",
        "http://192.168.1.1/login",
        "https://secure-hdfc-netbanking.tk/signin",
        "https://www.google.com"
    ]
    
    for url in test_urls:
        print(f"\n{'='*70}")
        print(f"🔍 Analyzing: {url}")
        print('='*70)
        
        features = extractor.extract_all_features(url)
        
        # Print key features
        print(f"📏 URL Length: {features['url_length']}")
        print(f"🔤 Domain: {features['full_domain']}")
        print(f"📊 Entropy: {features['entropy']}")
        print(f"👥 Look-alike Score: {features['lookalike_score']}")
        print(f"🎯 Closest Legit Domain: {features['closest_legit_domain']}")
        print(f"⚠️  Suspicious Keywords: {features['suspicious_keyword_count']}")
        print(f"🔒 Has HTTPS: {features['has_https']}")
        print(f"🚩 Potential Look-alike: {features['is_potential_lookalike']}")
        
    print("\n" + "=" * 70)
    print("✅ FEATURE EXTRACTION TEST COMPLETE")
    print("=" * 70)
