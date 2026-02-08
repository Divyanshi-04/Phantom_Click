import base64
import io
from PIL import Image
import pytesseract
from typing import Dict, Tuple, Optional

class OCRProcessor:
    """Process SMS screenshots using OCR"""
    
    def __init__(self):
        self.tesseract_config = '--psm 6 --oem 3'
        
    def process_image(self, image_data: bytes) -> Dict:
        """Extract text from image bytes"""
        try:
            # Open image
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Apply OCR
            extracted_text = pytesseract.image_to_string(
                image, 
                config=self.tesseract_config,
                lang='eng'
            ).strip()
            
            # Get word-level data with bounding boxes
            word_data = pytesseract.image_to_data(
                image, 
                config=self.tesseract_config,
                lang='eng',
                output_type=pytesseract.Output.DICT
            )
            
            # Process word data
            words = []
            n_boxes = len(word_data['text'])
            
            for i in range(n_boxes):
                if int(word_data['conf'][i]) > 60:  # Confidence threshold
                    text = word_data['text'][i].strip()
                    if text:
                        words.append({
                            'text': text,
                            'bbox': {
                                'x0': word_data['left'][i],
                                'y0': word_data['top'][i],
                                'x1': word_data['left'][i] + word_data['width'][i],
                                'y1': word_data['top'][i] + word_data['height'][i]
                            },
                            'confidence': float(word_data['conf'][i]) / 100.0
                        })
            
            return {
                'extracted_text': extracted_text,
                'words': words,
                'image_dimensions': image.size,
                'success': True
            }
            
        except Exception as e:
            print(f"OCR Processing Error: {str(e)}")
            return {
                'extracted_text': "",
                'words': [],
                'image_dimensions': (0, 0),
                'success': False,
                'error': str(e)
            }
    
    def process_base64(self, base64_string: str) -> Dict:
        """Process base64 encoded image"""
        try:
            # Remove data URL prefix if present
            if base64_string.startswith('data:image'):
                base64_string = base64_string.split(',')[1]
            
            # Decode base64
            image_bytes = base64.b64decode(base64_string)
            return self.process_image(image_bytes)
            
        except Exception as e:
            print(f"Base64 Processing Error: {str(e)}")
            return {
                'extracted_text': "",
                'words': [],
                'image_dimensions': (0, 0),
                'success': False,
                'error': str(e)
            }
    
    def validate_image(self, image_data: bytes) -> Tuple[bool, Optional[str]]:
        """Validate image before processing"""
        try:
            image = Image.open(io.BytesIO(image_data))
            
            # Check dimensions
            width, height = image.size
            if width < 100 or height < 100:
                return False, "Image too small"
            
            if width > 4000 or height > 4000:
                return False, "Image too large"
            
            # Check format
            if image.format not in ['PNG', 'JPEG', 'JPG']:
                return False, "Invalid image format"
            
            return True, None
            
        except Exception as e:
            return False, f"Invalid image: {str(e)}"