import { expect, test } from "./app.fixture.js";

type WebAppManifestSnippet = {
  name?: string;
  display?: string;
};

test.describe("App shell (production build)", () => {
  test("exposes a web app manifest for install", async ({ page, app }) => {
    await app.open();
    await app.expectReady();

    const manifestResponse = await page.request.get("/manifest.webmanifest");
    expect(manifestResponse.ok()).toBeTruthy();
    const manifestBody: unknown = await manifestResponse.json();
    const manifest = manifestBody as WebAppManifestSnippet;
    expect(manifest.name).toBe("Treadmill Tracker");
    expect(manifest.display).toBe("standalone");
  });
});
