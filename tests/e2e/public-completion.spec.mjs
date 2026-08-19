import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PANSOFIE_STAGING_URL || "https://pansofie-staging.vercel.app";

function runtimeErrors(page) {
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("response", (response) => {
    try {
      const url = new URL(response.url());
      const base = new URL(BASE_URL);
      if (url.origin === base.origin && response.status() >= 500) errors.push(`http ${response.status()}: ${response.url()}`);
    } catch {}
  });
  return errors;
}

const ROUTES = [
  ["/zapojit-se", /Vyzkoušejte Pansofii/],
  ["/kontakt", /Veřejný kontaktní kanál/],
  ["/o-projektu", /Pansofie staví učení/],
  ["/soukromi", /Soukromí podle účelu/],
  ["/bezpecnost", /Bezpečnost není disclaimer/],
  ["/podminky", /Veřejný web popisuje připravovaný produkt/],
  ["/register", /Registrace je nyní pouze na pozvání/],
  ["/login", /Vítej zpět/],
];

for (const [path, heading] of ROUTES) {
  test(`completion route ${path} renders without runtime failure`, async ({ page }) => {
    const errors = runtimeErrors(page);
    const response = await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();
    expect(errors, `runtime errors on ${path}:\n${errors.join("\n")}`).toEqual([]);
  });
}

test("public contact is a truthful non-submit fallback with meaningful next actions", async ({ page }) => {
  const errors = runtimeErrors(page);
  await page.goto(`${BASE_URL}/kontakt`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: /Veřejný kontaktní kanál zatím není spuštěný/ })).toBeVisible();
  await expect(page.getByText(/Nechceme předstírat funkční formulář/)).toBeVisible();
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Prozkoumat školní pilot/ })).toHaveAttribute("href", "/pilot");
  await expect(page.getByRole("link", { name: /Jak funguje partnerství/ })).toHaveAttribute("href", "/partneri");
  await expect(page.getByRole("link", { name: /Vyzkoušet Pansofii za 60 sekund/ })).toHaveAttribute("href", "/zapojit-se?mode=simulator");
  await expect(page.getByRole("link", { name: /Jak Pansofie funguje/ }).last()).toHaveAttribute("href", "/jak-funguje");
  await expect(page.getByText(/Nic se neodesílá ani neukládá/)).toBeVisible();
  expect(errors, `runtime errors on /kontakt:\n${errors.join("\n")}`).toEqual([]);
});

test("professional homepage exposes one dominant Experience entry and truthful readiness state", async ({ page }) => {
  const errors = runtimeErrors(page);
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  await expect(page.getByText("Experience-first ekosystém")).toBeVisible();
  const primary = page.getByRole("link", { name: /Vyzkoušet Pansofii za 60 sekund/ }).first();
  await expect(primary).toBeVisible();
  await expect(primary).toHaveAttribute("href", "/zapojit-se?mode=simulator");
  await expect(page.getByRole("link", { name: /Jak Pansofie funguje/i }).first()).toHaveAttribute("href", "/jak-funguje");
  await expect(page.getByText("Připraveno pro pilotní zapojení")).toBeVisible();
  await expect(page.getByText(/Rodina může bezpečně přidat kontext a podnět/)).toBeVisible();
  await expect(page.getByText(/Bounded runtime na stagingu/i)).toHaveCount(0);
  await expect(page.getByText(/STAGING VERIFIED/i)).toHaveCount(0);
  expect(errors, `runtime errors on homepage:\n${errors.join("\n")}`).toEqual([]);
});

test("role ecosystem keeps Experience central while switching bounded role accents", async ({ page }) => {
  await page.goto(`${BASE_URL}/#ekosystem`, { waitUntil: "networkidle" });
  await expect(page.getByText("Experience je centrum")).toBeVisible();
  const partner = page.getByRole("button", { name: /Firma \/ organizace/ }).last();
  await partner.click();
  await expect(partner).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/Partner nekupuje hodnocení žáka/)).toBeVisible();
});

