import { test, expect } from '@jupyterlab/galata';

test('should open a widget panel', async ({ page }) => {
  // Close filebrowser
  await Promise.all([
    page.waitForSelector('#filebrowser', { state: 'hidden' }),
    page.menu.clickMenuItem('View>File Browser')
  ]);

  // Open a new tab from menu
  await page.menu.clickMenuItem('ATP>Start a training task');

  await page.click('div[role="main"] >> text=#Start ATP Train Task');

  expect(await page.screenshot()).toMatchSnapshot('widgets-example.png');
});
