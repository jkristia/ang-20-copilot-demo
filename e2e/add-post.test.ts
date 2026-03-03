import { test, expect } from '@playwright/test';

test('should add a new post and verify it is highlighted', async ({ page }) => {
  // Navigate to Blog Posts page
  await page.goto('/');

  // Verify the "New Post" button is available and enabled
  const newPostButton = page.locator('button', { hasText: /new post|add post/i });
  await expect(newPostButton).toBeVisible();
  await expect(newPostButton).toBeEnabled();

  // Click the button to open the Create New Post dialog
  await newPostButton.click();

  // Verify the Create New Post dialog is shown
  const dialogTitle = page.locator('[role="dialog"] h1, [role="dialog"] h2, [role="dialog"] mat-dialog-title');
  await expect(dialogTitle).toContainText(/create.*post|new.*post/i);

  // Get the topic and message input fields
  const topicInput = page.locator('input[placeholder*="topic" i], input[name="topic" i], input[formControlName="topic"]').first();
  const messageInput = page.locator('textarea[placeholder*="message" i], textarea[name="message" i], textarea[formControlName="message"], input[placeholder*="message" i], input[name="message" i], input[formControlName="message"]').first();
  const createButton = page.locator('[role="dialog"] button', { hasText: /create|ok|save/i }).first();

  // Enter topic
  await topicInput.fill('my test post');

  // Enter message with exactly 9 characters (should fail validation)
  await messageInput.fill('123456789');

  // Verify the Create button is disabled due to message length validation
  await expect(createButton).toBeDisabled();

  // Add additional characters to make message 18 characters (> 10)
  await messageInput.fill('123456789123456789');

  // Verify the Create button is now enabled
  await expect(createButton).toBeEnabled();

  // Click the Create button
  await createButton.click();

  // Wait for the dialog to close
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).not.toBeVisible();

  // Verify the post appears as the first post in the list
  const firstPost = page.locator('[data-testid="post-item"], .post-item, mat-card').first();
  await expect(firstPost).toBeVisible();

  // Verify the post content matches what we entered
  const postContent = page.locator('[data-testid="post-item"], .post-item, mat-card').filter({ hasText: 'my test post' }).first();
  await expect(postContent).toContainText('my test post');
  await expect(postContent).toContainText('123456789123456789');

  // Verify the post has the highlight background color (new post highlight)
  // The highlight typically appears as a different background color
  const highlightedPost = postContent;
  const backgroundColor = await highlightedPost.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });

  // Verify that the background color is not the default (white/transparent)
  // This indicates the highlight is applied
  expect(backgroundColor).not.toMatch(/rgb\(255,\s*255,\s*255\)|rgba\(0,\s*0,\s*0,\s*0\)|transparent/);
});
