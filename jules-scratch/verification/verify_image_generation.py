import asyncio
from playwright.async_api import async_playwright, expect
import os

async def run_verification(page):
    """The core logic of the verification test."""
    file_path = os.path.abspath("index.html")
    await page.goto(f"file://{file_path}")

    # --- Trip Modal ---
    await page.click("#openCreateTripModalBtn")
    # Wait for a key interactive element in the modal to be visible.
    await expect(page.locator("#saveTripBtn")).to_be_visible()
    await page.fill("#tripNameInput", "Test Trip")
    await page.click("#saveTripBtn")
    await expect(page.locator("#tripModal")).not_to_be_visible()

    # --- Open Trip and Day Modal ---
    await page.locator(".trip-item .btn-primary").first.click()
    await expect(page.locator("#trip-calendar")).to_be_visible()
    await page.locator(".day-cell:not(.inactive)").nth(14).click()
    # Wait for a key interactive element in the day modal to be visible.
    await expect(page.locator("#saveDayBtn")).to_be_visible()

    # --- Interact with Day Modal ---
    image_section_header = page.locator(".expandable-section.modal-expandable:has-text('Image') .expandable-header")
    await image_section_header.click()

    generate_button = page.locator("#generateImageUrlBtn")
    await expect(generate_button).to_be_visible()
    await page.fill("#cityInput", "Paris")

    # --- Handle Alert and Take Screenshot ---
    await page.evaluate("() => window.dialogHandled = false")

    async def handle_dialog(dialog):
        print(f"Alert opened with message: {dialog.message}")
        await page.evaluate("() => window.dialogHandled = true")
        await dialog.dismiss()

    page.on("dialog", handle_dialog)

    await generate_button.click()
    await page.wait_for_function("() => window.dialogHandled")

    await page.screenshot(path="jules-scratch/verification/verification.png")
    print("Screenshot successfully created.")

async def main():
    """Sets up the Playwright environment and runs the verification."""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            await run_verification(page)
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())