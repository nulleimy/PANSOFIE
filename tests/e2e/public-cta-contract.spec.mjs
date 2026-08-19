import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PANSOFIE_STAGING_URL || "https://pansofie-staging.vercel.app";
const PUBLIC_ENTRY_ROUTES = [
  "/",
  "/jak-funguje",
  "/pilot",
  "/partneri",
  "/zapojit-se?mode=simulator",
  "/kontakt",
];

function absoluteHref(href) {
  return new URL(href, BASE_URL);
}

test("public CTA contract has no empty or dead internal destinations", async ({ browser }) => {
  const collector = await browser.newPage();
  const discovered = new Map();

  for (const sourcePath of PUBLIC_ENTRY_ROUTES) {
    const response = await collector.goto(`${BASE_URL}${sourcePath}`, { waitUntil: "networkidle" });
    expect(response, `${sourcePath} must return a document response`).not.toBeNull();
    expect(response.status(), `${sourcePath} must render`).toBeLessThan(400);

    const anchors = await collector.locator("a").evaluateAll((nodes) => nodes.map((node) => ({
      href: node.getAttribute("href"),
      text: (node.textContent || "").replace(/\s+/g, " ").trim(),
      aria: node.getAttribute("aria-label") || "",
    })));

    for (const anchor of anchors) {
      const label = anchor.text || anchor.aria || "<unlabelled>";
      expect(anchor.href, `CTA ${label} on ${sourcePath} must have href`).toBeTruthy();
      expect(anchor.href, `CTA ${label} on ${sourcePath} must not be a placeholder`).not.toBe("#");
      expect(anchor.href?.startsWith("javascript:"), `CTA ${label} on ${sourcePath} must not use javascript:`).toBe(false);

      if (!anchor.href || anchor.href === "#" || anchor.href.startsWith("javascript:")) continue;
      discovered.set(`${sourcePath}::${anchor.href}`, { sourcePath, ...anchor });
    }
  }

  const checked = new Set();
  const probe = await browser.newPage();

  for (const { sourcePath, href, text, aria } of discovered.values()) {
    if (href.startsWith("mailto:") || href.startsWith("tel:")) continue;

    const url = absoluteHref(href);
    if (url.origin !== new URL(BASE_URL).origin) continue;

    if (href.startsWith("#")) {
      await collector.goto(`${BASE_URL}${sourcePath}`, { waitUntil: "networkidle" });
      const id = href.slice(1);
      await expect(collector.locator(`[id="${id}"]`), `hash CTA ${text || aria} on ${sourcePath} must target an element`).toHaveCount(1);
      continue;
    }

    const key = `${url.pathname}${url.search}`;
    if (checked.has(key)) continue;
    checked.add(key);

    const response = await probe.goto(url.toString(), { waitUntil: "networkidle" });
    expect(response, `CTA destination ${key} must return a document`).not.toBeNull();
    expect(response.status(), `CTA destination ${key} must not fail HTTP`).toBeLessThan(400);
    await expect(probe.getByRole("heading", { name: "Stránka nebyla nalezena" }), `CTA destination ${key} must not resolve to app 404`).toHaveCount(0);
  }

  await collector.close();
  await probe.close();
});

test("contact route remains intentional non-submit until a factual endpoint exists", async ({ page }) => {
  await page.goto(`${BASE_URL}/kontakt`, { waitUntil: "networkidle" });
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.getByText(/Veřejný kontaktní kanál zatím není spuštěný/)).toBeVisible();
  await expect(page.getByText(/Nic se neodesílá ani neukládá/)).toBeVisible();
});
