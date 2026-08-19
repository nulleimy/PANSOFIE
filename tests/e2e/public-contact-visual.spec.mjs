import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PANSOFIE_LOCAL_URL || "http://127.0.0.1:5173";
const EVIDENCE_DIR = path.resolve("browser-evidence-contact");
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

for (const viewport of [
  { label: "desktop", width: 1440, height: 1100, isMobile: false },
  { label: "mobile", width: 390, height: 844, isMobile: true },
]) {
  test(`truthful contact fallback ${viewport.label}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

    const response = await page.goto(`${BASE_URL}/kontakt`, { waitUntil: "networkidle" });
    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { name: /Veřejný kontaktní kanál zatím není spuštěný/ })).toBeVisible();
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.getByText(/Nic se neodesílá ani neukládá/)).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth + 1);

    await page.screenshot({ path: path.join(EVIDENCE_DIR, `contact-${viewport.label}.png`), fullPage: true });
    expect(errors).toEqual([]);
    await context.close();
  });
}
