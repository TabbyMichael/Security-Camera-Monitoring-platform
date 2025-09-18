import { test, expect } from '@playwright/test';

test('should display live camera feeds', async ({ page }) => {
  // Navigate to the home page.
  await page.goto('/');

  // Check if the main heading is visible.
  await expect(page.getByRole('heading', { name: 'Live Camera Feeds' })).toBeVisible();

  // Wait for the camera feeds to load and check if at least one is visible.
  // We'll wait for the first camera feed by its test id.
  const firstCameraFeed = page.getByTestId('camera-feed-1');

  // Wait for the element to be attached to the DOM and visible.
  await expect(firstCameraFeed).toBeVisible({ timeout: 30000 }); // 30s timeout
});
