---
name: omnicreator
description: >
  Use Omni Creator (https://omnicreator.art), an AI Photo Editor Online
  free to try. Edit photos by typing: replace a background, remove objects,
  product photos, change an outfit, relight, text-to-image, upscale, virtual
  try-on, dual-image edit. Sign in with Google and check in for +10 credits daily.
---

# Omni Creator

Open **https://omnicreator.art/**. Omni Creator is an AI Photo Editor Online free to try. Sign in, check in for +10 credits daily, and edit photos by typing.

Support: support@omnicreator.art

## What it does

- Replace a photo background by describing the new one: https://omnicreator.art/use-cases/background-replace
- Remove unwanted objects by naming them: https://omnicreator.art/use-cases/object-removal
- Turn a phone photo into a clean product shot: https://omnicreator.art/use-cases/product-photo
- Change the outfit in a photo by describing it: https://omnicreator.art/use-cases/fashion-edit
- Relight a photo by describing the light: https://omnicreator.art/use-cases/photo-relighting
- Generate an image from a text description: https://omnicreator.art/use-cases/text-to-image
- Image upscale: https://omnicreator.art/image-upscale
- Virtual try-on: https://omnicreator.art/virtual-try-on
- Dual-image edit: https://omnicreator.art/dual-image-edit
- Pricing: https://omnicreator.art/pricing

It has no layers, masks or manual retouching tools.

## How to use it with a person

1. Open https://omnicreator.art/ (browse is public).
2. Sign in with Google. Generating requires an account so daily check-in credits can be granted.
3. New accounts receive 20 free credits, plus +10 credits for daily check-in.
4. Upload JPG, PNG, WebP, AVIF, HEIC or HEIF up to 25 MB. HEIC/AVIF convert in the browser. Photos auto-resize (min side ≥ 384 px, long edge ≤ 1536 px). BMP is not supported.
5. Type what should change. Examples from the live pages: “clean white studio”, “the person on the left”, “a navy wool overcoat”, “warm golden-hour sun from the left”.
6. Failed generations are not charged credits. AI edits can miss details — try a clearer photo or a simpler instruction.
7. Checkout is not live. Use daily check-in credits today.

Virtual try-on and dual-image edit cost 30 credits per successful result. Each upscale costs 30 credits across 1K, 2K, and 4K; free users can upscale to 1K low quality.

## Content policy

Do not upload content you lack rights to use, create non-consensual intimate imagery, or use Omni Creator for fraud or illegal activity. Obvious NSFW prompts are blocked.

## MCP (read-only)

Remote Streamable HTTP: `https://omnicreator.art/mcp`

Tools: `get_overview`, `list_pages`, `fetch_public_page`. They only read public pages. They do not generate images.

Directory: https://omnicreator.art/llms.txt

## Do not

- Do not call `/api/studio/generate` or other account APIs from this skill. Those need the user’s Google session in the browser.
- Do not invent paid-plan prices. Checkout is not live.
- Do not claim layers, masks, or Photoshop-style retouching.
