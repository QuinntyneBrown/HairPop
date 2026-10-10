"""Render the HairPop business card to print-ready PDFs and PNG proofs.

Run from the repository root:

    python docs/business-cards/render.py

Needs Python Playwright with Chromium (`pip install playwright && playwright install chromium`).
"""

from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
SOURCE = (HERE / "business-card.html").as_uri()
OUT = HERE / "dist"
NAME = "hairpop-business-card-quinntyne-brown"

TRIM_W, TRIM_H, BLEED = 3.5, 2.0, 0.125
BLEED_W, BLEED_H = TRIM_W + 2 * BLEED, TRIM_H + 2 * BLEED
PROOF_DPI = 300


def pdf(page, query, path):
    page.goto(f"{SOURCE}?{query}")
    page.evaluate("document.fonts.ready")
    page.emulate_media(media="print")
    # The page declares its own @page size: the bleed box, or the larger crop-mark sheet.
    page.pdf(path=str(path), prefer_css_page_size=True, print_background=True)
    print(f"wrote {path.relative_to(HERE)}")


def main():
    OUT.mkdir(exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()

        page = browser.new_page()
        # Press-ready: each side is one page at the full bleed size, no marks.
        pdf(page, "", OUT / f"{NAME}.pdf")
        # Same art on a larger sheet with crop marks, for printers who trim by hand.
        pdf(page, "marks=1", OUT / f"{NAME}-crop-marks.pdf")
        page.close()

        # 300 dpi PNG proofs of each side, with trim and safe guides.
        scale = PROOF_DPI / 96
        page = browser.new_page(viewport={"width": round(BLEED_W * 96), "height": round(BLEED_H * 96)},
                                device_scale_factor=scale)
        page.goto(f"{SOURCE}?guides=1")
        page.evaluate("document.fonts.ready")
        for index, side in enumerate(("front", "back")):
            path = OUT / f"{NAME}-{side}-proof.png"
            page.locator(".card").nth(index).screenshot(path=str(path))
            print(f"wrote {path.relative_to(HERE)}")
        browser.close()


if __name__ == "__main__":
    main()
