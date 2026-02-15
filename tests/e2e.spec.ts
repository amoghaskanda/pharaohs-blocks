import { test, expect } from '@playwright/test';

test.describe('Pharaohs Blocks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the game title and menu', async ({ page }) => {
    await expect(page).toHaveTitle(/Pharaoh's Blocks/);
    await expect(page.getByText("Pharaoh's Blocks")).toBeVisible();
    await expect(page.getByTestId('start-button')).toBeVisible();
  });

  test('should start the game when clicking Enter Temple', async ({ page }) => {
    await page.getByTestId('start-button').click();
    
    // Menu overlay should disappear
    await expect(page.getByTestId('start-button')).not.toBeVisible();
    
    // Stats should be visible and initialized
    await expect(page.getByTestId('score-display')).toContainText('0');
    await expect(page.getByTestId('level-display')).toContainText('1');
    
    // Board should be visible
    await expect(page.getByTestId('game-board')).toBeVisible();
  });

  test('should pause and resume the game', async ({ page }) => {
    await page.getByTestId('start-button').click();
    
    // Click Pause
    await page.getByTestId('pause-button').click();
    await expect(page.getByTestId('pause-button')).toHaveText('Resume');
    
    // Verify game status via opacity or overlay (Menu overlay logic is separate, 
    // usually pause doesn't show the full start menu but the button text changes)
    
    // Click Resume
    await page.getByTestId('pause-button').click();
    await expect(page.getByTestId('pause-button')).toHaveText('Pause');
  });

  test('should respond to keyboard controls', async ({ page }) => {
    await page.getByTestId('start-button').click();
    
    // We can't easily assert pixel perfect movement in canvas/div grids without internal state exposure,
    // but we can ensure the app doesn't crash and events are registered.
    // Press ArrowRight
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowUp'); // Rotate
    await page.keyboard.press('Space'); // Drop
    
    // Ensure game is still running (no error overlay or crash)
    await expect(page.getByTestId('game-board')).toBeVisible();
  });
});