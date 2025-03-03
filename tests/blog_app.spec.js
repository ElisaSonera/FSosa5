const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
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

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByTestId('title').fill('titteli')
      await page.getByTestId('author').fill('kirjailija')
      await page.getByTestId('url').fill('osoite')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByText('a new blog titteli by kirjailija')
      ).toBeVisible()
    })

    describe('and several blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'eka blogi', true)
        await createBlog(page, 'toka blogi', true)
        await createBlog(page, 'kolmas blogi', true)
      })

      test('one of those can be liked', async ({ page }) => {
        const otherBlogElement = await page.getByText('toka blogi')

        await otherBlogElement.getByRole('button', { name: 'view' }).click()
        await expect(otherBlogElement.getByText('like')).toBeVisible()
        //await page.getByRole('button', { name: 'like' }).click()
      })
    })
  })
})
