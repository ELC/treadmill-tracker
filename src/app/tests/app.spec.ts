import { WorkoutCatalogKeys } from "../../workout/index.js";
import { expect, test } from "./app.fixture.js";

test.describe("App shell", () => {
  test("shows the home menu", async ({ page, app }) => {
    await app.open();
    await app.expectReady();
    await expect(page.getByTestId("home-menu")).toBeVisible();
    await expect(page.getByTestId("home-start")).toBeVisible();
    await expect(page.getByTestId("home-plan")).toBeVisible();
  });

  test("loads the workout runner from start", async ({ page, app }) => {
    await app.open();
    await app.expectReady();
    await page.getByTestId("home-start").click();
    await expect(page.getByTestId("workout-start")).toBeVisible();
    await page.getByTestId(`workout-start-item-${WorkoutCatalogKeys.Default}`).click();
    await expect(page.getByTestId("workout-runner")).toBeVisible();
    await expect(page).toHaveURL(/\/run\?workout=default/);
  });

  test("defaults to dark theme and toggles light", async ({ page, app }) => {
    await app.open();
    await app.expectReady();
    await page.goto("/run?workout=default");

    await expect(app.documentRoot).toHaveAttribute("data-theme", "dark");
    await expect(app.themeToggle).toHaveText("☀");

    await app.themeToggle.click();
    await expect(app.documentRoot).toHaveAttribute("data-theme", "light");
    await expect(app.themeToggle).toHaveText("☾");

    await app.themeToggle.click();
    await expect(app.documentRoot).toHaveAttribute("data-theme", "dark");
  });
});
