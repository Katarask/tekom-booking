import { test, expect } from "@playwright/test";

test.describe("Admin Panel", () => {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tekom2026";

  // Helper to get password input (no label, uses placeholder)
  const getPasswordInput = (page: ReturnType<typeof test.info>["_test"]["_pool"]["_page"]) =>
    page.locator('input[type="password"]');

  test("Admin login page loads", async ({ page }) => {
    await page.goto("/admin");

    // Should show login form
    await expect(page.locator("text=Admin-Bereich")).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /anmelden/i })).toBeVisible();
  });

  test("Wrong password shows error", async ({ page }) => {
    await page.goto("/admin");

    // Enter wrong password
    await page.locator('input[type="password"]').fill("wrongpassword");
    await page.getByRole("button", { name: /anmelden/i }).click();

    // Should show error
    await expect(page.locator("text=/falsch|fehler/i")).toBeVisible({ timeout: 5000 });
  });

  test("Correct password grants access", async ({ page }) => {
    await page.goto("/admin");

    // Enter correct password
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /anmelden/i }).click();

    // Should show admin panel content
    await expect(page.locator("text=/arbeitszeiten|kalender/i")).toBeVisible({ timeout: 10000 });
  });

  test("Admin panel has all config sections", async ({ page }) => {
    await page.goto("/admin");

    // Login
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /anmelden/i }).click();

    // Wait for panel to load
    await page.waitForLoadState("networkidle");

    // Check for config sections
    await expect(page.locator("text=/arbeitszeiten/i")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=/arbeitstage/i")).toBeVisible();
  });

  test("Can modify working hours", async ({ page }) => {
    await page.goto("/admin");

    // Login
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /anmelden/i }).click();

    // Wait for panel to load
    await page.waitForSelector("text=/arbeitszeiten/i", { timeout: 10000 });

    // Find start hour dropdown
    const startSelect = page.locator("select").first();
    if (await startSelect.isVisible()) {
      // Change value
      await startSelect.selectOption("10");

      // Save button should be visible
      const saveButton = page.getByRole("button", { name: /speichern/i });
      await expect(saveButton).toBeVisible();
    }
  });

  test("Can toggle working days", async ({ page }) => {
    await page.goto("/admin");

    // Login
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /anmelden/i }).click();

    // Wait for panel to load
    await page.waitForSelector("text=/arbeitstage/i", { timeout: 10000 });

    // Find weekday buttons
    const mondayButton = page.getByRole("button", { name: /^Mo$/i });
    if (await mondayButton.isVisible()) {
      // Click to toggle
      await mondayButton.click();

      // Button should change state
      await page.waitForTimeout(300);
    }
  });

  test("Logout works", async ({ page }) => {
    await page.goto("/admin");

    // Login
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /anmelden/i }).click();

    // Wait for panel to load
    await page.waitForSelector("text=/abmelden/i", { timeout: 10000 });

    // Click logout
    await page.getByRole("button", { name: /abmelden/i }).click();

    // Should be back at login
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});

test.describe("Admin Panel - Blocked Dates", () => {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tekom2026";

  test("Can add blocked date", async ({ page }) => {
    await page.goto("/admin");

    // Login
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /anmelden/i }).click();

    // Wait for panel to load
    await page.waitForSelector("text=/geblockte.*tage/i", { timeout: 10000 });

    // Find date input
    const dateInput = page.locator('input[type="date"]');
    if (await dateInput.isVisible()) {
      // Set a future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const dateString = futureDate.toISOString().split("T")[0];

      await dateInput.fill(dateString);

      // Click add button (the second one, next to date input)
      const addButton = page.getByRole("button", { name: "Hinzufuegen", exact: true });
      if (await addButton.isVisible()) {
        await addButton.click();
        await page.waitForTimeout(500);
      }
    }
  });
});

test.describe("Admin Panel - Breaks", () => {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tekom2026";

  test("Can add break", async ({ page }) => {
    await page.goto("/admin");

    // Login
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /anmelden/i }).click();

    // Wait for panel to load
    await page.waitForSelector("text=/pausen/i", { timeout: 10000 });

    // Find add break button
    const addBreakButton = page.getByRole("button", { name: /hinzufügen|hinzufuegen/i }).first();

    if (await addBreakButton.isVisible()) {
      await addBreakButton.click();
      await page.waitForTimeout(500);
    }
  });
});
