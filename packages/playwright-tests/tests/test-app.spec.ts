import { test, expect, type Page } from '@playwright/test';

const confirmLoggedIn = async (page: Page) => {
  await expect(page).toHaveURL('/');
  await expect(page.getByTestId('greeting-text')).toHaveText('Signed in as Some person');
  await expect(page.locator('[data-is-authenticated]')).toBeTruthy();
};

const loginWithPassword = async (page: Page) => {
  await page.getByPlaceholder('Enter Login').fill('letme');
  await page.getByPlaceholder('Enter Password').fill('in');
  await page.locator('button[type="submit"]:has-text("Login")').click();
};

test.describe('TestApp', () => {
  test('it renders and is available', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading')).toHaveText('Ember Simple Auth example app');
  });

  test('can log-in', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('route-login').click();
    await expect(page).toHaveURL('/login#');

    await loginWithPassword(page);
    await confirmLoggedIn(page);
  });

  test('logged-in state is synchronized between tabs', async ({ page, context }) => {
    await page.goto('/');

    await page.getByTestId('route-login').click();
    await expect(page).toHaveURL('/login#');

    await loginWithPassword(page);
    await confirmLoggedIn(page);

    const anotherPage = await context.newPage();
    await anotherPage.goto('/');
    await confirmLoggedIn(anotherPage);
  });

  test('logged-in state is synchronized between tabs when another page is already opened', async ({
    page,
    context,
  }) => {
    await page.goto('/');

    await page.getByTestId('route-login').click();
    await expect(page).toHaveURL('/login#');

    const anotherPage = await context.newPage();
    await anotherPage.goto('/');

    await loginWithPassword(page);
    await confirmLoggedIn(page);
    await confirmLoggedIn(anotherPage);
  });
});
