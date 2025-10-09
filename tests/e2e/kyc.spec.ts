import { test, expect } from '@playwright/test';

test.describe('KYC Submission Flow', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Add test user authentication helper
    await page.goto('/kyc/main-info');
  });

  test.skip('should display KYC main info form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /company information/i })).toBeVisible();
    await expect(page.getByLabel(/company legal name/i)).toBeVisible();
    await expect(page.getByLabel(/commercial registration number/i)).toBeVisible();
  });

  test.skip('should validate required fields', async ({ page }) => {
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByText(/company legal name is required/i)).toBeVisible();
  });

  test.skip('should validate CR number format', async ({ page }) => {
    await page.getByLabel(/commercial registration number/i).fill('123');
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByText(/invalid CR number format/i)).toBeVisible();
  });

  test.skip('should validate VAT number format', async ({ page }) => {
    await page.getByLabel(/vat number/i).fill('123');
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByText(/invalid VAT number format/i)).toBeVisible();
  });

  test.skip('should navigate to KYC form after main info', async ({ page }) => {
    // Fill main info form
    await page.getByLabel(/company legal name/i).fill('Test Company LLC');
    await page.getByLabel(/commercial registration number/i).fill('1234567890');
    await page.getByLabel(/vat number/i).fill('123456789012345');
    
    // Upload documents (mock)
    // await page.setInputFiles('input[type="file"]', 'path/to/test-file.pdf');
    
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(/\/kyc\/form/);
  });
});
