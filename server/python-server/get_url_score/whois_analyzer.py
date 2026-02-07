# backend/python-ai/stage2/whois_analyzer.py

import whois
from datetime import datetime, timedelta
import requests

class WHOISAnalyzer:
    
    def __init__(self, api_key=None):
        """
        api_key: Optional - for whoisxmlapi.com (1000 free requests/month)
        Get key from: https://whoisxmlapi.com/
        """
        self.api_key = api_key
    
    def analyze_domain(self, domain):
        """Get domain age and registration info"""
        
        try:
            if self.api_key:
                return self._analyze_via_api(domain)
            else:
                return self._analyze_via_library(domain)
        
        except Exception as e:
            print(f"❌ WHOIS error for {domain}: {e}")
            return self._get_default_result()
    
    def _analyze_via_library(self, domain):
        """Use python-whois library (free but less reliable)"""
        
        try:
            w = whois.whois(domain)
            
            creation_date = w.creation_date
            if isinstance(creation_date, list):
                creation_date = creation_date[0]
            
            if creation_date:
                age_days = (datetime.now() - creation_date).days
                
                return {
                    'domain_age_days': age_days,
                    'creation_date': creation_date.isoformat(),
                    'is_recently_created': 1 if age_days < 30 else 0,
                    'is_very_new': 1 if age_days < 3 else 0,
                    'registrar': w.registrar if hasattr(w, 'registrar') else 'Unknown',
                    'status': 'success'
                }
            
        except Exception as e:
            print(f"Library lookup failed: {e}")
        
        return self._get_default_result()
    
    def _analyze_via_api(self, domain):
        """Use WHOISXMLApi (requires API key)"""
        
        url = f"https://www.whoisxmlapi.com/whoisserver/WhoisService"
        params = {
            'apiKey': self.api_key,
            'domainName': domain,
            'outputFormat': 'JSON'
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if 'WhoisRecord' in data:
            record = data['WhoisRecord']
            creation_date_str = record.get('createdDate', '')
            
            if creation_date_str:
                creation_date = datetime.fromisoformat(creation_date_str.replace('Z', '+00:00'))
                age_days = (datetime.now() - creation_date).days
                
                return {
                    'domain_age_days': age_days,
                    'creation_date': creation_date.isoformat(),
                    'is_recently_created': 1 if age_days < 30 else 0,
                    'is_very_new': 1 if age_days < 3 else 0,
                    'registrar': record.get('registrarName', 'Unknown'),
                    'status': 'success'
                }
        
        return self._get_default_result()
    
    def _get_default_result(self):
        """Return safe defaults when lookup fails"""
        return {
            'domain_age_days': -1,  # Unknown
            'creation_date': None,
            'is_recently_created': 0,
            'is_very_new': 0,
            'registrar': 'Unknown',
            'status': 'failed'
        }

# Test
if __name__ == "__main__":
    analyzer = WHOISAnalyzer()
    
    test_domains = ['google.com', 'sbi.co.in']
    
    for domain in test_domains:
        print(f"\n📋 WHOIS for: {domain}")
        result = analyzer.analyze_domain(domain)
        print(result)
