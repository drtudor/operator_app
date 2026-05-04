"""
Generate PWA icons for OPERATOR app.
Requires: pip install pillow
Run: python3 scripts/generate_icons.py
"""
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow not found. Installing...")
    os.system(f"{sys.executable} -m pip install pillow")
    from PIL import Image, ImageDraw, ImageFont


def generate_icon(size):
    img = Image.new("RGB", (size, size), color=(7, 11, 13))  # --bg
    draw = ImageDraw.Draw(img)

    # Amber square background
    margin = size // 6
    draw.rectangle(
        [margin, margin, size - margin, size - margin],
        fill=(200, 168, 75),  # --amber
    )

    # Inner dark square
    inner = size // 4
    draw.rectangle(
        [inner, inner, size - inner, size - inner],
        fill=(7, 11, 13),
    )

    # Try to load a bold font, fall back to default
    font_size = size // 4
    font = None
    font_paths = [
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                font = ImageFont.truetype(path, font_size)
                break
            except Exception:
                continue

    text = "OP"
    if font:
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        x = (size - tw) // 2 - bbox[0]
        y = (size - th) // 2 - bbox[1]
        draw.text((x, y), text, fill=(200, 168, 75), font=font)
    else:
        # Fallback: draw simple amber lines as a logo mark
        lw = max(2, size // 32)
        cx, cy = size // 2, size // 2
        qs = size // 6
        draw.line([(cx - qs, cy - qs), (cx, cy + qs), (cx + qs, cy - qs)], fill=(200, 168, 75), width=lw)

    return img


if __name__ == "__main__":
    os.makedirs("public", exist_ok=True)
    for sz in [192, 512]:
        path = f"public/icon-{sz}.png"
        generate_icon(sz).save(path)
        print(f"Generated {path}")
    print("Done.")
