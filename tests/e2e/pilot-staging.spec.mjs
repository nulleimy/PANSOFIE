import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PANSOFIE_STAGING_URL || "https://pansofie-staging.vercel.app";

function runtimeErrors(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("response", (response) => {
    try {
      const url = new URL(response.url());
      const base = new URL(BASE_URL);
      if (url.origin === base.origin && response.status() >= 500) {
        errors.push(`http ${response.status()}: ${response.url()}`);
      }
    } catch {
      // Ignore malformed/non-http response URLs.
    }
  });
  return errors;
}

const PUBLIC_ROUTES = [
  ["/", /Poznej sebe/],
  ["/pilot", /Tři skutečné zkušenosti/],
  ["/jak-funguje", /Od skutečné potřeby k/],
  ["/partneri", /Přineste skutečný problém/],
  ["/program/school", /Pansofie School/],
  ["/program/family", /Pansofie Family/],
  ["/program/community", /Pansofie Community/],
  ["/program/youth", /Pansofie Youth/],
];

for (const [path, heading] of PUBLIC_ROUTES) {
  test(`public route ${path} renders without runtime failure`, async ({ page }) => {
    const errors = runtimeErrors(page);
    const response = await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });

    expect(response, `${path} must return a document response`).not.toBeNull();
    expect(response.status(), `${path} must not be protected/broken`).toBeLessThan(400);
    await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();
    expect(errors, `runtime errors on ${path}:\n${errors.join("\n")}`).toEqual([]);
  });
}

test("homepage communicates current Experience-first truthfully", async ({ page, browserName }, testInfo) => {
  const errors = runtimeErrors(page);
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

  await expect(page.getByText("Experience-first ekosystém", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Poznej sebe.*Tvoř s druhými.*Zlepšuj svět/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Jedna Experience uprostřed/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Přínos není skóre člověka." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Vyzkoušet Pansofii za 60 sekund/i }).first()).toHaveAttribute("href", "/zapojit-se?mode=simulator");
  await expect(page.getByRole("link", { name: /Jak Pansofie funguje/i }).first()).toHaveAttribute("href", "/jak-funguje");
  await expect(page.getByText(/Bounded runtime na stagingu/i)).toHaveCount(0);
  await expect(page.getByText(/STAGING VERIFIED/i)).toHaveCount(0);

  await page.screenshot({ path: testInfo.outputPath(`homepage-desktop-${browserName}.png`), fullPage: true });
  expect(errors, `runtime errors on homepage:\n${errors.join("\n")}`).toEqual([]);
});

test("public core pages render desktop evidence screenshots", async ({ page, browserName }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  const routes = [
    ["pilot", "/pilot"],
    ["how-it-works", "/jak-funguje"],
    ["partners", "/partneri"],
  ];

  for (const [name, path] of routes) {
    const errors = runtimeErrors(page);
    const response = await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(400);
    await page.screenshot({ path: testInfo.outputPath(`${name}-desktop-${browserName}.png`), fullPage: true });
    expect(errors, `runtime errors on ${path}:\n${errors.join("\n")}`).toEqual([]);
  }
});

test("pilot truthfully distinguishes digital readiness from real field verification", async ({ page }) => {
  const errors = runtimeErrors(page);
  const response = await page.goto(`${BASE_URL}/pilot`, { waitUntil: "networkidle" });

  expect(response).not.toBeNull();
  expect(response.status()).toBeLessThan(400);
  await expect(page.getByText("PANSOFIE SCHOOL · PŘIPRAVENO K PRVNÍMU OVĚŘENÍ VE ŠKOLE")).toBeVisible();
  await expect(page.getByText(/Digitální školní cesta je funkční a otestovaná/)).toBeVisible();
  await expect(page.getByText(/Reálný field pilot ve škole ještě neproběhl/)).toBeVisible();
  await expect(page.getByText("Zlepši svou školu", { exact: true })).toBeVisible();
  await expect(page.getByText("Digitální most", { exact: true })).toBeVisible();
  await expect(page.getByText("Circular Challenge", { exact: true })).toBeVisible();

  expect(errors, `runtime errors on /pilot:\n${errors.join("\n")}`).toEqual([]);
});

test("pilot account CTA preserves governed returnTo=/skola through login", async ({ page }) => {
  const errors = runtimeErrors(page);
  await page.goto(`${BASE_URL}/pilot`, { waitUntil: "networkidle" });

  const cta = page.getByRole("link", { name: "Mám pilotní účet" });
  await expect(cta).toHaveAttribute("href", "/login?returnTo=%2Fskola");
  await cta.click();

  await expect(page).toHaveURL((url) => url.pathname === "/login" && url.searchParams.get("returnTo") === "/skola");
  await expect(page.getByRole("heading", { name: "Vítej zpět" })).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeVisible();
  await expect(page.getByLabel("Heslo")).toBeVisible();

  expect(errors, `runtime errors in CTA/login path:\n${errors.join("\n")}`).toEqual([]);
});

test("unauthenticated /skola is fail-closed and redirects to login", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = runtimeErrors(page);

  await page.goto(`${BASE_URL}/skola`, { waitUntil: "networkidle" });
  await expect(page).toHaveURL((url) => url.pathname === "/login" && url.searchParams.get("returnTo") === "/skola");
  await expect(page.getByRole("heading", { name: "Vítej zpět" })).toBeVisible();

  expect(errors, `runtime errors in auth redirect:\n${errors.join("\n")}`).toEqual([]);
  await context.close();
});

test("mobile homepage and pilot have no horizontal overflow", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page = await context.newPage();

  for (const [name, path] of [["homepage", "/"], ["pilot", "/pilot"]]) {
    const errors = runtimeErrors(page);
    const response = await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(400);

    const dimensions = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `horizontal overflow on ${path}: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.innerWidth + 1);

    await page.screenshot({ path: testInfo.outputPath(`${name}-mobile.png`), fullPage: true });
    expect(errors, `runtime errors on mobile ${path}:\n${errors.join("\n")}`).toEqual([]);
  }

  await context.close();
});
