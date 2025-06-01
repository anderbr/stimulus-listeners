import { test, expect } from '@playwright/test';

test('Listeners are registered', async ({ page }) => {
  await page.goto('/tests/e2e/stimulus-listeners.html');
  await page.waitForLoadState('domcontentloaded');

  const btn1 = page.locator('#btn1');
  const log1 = page.locator('#log1');

  await expect(btn1).toBeVisible();
  await expect(log1).toBeVisible();
  await expect(log1).not.toHaveText('A::onClick()');

  await btn1.click();
  await expect(log1).toHaveText('A::onClick()');
  
  await btn1.dispatchEvent('mouseleave');
  await expect(log1).toHaveText('A::onMouseLeave()');
});

test('Listeners with option "once" does not trigger multiple times', async ({ page }) => {
  await page.goto('/tests/e2e/stimulus-listeners.html');
  await page.waitForLoadState('domcontentloaded');

  const btn1 = page.locator('#btn1');
  const log1 = page.locator('#log1');

  await expect(btn1).toBeVisible();
  await expect(log1).toBeVisible();
  await expect(log1).not.toHaveText('A::');

  await btn1.dispatchEvent('mouseleave');
  await expect(log1).toContainText('A::onMouseLeave()');

  await btn1.click();
  await btn1.dispatchEvent('mouseleave');
  await expect(log1).toContainText('A::onClick()');
});

test('Listeners are not shared between controller instances', async ({ page }) => {
  await page.goto('/tests/e2e/stimulus-listeners.html');
  await page.waitForLoadState('domcontentloaded');

  const btn1 = page.locator('#btn1');
  const log1 = page.locator('#log1');
  const btn2 = page.locator('#btn2');
  const log2 = page.locator('#log2');

  await expect(btn1).toBeVisible();
  await expect(btn2).toBeVisible();
  await expect(log1).toBeVisible();
  await expect(log2).toBeVisible();

  await btn1.click();
  await expect(log1).toHaveText('A::onClick()');
  await expect(log2).not.toHaveText('A::onClick()');
  await expect(log2).not.toHaveText('B::onClick()');

  await btn2.click();
  await expect(log1).toHaveText('A::onMouseLeave()');
  await expect(log2).toHaveText('B::onClick()');

  await btn1.click();
  await expect(log1).toHaveText('A::onClick()');
  await expect(log2).toHaveText('B::onMouseLeave()');

  await btn2.click();
  await expect(log1).toHaveText('A::onClick()');
  await expect(log2).toHaveText('B::onClick()');
});


test('Listeners are registered/unregistered on connect/disconnect', async ({ page }) => {
  await page.goto('/tests/e2e/stimulus-listeners.html');
  await page.waitForLoadState('domcontentloaded');

  const btn1 = page.locator('#btn1');
  const log1 = page.locator('#log1');

  await expect(btn1).toBeVisible();
  await expect(log1).toBeVisible();

  await btn1.click();
  await expect(log1).toHaveText('A::onClick()');

  // Remove data-controller attribute to simulate disconnect
  await page.evaluate(() => {
    const btn = document.querySelector('#btn1');
    btn.parentElement.setAttribute('data-controller', 'nope');
    document.querySelector('#log1').textContent = '';
  });
  
  await expect(page.locator('#log1')).not.toHaveText('A::onClick()');
  await page.locator('#btn1').click();
  await expect(page.locator('#log1')).not.toHaveText('A::onClick()');

  // Reconnect the controller by adding the data-controller attribute back
  await page.evaluate(() => {
    const btn = document.querySelector('#btn1');
    btn.parentElement.setAttribute('data-controller', 'test');
    document.querySelector('#log1').textContent = '';
  });

  await expect(page.locator('#log1')).not.toHaveText('A::onClick()');
  await page.locator('#btn1').click();
  await expect(page.locator('#log1')).toHaveText('A::onClick()');
});
