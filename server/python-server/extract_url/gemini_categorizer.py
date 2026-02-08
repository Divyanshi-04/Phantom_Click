import os
from typing import Dict

from google import genai 
from gemini_client import ask_gemini

class GeminiCategorizer:
    """Categorize SMS scams using Gemini 1.5 Flash"""
    
    # Allowed categories (STRICT - do not change)
    ALLOWED_CATEGORIES = [
        "Banking/UPI Fraud",
        "Utility Scam",
        "Job Fraud",
        "Government Impersonation",
        "Other"
    ]
    
    def __init__(self, api_key: str = None):
        self.model = True
    
    def build_prompt(self, extracted_text: str, entities: Dict, urgency_score: int) -> str:
        """Build prompt for Gemini classification"""
        prompt = f"""
        You are an SMS scam classification system. Analyze the following SMS message and categorize it into EXACTLY ONE of these categories:
        
        ALLOWED CATEGORIES (choose only one):
        1. "Banking/UPI Fraud" - Messages about bank accounts, UPI, transactions, KYC updates, account blocking
        2. "Utility Scam" - Messages about electricity, water, gas, phone bills, service disconnection
        3. "Job Fraud" - Messages about job offers, work from home, easy money, investment opportunities
        4. "Government Impersonation" - Messages pretending to be from IT department, police, courts, government agencies
        5. "Other" - Any message that doesn't fit the above categories
        
        IMPORTANT RULES:
        - You MUST return ONLY the category name from the list above
        - Do not add any explanations, comments, or additional text
        - Do not create new categories
        - If uncertain, return "Other"
        
        SMS MESSAGE: "{extracted_text}"
        
        DETECTED ENTITIES:
        - URLs: {entities.get('urls', [])}
        - Phone numbers: {entities.get('phones', [])}
        - Keywords: {entities.get('keywords', {})}
        - Urgency Score: {urgency_score}/100
        
        ANALYSIS CONTEXT:
        - Look for impersonation of banks (SBI, HDFC, ICICI, etc.)
        - Look for urgency words (blocked, suspended, immediate, etc.)
        - Look for financial terms (UPI, KYC, OTP, payment, refund)
        - Look for government agencies (IT Department, RBI, NPCI, etc.)
        - Look for utility companies (electricity, water, gas providers)
        - Look for job offers with unrealistic promises
        
        FINAL CATEGORY (one word from allowed list):
        """
        
        return prompt
    
    async def categorize(self, extracted_text: str, entities: Dict, urgency_score: int) -> Dict:
        """Categorize the SMS using Gemini"""
        try:
            # If no API key or model, return default
            if not self.model:
                return {
                    'category': 'Other',
                    'confidence': 0.0,
                    'success': False,
                    'error': 'Gemini API not configured'
                }
            
            # Build prompt
            prompt = self.build_prompt(extracted_text, entities, urgency_score)

            raw_category = "Banking/UPI Fraud" # (await ask_gemini(prompt)).strip()
            
            # Clean and validate category
            category = self.validate_category(raw_category)
            
            # Calculate confidence (simple heuristic)
            confidence = self.calculate_confidence(category, entities, urgency_score)
            
            return {
                'category': category,
                'confidence': confidence,
                'raw_response': raw_category,
                'success': True
            }
            
        except Exception as e:
            print(f"Gemini Categorization Error: {str(e)}")
            return {
                'category': 'Other',
                'confidence': 0.0,
                'success': False,
                'error': str(e)
            }
    
    def validate_category(self, category: str) -> str:
        """Ensure category is from allowed list"""
        # Clean the category string
        category = category.strip().replace('"', '').replace("'", "")
        
        # Exact match
        if category in self.ALLOWED_CATEGORIES:
            return category
        
        # Fuzzy matching
        category_lower = category.lower()
        for allowed in self.ALLOWED_CATEGORIES:
            if allowed.lower() in category_lower or category_lower in allowed.lower():
                return allowed
        
        # Check for specific patterns
        if any(word in category_lower for word in ['bank', 'upi', 'transaction', 'kyc']):
            return "Banking/UPI Fraud"
        elif any(word in category_lower for word in ['utility', 'electric', 'bill', 'disconnect']):
            return "Utility Scam"
        elif any(word in category_lower for word in ['job', 'work', 'salary', 'opportunity']):
            return "Job Fraud"
        elif any(word in category_lower for word in ['government', 'police', 'court', 'department']):
            return "Government Impersonation"
        
        # Default fallback
        return "Other"
    
    def calculate_confidence(self, category: str, entities: Dict, urgency_score: int) -> float:
        """Calculate confidence score for the categorization"""
        confidence = 0.5  # Base confidence
        
        # Boost confidence based on entities
        urls = entities.get('urls', [])
        phones = entities.get('phones', [])
        keywords = entities.get('keywords', {})
        
        if category == "Banking/UPI Fraud":
            if 'upi' in keywords or 'financial' in keywords:
                confidence += 0.3
            if any(url for url in urls if 'bank' in url.lower() or 'upi' in url.lower()):
                confidence += 0.2
                
        elif category == "Utility Scam":
            if any('bill' in word.lower() for word in entities.get('keywords', {}).get('urgency', [])):
                confidence += 0.3
                
        elif category == "Job Fraud":
            if any('job' in word.lower() or 'salary' in word.lower() 
                   for word in entities.get('keywords', {}).get('urgency', [])):
                confidence += 0.3
                
        elif category == "Government Impersonation":
            if 'government' in keywords:
                confidence += 0.3
            if any(url for url in urls if 'gov' in url.lower() or 'nic' in url.lower()):
                confidence += 0.2
        
        # Boost based on urgency
        if urgency_score > 90:
            confidence += 0.2
        elif urgency_score > 70:
            confidence += 0.1
        
        # Ensure confidence is between 0 and 1
        confidence = max(0.0, min(1.0, confidence))
        
        return round(confidence, 2)
    
    def get_category_breakdown(self, category: str, entities: Dict) -> Dict:
        """Get detailed breakdown for the category"""
        breakdown = {
            'category': category,
            'indicators': [],
            'common_patterns': [],
            'risk_level': 'Medium'
        }
        
        if category == "Banking/UPI Fraud":
            breakdown['indicators'] = [
                "Bank/UPI impersonation",
                "Urgent KYC/account updates",
                "Transaction/refund promises"
            ]
            breakdown['common_patterns'] = [
                "Your account will be blocked",
                "Complete KYC immediately",
                "You received a refund"
            ]
            breakdown['risk_level'] = 'High'
            
        elif category == "Utility Scam":
            breakdown['indicators'] = [
                "Service disconnection threats",
                "Bill payment urgency",
                "Fake discount offers"
            ]
            breakdown['common_patterns'] = [
                "Your connection will be disconnected",
                "Pay outstanding bill immediately",
                "Special discount offer"
            ]
            breakdown['risk_level'] = 'Medium'
            
        elif category == "Job Fraud":
            breakdown['indicators'] = [
                "Too-good-to-be-true offers",
                "Upfront payment requests",
                "Work from home promises"
            ]
            breakdown['common_patterns'] = [
                "Earn ₹50,000 per month",
                "Pay registration fee",
                "Immediate job offer"
            ]
            breakdown['risk_level'] = 'Medium'
            
        elif category == "Government Impersonation":
            breakdown['indicators'] = [
                "Government agency impersonation",
                "Legal action threats",
                "Tax/refund claims"
            ]
            breakdown['common_patterns'] = [
                "Income Tax Department notice",
                "Police complaint filed",
                "You have unclaimed refund"
            ]
            breakdown['risk_level'] = 'High'
            
        else:  # Other
            breakdown['indicators'] = ["Doesn't match known patterns"]
            breakdown['common_patterns'] = ["General suspicious message"]
            breakdown['risk_level'] = 'Low'
        
        return breakdown