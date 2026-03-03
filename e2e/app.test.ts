import { test, expect } from '@playwright/test';

test('should verify the app is running and available', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');

  // Check that the page loaded successfully
  expect(page.url()).toContain('localhost:4200');

  // Verify the app is rendered (check for app-root element)
  const appRoot = await page.locator('app-root');
  await expect(appRoot).toBeVisible();

  // Verify the main content is present (posts list should be visible on default route)
  const mainContent = await page.locator('main, [role="main"], .container');
  await expect(mainContent).toBeVisible();
});