test("PANSOFIEDIT offers all six role-adaptive entry points", async ({ page }) => {
  await page.goto(`${BASE_URL}/zapojit-se`, { waitUntil: "networkidle" });
  for (const label of ["Škola", "Rodina", "Firma / organizace", "Obec / komunita", "Mentor / odborník", "Mladý člověk"]) {
    await expect(page.getByRole("button", { name: new RegExp(label.replace("/", "\\/")) })).toBeVisible();
  }
  await expect(page.getByLabel("Živý náhled vznikající Experience")).toBeVisible();
});

test("school journey composes live and ends with a truthful role-aware next step", async ({ page }) => {
  const errors = runtimeErrors(page);
  await page.goto(`${BASE_URL}/zapojit-se?role=school`, { waitUntil: "networkidle" });

  await expect(page.getByLabel("Živý náhled vznikající Experience")).toContainText("Škola");
  await expect(page.getByRole("heading", { name: /Co by měla Pansofie ve vaší škole změnit jako první/ })).toBeVisible();
  await page.getByRole("button", { name: /Více reálných zkušeností ve výuce/ }).click();
  await expect(page.getByLabel("Živý náhled vznikající Experience")).toContainText("Více reálných zkušeností ve výuce");
  await page.getByRole("button", { name: /Pokračovat/ }).click();

  await page.getByRole("button", { name: /Kohortu žáků a pedagogické vedení/ }).click();
  await expect(page.getByLabel("Živý náhled vznikající Experience")).toContainText("1 konkrétní přínos");
  await page.getByRole("button", { name: /Pokračovat/ }).click();

  await page.getByRole("button", { name: /Plýtváme materiálem/ }).click();
  await expect(page.getByLabel("Živý náhled vznikající Experience")).toContainText("CIRCULAR CHALLENGE");
  await page.getByRole("button", { name: /Pokračovat/ }).click();

  await expect(page.getByRole("heading", { name: /Kdo může být součástí řešení/ })).toBeVisible();
  await page.getByRole("button", { name: /Firma \/ organizace/ }).click();
  await expect(page.getByLabel("Živý náhled vznikající Experience")).toContainText("Firma / organizace");
  await page.getByRole("button", { name: /Pokračovat/ }).click();

  await expect(page.getByText(/Právě jste prošli principem Pansofie/)).toBeVisible();
  await expect(page.getByRole("heading", { name: /Návrh prvního školního pilotu/ }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /Sledujte, jak se problém mění v Experience/ })).toBeVisible();
  await expect(page.getByText(/Výstup není skóre člověka/)).toBeVisible();
  await expect(page.getByRole("button", { name: /Přejít na krok 10: DALŠÍ KROK/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Experience je střed/ })).toBeVisible();

  const next = page.getByRole("link", { name: /Prozkoumat školní pilot/i });
  await expect(next).toBeVisible();
  await expect(next).toHaveAttribute("href", "/pilot");
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.getByText(/Tato ukázka nic neodesílá ani neukládá na server/i)).toBeVisible();
  expect(errors, `runtime errors:\n${errors.join("\n")}`).toEqual([]);
});

test("public registration does not expose self-signup controls", async ({ page }) => {
  await page.goto(`${BASE_URL}/register`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: /Registrace je nyní pouze na pozvání/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Chci se zapojit" })).toHaveAttribute("href", "/zapojit-se");
  await expect(page.getByRole("button", { name: /Vytvořit účet/ })).toHaveCount(0);
});

test("mobile PANSOFIEDIT route has no horizontal overflow", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/zapojit-se?role=partner`, { waitUntil: "networkidle" });
  await expect(page.getByLabel("Živý náhled vznikající Experience")).toBeVisible();
  const dimensions = await page.evaluate(() => ({ innerWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth + 1);
  await page.screenshot({ path: testInfo.outputPath("pansofiedit-r2-mobile.png"), fullPage: true });
  await context.close();
});

test("mobile professional homepage keeps primary action visible without overflow", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await expect(page.getByRole("link", { name: /Vyzkoušet Pansofii za 60 sekund/ }).first()).toBeVisible();
  const dimensions = await page.evaluate(() => ({ innerWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth + 1);
  await page.screenshot({ path: testInfo.outputPath("pansofiedit-professional-home-mobile.png"), fullPage: true });
  await context.close();
});
