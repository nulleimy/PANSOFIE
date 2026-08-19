import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PANSOFIE_LOCAL_URL || "http://127.0.0.1:5173";
const EVIDENCE_DIR = path.resolve("browser-evidence");
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const ROUTES = [
  ["home", "/"],
  ["jak-funguje", "/jak-funguje"],
  ["pilot", "/pilot"],
  ["pansofiedit", "/zapojit-se?mode=simulator"],
];

function captureRuntimeErrors(page) {
  const errors = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(`console: ${msg.text()}`); });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("response", (response) => {
    try {
      const url = new URL(response.url());
      if (url.origin === new URL(BASE_URL).origin && response.status() >= 500) errors.push(`http ${response.status()}: ${response.url()}`);
    } catch {}
  });
  return errors;
}

for (const [name, route] of ROUTES) {
  for (const viewport of [
    { label: "desktop", width: 1440, height: 1100, isMobile: false },
    { label: "mobile", width: 390, height: 844, isMobile: true },
  ]) {
    test(`${name} ${viewport.label} visual acceptance`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.isMobile });
      const page = await context.newPage();
      const errors = captureRuntimeErrors(page);
      const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
      expect(response).not.toBeNull();
      expect(response.status()).toBeLessThan(400);

      const dimensions = await page.evaluate(() => ({
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scrollWidth, `${name} ${viewport.label} horizontal overflow`).toBeLessThanOrEqual(dimensions.innerWidth + 1);

      await page.screenshot({ path: path.join(EVIDENCE_DIR, `${name}-${viewport.label}.png`), fullPage: true });
      expect(errors, `${name} ${viewport.label} runtime errors:\n${errors.join("\n")}`).toEqual([]);
      await context.close();
    });
  }
}

test("homepage R1 hierarchy and CTA contract", async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: /Poznej sebe.*Tvoř s druhými.*Zlepšuj svět/i })).toBeVisible();
  const primary = page.getByRole("link", { name: /Vyzkoušet Pansofii za 60 sekund/i }).first();
  await expect(primary).toBeVisible();
  await expect(primary).toHaveAttribute("href", "/zapojit-se?mode=simulator");
  await expect(page.getByRole("link", { name: /Jak Pansofie funguje/i }).first()).toHaveAttribute("href", "/jak-funguje");
  await expect(page.getByText("Jedna Experience").first()).toBeVisible();
  await expect(page.getByText(/Bounded runtime na stagingu/i)).toHaveCount(0);
  await expect(page.getByText(/STAGING VERIFIED/i)).toHaveCount(0);
});

test("PANSOFIEDIT reaches a truthful role-aware next step without fake submit", async ({ page }) => {
  const errors = captureRuntimeErrors(page);
  await page.goto(`${BASE_URL}/zapojit-se?role=school`, { waitUntil: "networkidle" });

  await page.getByRole("button", { name: /Více reálných zkušeností ve výuce/ }).click();
  await page.getByRole("button", { name: /Pokračovat/ }).click();
  await page.getByRole("button", { name: /Kohortu žáků a pedagogické vedení/ }).click();
  await page.getByRole("button", { name: /Pokračovat/ }).click();
  await page.getByRole("button", { name: /Plýtváme materiálem/ }).click();
  await page.getByRole("button", { name: /Pokračovat/ }).click();
  await page.getByRole("button", { name: /Firma \/ organizace/ }).click();
  await page.getByRole("button", { name: /Pokračovat/ }).click();

  await expect(page.getByText(/Právě jste prošli principem Pansofie/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Prozkoumat školní pilot/i })).toHaveAttribute("href", "/pilot");
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.getByText(/nic neposílá na server|nic neodesílá ani neukládá na server/i).first()).toBeVisible();
  expect(errors, `PANSOFIEDIT runtime errors:\n${errors.join("\n")}`).toEqual([]);
});
