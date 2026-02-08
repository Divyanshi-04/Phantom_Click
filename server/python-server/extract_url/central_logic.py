"""
Stage 1: Scam-Brain Module
OCR & Psychographic Analysis for Kavach-SMS
"""
from typing import List, Dict, Optional
from .ocr_processor import OCRProcessor
from .entity_extractor import EntityExtractor
from .gemini_categorizer import GeminiCategorizer

class ScamBrain:
    """Main orchestrator for Stage 1 processing"""
    
    def __init__(self, gemini_api_key: str = None):
        self.ocr = OCRProcessor()
        self.entity_extractor = EntityExtractor()
        self.categorizer = GeminiCategorizer(gemini_api_key)
        
        # Urgency lexicon for psychographic analysis
        self.urgency_lexicon = self._load_urgency_lexicon()
    
    def _load_urgency_lexicon(self) -> Dict[str, float]:
        """Load and return urgency lexicon with intensity scores"""
        return {
            'blocked': 0.95, 'block': 0.9, 'suspended': 0.95, 'suspend': 0.9,
            'immediately': 0.85, 'urgent': 0.85, 'emergency': 0.9, 'critical': 0.88,
            'last warning': 0.92, 'final notice': 0.9, 'act now': 0.87,
            'within 30 minutes': 0.93, 'within 2 hours': 0.88, '24 hours': 0.82,
            'immediate action': 0.9, 'take action': 0.8, 'deactivated': 0.9,
            'terminated': 0.92, 'expired': 0.85, 'warning': 0.75, 'alert': 0.7,
            'important': 0.65, 'attention': 0.68, 'update required': 0.72,
            'verify now': 0.78, 'confirm immediately': 0.8, 'security alert': 0.85,
            'unauthorized access': 0.88, 'security breach': 0.9, 'arrears': 0.8,
            'due amount': 0.75, 'payment due': 0.78, 'fine': 0.7, 'penalty': 0.72,
            'outstanding': 0.68, 'today': 0.6, 'now': 0.7, 'asap': 0.75,
            'right away': 0.72, 'without delay': 0.75, 'legal action': 0.85,
            'police complaint': 0.9, 'court case': 0.88, 'investigation': 0.8,
            'cyber crime': 0.85, 'compromise': 0.82, 'hacked': 0.88,
            'breached': 0.85, 'unauthorized': 0.8, 'fraudulent': 0.82,
            'temporary hold': 0.75, 'restricted': 0.78, 'limited access': 0.7,
            'verify identity': 0.72, 'authenticate': 0.68, 'validate': 0.65
        }
    
    async def process_sms(self, image_data: bytes, session_id: str) -> Dict:
        """
        Complete Stage 1 processing pipeline
        
        Args:
            image_data: Bytes of SMS screenshot
            session_id: Unique session identifier
            
        Returns:
            Dictionary matching the strict JSON contract
        """
        try:
            # Step 1: OCR Extraction
            ocr_result = self.ocr.process_image(image_data)
            extracted_text = ocr_result.get('extracted_text', '')
            words = ocr_result.get('words', [])
            
            if not extracted_text:
                return self._create_empty_response(session_id)
            
            # Step 2: Entity Extraction
            entities = self.entity_extractor.extract_entities(extracted_text)
            
            # Step 3: Psychographic Analysis
            psychographic = self._analyze_psychographic(extracted_text, words)
            
            # Step 4: Category Classification
            category_result = await self.categorizer.categorize(
                extracted_text, 
                entities, 
                psychographic['urgency_score']
            )
            
            # Step 5: Build final response
            response = self._build_final_response(
                session_id=session_id,
                extracted_text=extracted_text,
                entities=entities,
                psychographic=psychographic,
                category_result=category_result
            )
            
            return response
            
        except Exception as e:
            print(f"Stage 1 Processing Error: {str(e)}")
            return self._create_error_response(session_id, str(e))
    
    def _analyze_psychographic(self, text: str, words: List[Dict]) -> Dict:
        """Perform psychographic pressure analysis"""
        lower_text = text.lower()
        flagged_phrases = []
        heatmap_data = []
        total_intensity = 0.0
        
        for phrase, base_intensity in self.urgency_lexicon.items():
            if phrase in lower_text:
                # Find all occurrences
                start = 0
                while True:
                    idx = lower_text.find(phrase, start)
                    if idx == -1:
                        break
                    
                    # Calculate bounding box for this occurrence
                    bbox = self._find_phrase_bbox(phrase, idx, words)
                    if bbox:
                        # Adjust intensity based on context
                        intensity = self._adjust_intensity(base_intensity, phrase, text[idx:idx+50])
                        
                        flagged_phrases.append(phrase)
                        heatmap_data.append({
                            'text': phrase,
                            'intensity': intensity,
                            'position': [bbox['x0'], bbox['y0'], bbox['x1'], bbox['y1']]
                        })
                        
                        total_intensity += intensity
                    
                    start = idx + 1
        
        # Calculate urgency score (0-100)
        urgency_score = 0
        if heatmap_data:
            avg_intensity = total_intensity / len(heatmap_data)
            urgency_score = min(100, int(avg_intensity * 100))
        
        # Remove duplicate phrases
        unique_phrases = list(dict.fromkeys(flagged_phrases))
        
        return {
            'urgency_score': urgency_score,
            'flagged_phrases': unique_phrases,
            'heatmap_data': heatmap_data
        }
    
    def _find_phrase_bbox(self, phrase: str, start_idx: int, words: List[Dict]) -> Optional[Dict]:
        """Find bounding box for a phrase in the text"""
        phrase_words = phrase.split()
        phrase_length = len(phrase_words)
        
        # Find word indices that contain this phrase
        word_indices = []
        
        
        for i, word_info in enumerate(words):
            word_start = sum(len(w['text']) + 1 for w in words[:i])
            word_end = word_start + len(word_info['text'])
            
            if start_idx >= word_start and start_idx < word_end:
                # Check if consecutive words match the phrase
                matches = True
                for j in range(phrase_length):
                    if i + j >= len(words):
                        matches = False
                        break
                    
                    expected_word = phrase_words[j]
                    actual_word = words[i + j]['text'].lower()
                    
                    if expected_word not in actual_word and actual_word not in expected_word:
                        matches = False
                        break
                
                if matches:
                    # Calculate combined bounding box
                    bboxes = [words[i + j]['bbox'] for j in range(phrase_length)]
                    x0 = min(b['x0'] for b in bboxes)
                    y0 = min(b['y0'] for b in bboxes)
                    x1 = max(b['x1'] for b in bboxes)
                    y1 = max(b['y1'] for b in bboxes)
                    
                    return {'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1}
        
        return None
    
    def _adjust_intensity(self, base_intensity: float, phrase: str, context: str) -> float:
        """Adjust intensity based on phrase and context"""
        intensity = base_intensity
        
        # Amplify based on phrase type
        if any(word in phrase for word in ['police', 'court', 'legal', 'complaint']):
            intensity = min(1.0, intensity + 0.1)
        
        if any(word in phrase for word in ['minute', 'hour', 'today', 'now']):
            intensity = min(1.0, intensity + 0.05)
        
        if any(word in phrase for word in ['blocked', 'suspended', 'terminated']):
            intensity = min(1.0, intensity + 0.07)
        
        # Amplify based on context
        context_lower = context.lower()
        if any(word in context_lower for word in ['bank', 'account', 'money', 'payment']):
            intensity = min(1.0, intensity + 0.05)
        
        if any(word in context_lower for word in ['immediately', 'urgent', 'emergency']):
            intensity = min(1.0, intensity + 0.03)
        
        return round(intensity, 2)
    
    def _build_final_response(self, session_id: str, extracted_text: str, 
                             entities: Dict, psychographic: Dict, 
                             category_result: Dict) -> Dict:
        """Build the final JSON response matching strict contract"""
        
        return {
            "stage1_output": {
                "extracted_text": extracted_text,
                "extracted_urls": entities.get('urls', []),
                "extracted_phones": entities.get('phones', []),
                "category": category_result.get('category', 'Other'),
                "urgency_score": psychographic.get('urgency_score', 0),
                "flagged_phrases": psychographic.get('flagged_phrases', []),
                "heatmap_data": psychographic.get('heatmap_data', [])
            }
        }
    
    def _create_empty_response(self, session_id: str) -> Dict:
        """Create empty response for graceful failure"""
        return {
            "stage1_output": {
                "extracted_text": "",
                "extracted_urls": [],
                "extracted_phones": [],
                "category": "Other",
                "urgency_score": 0,
                "flagged_phrases": [],
                "heatmap_data": []
            }
        }
    
    def _create_error_response(self, session_id: str, error: str) -> Dict:
        """Create error response (still matching contract)"""
        print(f"Stage 1 Error for session {session_id}: {error}")
        return self._create_empty_response(session_id)
    

        