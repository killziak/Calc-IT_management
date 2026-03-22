const { test, expect } = require("playwright/test");

test("2 + 3 = 5", async ({ page }) => {
  await page.goto("file://" + process.cwd() + "/index.html");

  await page.click('[data-digit="2"]');
  await page.click('[data-op="+"]');
  await page.click('[data-digit="3"]');
  await page.click('[data-action="equals"]');

  const display = page.locator("#display");
  await expect(display).toHaveValue("5");
});

test("50 percent = 0.5", async ({ page }) => {
  await page.goto("file://" + process.cwd() + "/index.html");

  const display = page.locator("#display");
  await display.fill("50");
  await page.click('[data-action="percent"]');

  await expect(display).toHaveValue("0.5");
});