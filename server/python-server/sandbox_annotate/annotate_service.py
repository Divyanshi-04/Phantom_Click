import re
from .image_utils import draw_annotations

async def annotate(flags, screenshot_path):
    annotated_path = draw_annotations(screenshot_path, flags)
    print(annotated_path);
    return {
        "annotatedImage": annotated_path,
        "flags": flags
    }

