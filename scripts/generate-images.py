#!/usr/bin/env python3
"""
Generate product images using Nano Banana (Gemini image gen) via OpenRouter.
Saves images to frontend/public/products/
"""
import base64
import json
import os
import sys
import time
import httpx

OPENROUTER_KEY = "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"
MODEL = "google/gemini-2.5-flash-image"
API_URL = "https://openrouter.ai/api/v1/chat/completions"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "products")

PRODUCTS = [
    {
        "filename": "classic-logo-tee.png",
        "prompt": "Minimal flat-lay product photo of a black cotton crew-neck t-shirt with a small embroidered logo on the chest, on a clean white marble surface, soft natural lighting, fashion e-commerce style, high-end DTC brand aesthetic"
    },
    {
        "filename": "everyday-hoodie.png",
        "prompt": "Minimal flat-lay product photo of a charcoal grey heavyweight hoodie with kangaroo pocket, on a clean light surface, soft natural lighting, fashion e-commerce style, premium streetwear brand aesthetic"
    },
    {
        "filename": "essential-joggers.png",
        "prompt": "Minimal flat-lay product photo of slim-fit black cotton joggers with tapered ankles, on a clean white surface, soft natural lighting, fashion e-commerce style, modern minimalist brand aesthetic"
    },
    {
        "filename": "signature-cap.png",
        "prompt": "Minimal product photo of a black baseball cap with subtle embroidered logo, slight angle, on a clean white surface, soft natural lighting, fashion e-commerce style, premium streetwear aesthetic"
    },
    {
        "filename": "artist-collab-hoodie.png",
        "prompt": "Minimal flat-lay product photo of a multicolor artistic print oversized hoodie, bold graphic design, on a clean white surface, soft natural lighting, fashion e-commerce style, limited edition streetwear drop aesthetic"
    },
    {
        "filename": "heritage-leather-wallet.png",
        "prompt": "Minimal product photo of a tan full-grain leather bifold wallet, slightly open to show card slots, on a clean dark surface, soft natural lighting, fashion e-commerce style, luxury accessories brand aesthetic"
    },
    {
        "filename": "embroidered-varsity-jacket.png",
        "prompt": "Minimal flat-lay product photo of a black and gold embroidered varsity jacket with leather sleeves, on a clean white surface, soft natural lighting, fashion e-commerce style, premium limited edition aesthetic"
    },
    {
        "filename": "premium-scented-candle-set.png",
        "prompt": "Minimal product photo of a set of three luxury scented candles in matte ceramic containers, arranged together, on a clean light surface, soft natural lighting, lifestyle e-commerce style, minimalist home brand aesthetic"
    },
]

def generate_image(prompt: str, filename: str):
    """Generate a single image via OpenRouter Nano Banana."""
    headers = {
        "Authorization": f"Bearer {OPENROUTER_KEY}",
        "Content-Type": "application/json",
    }
    body = {
        "model": MODEL,
        "messages": [
            {
                "role": "user",
                "content": f"Generate a product photo. Style: clean, minimal, high-end fashion e-commerce. Square aspect ratio. No text or watermarks. {prompt}"
            }
        ],
        "max_tokens": 4096,
    }

    print(f"  Generating {filename}...", end=" ", flush=True)
    try:
        resp = httpx.post(API_URL, headers=headers, json=body, timeout=120.0)
        resp.raise_for_status()
        data = resp.json()

        # Extract image from response
        message = data.get("choices", [{}])[0].get("message", {})

        # Check for images array
        images = message.get("images", [])
        if images:
            img_url = images[0].get("image_url", {}).get("url", "")
            if img_url.startswith("data:image"):
                b64_data = img_url.split(",", 1)[1]
                img_bytes = base64.b64decode(b64_data)
                filepath = os.path.join(OUTPUT_DIR, filename)
                with open(filepath, "wb") as f:
                    f.write(img_bytes)
                print(f"OK ({len(img_bytes)} bytes)")
                return True

        # Fallback: check content for inline image
        content = message.get("content", "")
        if "multipart" in str(data) or "inline_data" in str(data):
            # Try to find base64 in the raw response
            raw = json.dumps(data)
            if "base64" in raw:
                # Find base64 chunks
                parts = data.get("choices", [{}])[0].get("message", {}).get("content", [])
                if isinstance(parts, list):
                    for part in parts:
                        if isinstance(part, dict) and part.get("type") == "image_url":
                            url = part.get("image_url", {}).get("url", "")
                            if url.startswith("data:image"):
                                b64_data = url.split(",", 1)[1]
                                img_bytes = base64.b64decode(b64_data)
                                filepath = os.path.join(OUTPUT_DIR, filename)
                                with open(filepath, "wb") as f:
                                    f.write(img_bytes)
                                print(f"OK ({len(img_bytes)} bytes)")
                                return True

        # Debug: show what we got
        print(f"No image found in response. Keys: {list(message.keys())}")
        # Save raw response for debugging
        debug_path = os.path.join(OUTPUT_DIR, f"{filename}.debug.json")
        with open(debug_path, "w") as f:
            json.dump(data, f, indent=2, default=str)
        print(f"  Debug saved to {debug_path}")
        return False

    except Exception as e:
        print(f"ERROR: {e}")
        return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating {len(PRODUCTS)} product images...\n")

    success = 0
    for product in PRODUCTS:
        if generate_image(product["prompt"], product["filename"]):
            success += 1
        time.sleep(1)  # Rate limit buffer

    print(f"\nDone! {success}/{len(PRODUCTS)} images generated in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
