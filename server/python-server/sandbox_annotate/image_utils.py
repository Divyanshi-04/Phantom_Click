from PIL import Image, ImageDraw
from pathlib import Path
import uuid

BASE_DIR = Path(__file__).resolve().parent.parent  # backend/
STATIC_DIR = BASE_DIR / "static" / "annotated"


def draw_annotations(image_path, boxes):
    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(f"Screenshot not found: {image_path}")

    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)

    for b in boxes:
        x = int(b.get("x", 0))
        y = int(b.get("y", 0))
        w = int(b.get("width", b.get("w", 0)))
        h = int(b.get("height", b.get("h", 0)))

        if w <= 0 or h <= 0:
            continue

        label = b.get("label", "suspicious")
        color = b.get("color", "red")

        draw.rectangle([x, y, x + w, y + h], outline=color, width=4)
        draw.text((x, max(0, y - 18)), label, fill=color)

    STATIC_DIR.mkdir(parents=True, exist_ok=True)

    filename = f"annotated-{uuid.uuid4()}.png"
    filepath = STATIC_DIR / filename

    img.save(filepath)

    return f"/annotated/{filename}"
