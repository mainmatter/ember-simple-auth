import { test, expect, type Page } from '@playwright/test';

const confirmLoggedIn = async (page: Page, { expectedUrl } = { expectedUrl: '/' }) => {
  await expect(page).toHaveURL(expectedUrl);
  await expect(page.getByTestId('greeting-text')).toHaveText('Signed in as Some person');
  await expect(page.locator('[data-is-authenticated]')).toBeTruthy();
};

const loginWithPassword = async (page: Page) => {
  await page.getByPlaceholder('Enter Login').fill('letme');
  await page.getByPlaceholder('Enter Password').fill('in');
  await page.locator('button[type="submit"]:has-text("Login")').click();
};

const STORAGE_SCENARIOS = ['cookieStorage', 'localStorage', 'adaptive'] as const;

const specifyTestAppStorageAdapter = async (
  page: Page,
  scenario: (typeof STORAGE_SCENARIOS)[number]
) => {
  switch (scenario) {
    case 'cookieStorage':
    case 'localStorage':
      await page.addInitScript({
        content: `window.ESA_STORAGE_BACKEND = "${scenario}";`,
      });
    case 'adaptive':
      break;
  }
};

STORAGE_SCENARIOS.forEach(scenario => {
  test.describe(scenario, () => {
    test('it renders and is available', async ({ page }) => {
      await specifyTestAppStorageAdapter(page, scenario);
      await page.goto('/');

      await expect(page.getByRole('heading')).toHaveText('Ember Simple Auth example app');
    });

    test('can log-in', async ({ page }) => {
      await specifyTestAppStorageAdapter(page, scenario);
      await page.goto('/');

      await page.getByTestId('route-login').click();
      await expect(page).toHaveURL('/login#');

      await loginWithPassword(page);
      await confirmLoggedIn(page);
    });

    test('logged-in state is synchronized between tabs', async ({ page, context }) => {
      await specifyTestAppStorageAdapter(page, scenario);
      await page.goto('/');

      await page.getByTestId('route-login').click();
      await expect(page).toHaveURL('/login#');

      await loginWithPassword(page);
      await confirmLoggedIn(page);

      const anotherPage = await context.newPage();
      await specifyTestAppStorageAdapter(anotherPage, scenario);
      await anotherPage.goto('/');
      await confirmLoggedIn(anotherPage);
    });

    test('logged-in state is synchronized between tabs when another page is already opened', async ({
      page,
      context,
    }) => {
      await specifyTestAppStorageAdapter(page, scenario);
      await page.goto('/');

      await page.getByTestId('route-login').click();
      await expect(page).toHaveURL('/login#');

      const anotherPage = await context.newPage();
      await specifyTestAppStorageAdapter(anotherPage, scenario);
      await anotherPage.goto('/');

      await loginWithPassword(page);
      await confirmLoggedIn(page);
      await confirmLoggedIn(anotherPage);
    });

    test('user is redirected a protected route they wanted to access originally after successfuly log-in', async ({
      page,
    }) => {
      await specifyTestAppStorageAdapter(page, scenario);
      await page.goto('/protected');

      await page.getByTestId('route-login').click();
      await expect(page).toHaveURL('/login#');

      await loginWithPassword(page);
      await confirmLoggedIn(page, { expectedUrl: '/protected' });
    });

    test('user is redirected a protected route they wanted to access originally after successfuly log-in, with a page reload in-between', async ({
      page,
    }) => {
      await specifyTestAppStorageAdapter(page, scenario);
      await page.goto('/protected');

      await page.getByTestId('route-login').click();
      await expect(page).toHaveURL('/login#');

      await page.reload();

      await loginWithPassword(page);
      await confirmLoggedIn(page, { expectedUrl: '/protected' });
    });
  });
});
