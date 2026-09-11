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
const useResolver = process.env.PUBLIC_ESA_USE_RESOLVER !== 'false';

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

    test(`initializes the session store with useResolver: ${useResolver}`, async ({ page }) => {
      await specifyTestAppStorageAdapter(page, scenario);
      await page.goto('/');

      const session = page.getByTestId('use-resolver');
      const expectedUseResolver = useResolver ? 'true' : 'false';
      await expect(session).toHaveAttribute('data-use-resolver', expectedUseResolver);
      await expect(session).toHaveAttribute('data-session-main', expectedUseResolver);
      // Resolver-created stores retain EmberObject's init hook. Direct `new` does not call it.
      await expect(session).toHaveAttribute('data-store-init-calls', useResolver ? '1' : '0');
    });

    test('can log-in', async ({ page }) => {
      await specifyTestAppStorageAdapter(page, scenario);
      await page.goto('/');

      await page.getByTestId('route-login').click();
      await expect(page).toHaveURL('/login#');

      await loginWithPassword(page);
      await confirmLoggedIn(page);

      const persistedSession = await page.evaluate(() => ({
        cookie: document.cookie
          .split('; ')
          .some(value => value.startsWith('ember_simple_auth-session=')),
        localStorage: localStorage.getItem('ember_simple_auth-session') !== null,
      }));
      const expectsCookie =
        process.env.FASTBOOT_DISABLED !== 'true' || scenario === 'cookieStorage';
      expect(persistedSession).toEqual({
        cookie: expectsCookie,
        localStorage: !expectsCookie,
      });
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

    test('user is redirected to the last visited route for a given browser tab session', async ({
      page,
      context,
    }) => {
      test.skip(
        process.env.FASTBOOT_DISABLED !== 'true',
        'This feature relies on SessionStorage which is unavailable in fastboot.'
      );
      await specifyTestAppStorageAdapter(page, scenario);
      await page.goto('/protected');

      await page.getByTestId('route-login').click();
      await expect(page).toHaveURL('/login#');

      const anotherPage = await context.newPage();
      await specifyTestAppStorageAdapter(anotherPage, scenario);
      await anotherPage.goto('/another-protected');

      // Make sure to verify persistence
      await anotherPage.reload();
      await page.reload();

      await expect(anotherPage).toHaveURL('/login');

      await loginWithPassword(page);
      await confirmLoggedIn(page, { expectedUrl: '/protected' });
      await confirmLoggedIn(anotherPage, { expectedUrl: '/another-protected' });
    });
  });
});
