#!/usr/bin/env python3
"""Generate Nike-style product images for 1000 Fans demo."""
import base64
import os
import time
import httpx

OPENROUTER_KEY = "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"
MODEL = "google/gemini-2.5-flash-image"
API_URL = "https://openrouter.ai/api/v1/chat/completions"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "advocate-plugin", "public", "products")

PRODUCTS = [
    {"filename": "nike-air-max-90.png", "prompt": "Product photo of Nike Air Max 90 sneakers in white/grey/infrared colorway, side profile on clean white background, soft studio lighting, e-commerce style, no text"},
    {"filename": "nike-tech-fleece-hoodie.png", "prompt": "Product photo of Nike Tech Fleece full-zip hoodie in black, flat lay on clean white surface, soft studio lighting, e-commerce style, no text"},
    {"filename": "nike-dri-fit-tee.png", "prompt": "Product photo of Nike Dri-FIT training t-shirt in dark grey with small swoosh logo, flat lay on clean white surface, soft studio lighting, e-commerce style, no text"},
    {"filename": "nike-sportswear-joggers.png", "prompt": "Product photo of Nike Sportswear Club fleece joggers in navy blue, flat lay on clean white surface, soft studio lighting, e-commerce style, no text"},
    {"filename": "nike-heritage-backpack.png", "prompt": "Product photo of Nike Heritage backpack in black with white swoosh logo, front-facing on clean white background, soft studio lighting, e-commerce style, no text"},
]

def generate_image(prompt, filename):
    headers = {"Authorization": f"Bearer {OPENROUTER_KEY}", "Content-Type": "application/json"}
    body = {"model": MODEL, "messages": [{"role": "user", "content": f"Generate a product photo. Square aspect ratio. No text or watermarks. {prompt}"}], "max_tokens": 4096}
    print(f"  Generating {filename}...", end=" ", flush=True)
    try:
        resp = httpx.post(API_URL, headers=headers, json=body, timeout=120.0)
        resp.raise_for_status()
        data = resp.json()
        images = data.get("choices", [{}])[0].get("message", {}).get("images", [])
        if images:
            url = images[0].get("image_url", {}).get("url", "")
            if url.startswith("data:image"):
                img_bytes = base64.b64decode(url.split(",", 1)[1])
                with open(os.path.join(OUTPUT_DIR, filename), "wb") as f:
                    f.write(img_bytes)
                print(f"OK ({len(img_bytes)} bytes)")
                return True
        print("No image in response")
        return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating {len(PRODUCTS)} Nike product images...\n")
    ok = sum(generate_image(p["prompt"], p["filename"]) for p in PRODUCTS if not (time.sleep(1)))
    # time.sleep returns None which is falsy, so the "if not" always passes
    ok = 0
    for p in PRODUCTS:
        if generate_image(p["prompt"], p["filename"]):
            ok += 1
        time.sleep(1)
    print(f"\nDone! {ok}/{len(PRODUCTS)} images generated")
