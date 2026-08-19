import { test, expect } from "@playwright/test";

const previewUrl = process.env.PANSOFIE_PR_PREVIEW_URL;
if (!previewUrl) throw new Error("PANSOFIE_PR_PREVIEW_URL is required");

async function waitForCurrentPreview(page) {
  const marker = "První pilot má ověřit celý vztah, ne jen software.";
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await page.goto(previewUrl, { waitUntil: "domcontentloaded" });
    if (await page.getByText(marker, { exact: true }).count()) return;
    await page.waitForTimeout(10_000);
  }
  throw new Error("PR preview did not update to the current visual head in time");
}

async function assertVisualContract(page) {
  await expect(page.getByRole("heading", { name: /Poznej sebe\./ })).toBeVisible();
  await expect(page.getByText("Mapa příležitostí k reálným Experiences.", { exact: true })).toBeVisible();
  await expect(page.getByText("ILUSTRAČNÍ MAPA · NEJSOU TO POTVRZENÉ PILOTY", { exact: true })).toBeVisible();
  await expect(page.getByText("První pilot má ověřit celý vztah, ne jen software.", { exact: true })).toBeVisible();

  const overflow = await page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.documentWidth).toBeLessThanOrEqual(overflow.viewport + 1);
}

test("desktop 1440 visual reference proof", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await waitForCurrentPreview(page);
  await page.waitForTimeout(1500);
  await assertVisualContract(page);
  await page.screenshot({ path: "test-results/public-ui-reference-desktop-1440.png", fullPage: true });
});

test("mobile 390 visual reference proof", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await waitForCurrentPreview(page);
  await page.waitForTimeout(1500);
  await assertVisualContract(page);
  await page.screenshot({ path: "test-results/public-ui-reference-mobile-390.png", fullPage: true });
});
