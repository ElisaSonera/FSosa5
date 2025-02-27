const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    //const locator = await page.getByText('login')
    //await expect(locator).toBeVisible()
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByTestId('username').fill('kkayttaja')
    await page.getByTestId('password').fill('password')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Kalle logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByTestId('username').fill('kkayttaja')
      await page.getByTestId('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByTestId('title').fill('titteli')
      await page.getByTestId('author').fill('kirjailija')
      await page.getByTestId('url').fill('osoite')

      await page.getByRole('button', { name: 'create' }).click()
      //
      await expect(page.getByText('a new blog titteli by kirjailija')).toBeVisible()
    })
  })
})
