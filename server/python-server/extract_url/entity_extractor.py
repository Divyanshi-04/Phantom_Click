import re
from typing import List, Dict
from urllib.parse import urlparse
import phonenumbers
from phonenumbers import PhoneNumberFormat

class EntityExtractor:
    """Extract URLs, phone numbers, and keywords from text"""
    
    def __init__(self):
        # URL patterns
        self.url_patterns = [
            r'https?://[^\s<>"\']+',  # Standard URLs
            r'www\.[^\s<>"\']+\.[a-z]{2,}',  # www domains
            r'[a-z0-9\-]+\.(in|com|org|net|co\.in)[^\s]*',  # Common domains
        ]
        
        # Indian phone number patterns
        self.phone_patterns = [
            r'\+91[-\s]?\d{5}[-\s]?\d{5}',  # +91-XXXXX-XXXXX
            r'\+91[-\s]?\d{10}',  # +91 XXXXXXX
            r'0\d{10}',  # 0XXXXXXXXXX
            r'\d{5}[-\s]?\d{5}',  # XXXXX-XXXXX
        ]
        
        # Keywords to detect
        self.keywords = {
            'upi': ['UPI', 'BHIM', 'PAYTM', 'PHONEPE', 'GOOGLEPAY', 'GPay'],
            'kyc': ['KYC', 'VERIFY', 'VERIFICATION'],
            'otp': ['OTP', 'ONE TIME PASSWORD'],
            'financial': ['BANK', 'ACCOUNT', 'TRANSACTION', 'PAYMENT', 'REFUND'],
            'urgency': ['BLOCK', 'SUSPEND', 'IMMEDIATE', 'URGENT'],
            'government': ['GOVERNMENT', 'IT DEPARTMENT', 'INCOME TAX', 'GST'],
            'personal': ['PAN', 'AADHAAR', 'AADHAR', 'DOB', 'PASSWORD']
        }
        
    def extract_urls(self, text: str) -> List[str]:
        """Extract all URLs from text"""
        urls = []
        
        for pattern in self.url_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                url = match.group(0).strip()
                
                # Clean URL
                url = self.clean_url(url)
                
                # Validate URL structure
                if self.is_valid_url(url):
                    urls.append(url)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_urls = []
        for url in urls:
            if url not in seen:
                seen.add(url)
                unique_urls.append(url)
        
        return unique_urls
    
    def clean_url(self, url: str) -> str:
        """Clean and normalize URL"""
        # Remove trailing punctuation
        url = url.rstrip('.,;:!?')
        
        # Add http:// if missing and starts with www
        if url.lower().startswith('www.') and not url.lower().startswith('http'):
            url = 'http://' + url
        
        # Ensure proper casing
        url = url.lower()
        
        return url
    
    def is_valid_url(self, url: str) -> bool:
        """Basic URL validation"""
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except:
            return False
    
    def extract_phone_numbers(self, text: str) -> List[str]:
        """Extract Indian phone numbers"""
        phones = []
        
        # Pattern matching
        for pattern in self.phone_patterns:
            matches = re.finditer(pattern, text)
            for match in matches:
                phone = match.group(0).strip()
                phone = self.normalize_phone(phone)
                
                if phone and phone not in phones:
                    phones.append(phone)
        
        # Try libphonenumber for better parsing
        try:
            for match in phonenumbers.PhoneNumberMatcher(text, "IN"):
                number = phonenumbers.format_number(
                    match.number, 
                    PhoneNumberFormat.E164
                )
                if number and number not in phones:
                    phones.append(number)
        except:
            pass
        
        # Remove duplicates
        return list(dict.fromkeys(phones))
    
    def normalize_phone(self, phone: str) -> str:
        """Normalize phone number format"""
        # Remove all non-digit characters except +
        digits = re.sub(r'[^\d\+]', '', phone)
        
        # Add +91 if starts with 0 or 7/8/9
        if digits.startswith('0') and len(digits) == 11:
            return '+91' + digits[1:]
        elif len(digits) == 10 and digits[0] in ['6', '7', '8', '9']:
            return '+91' + digits
        elif digits.startswith('91') and len(digits) == 12:
            return '+' + digits
        elif digits.startswith('+91') and len(digits) == 13:
            return digits
        
        return None
    
    def extract_keywords(self, text: str) -> Dict[str, List[str]]:
        """Extract and categorize keywords"""
        found_keywords = {}
        upper_text = text.upper()
        
        for category, keyword_list in self.keywords.items():
            found = []
            for keyword in keyword_list:
                if keyword.upper() in upper_text:
                    found.append(keyword)
            
            if found:
                found_keywords[category] = found
        
        return found_keywords
    
    def extract_entities(self, text: str) -> Dict:
        """Extract all entities from text"""
        try:
            urls = self.extract_urls(text)
            phones = self.extract_phone_numbers(text)
            keywords = self.extract_keywords(text)
            
            return {
                'urls': urls,
                'phones': phones,
                'keywords': keywords,
                'success': True
            }
            
        except Exception as e:
            print(f"Entity Extraction Error: {str(e)}")
            return {
                'urls': [],
                'phones': [],
                'keywords': {},
                'success': False,
                'error': str(e)
            }
    
    def mask_sensitive_data(self, text: str) -> str:
        """Mask phone numbers in text for display"""
        # Mask phone numbers
        for phone in self.extract_phone_numbers(text):
            if len(phone) >= 10:
                masked = phone[:3] + 'XXXXXX' + phone[-2:] if len(phone) > 7 else phone
                text = text.replace(phone, masked)
        
        return text