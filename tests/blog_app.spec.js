const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    const response = await request.post(
      'http://localhost:3003/api/testing/reset'
    )
    console.log(await response.text())
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  //5.17 kirjautumislomakkeen avaaminen
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible() //etusivu näkyy
    await page.getByRole('button', { name: 'login' }).toBeVisible //login nappula näkyy
    await page.getByRole('button', { name: 'login' }).click() //login nappulaa voidaan klikata
    await page.getByTestId('username').toBeVisible //varmistetaan että kirjautumislomake on auennut
    await page.getByTestId('password').toBeVisible
  })

  //5.18 onnistunut ja epäonnistunut kirjautuminen
  describe('Login', () => {
    //onnistunut kirjautuminen
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click() //login nappulaa voidaan klikata
      await loginWith(page, 'mluukkai', 'salainen') //loginform on auennut ja pystytään antamaan käyttäjätiedot
      await page.getByRole('button', { name: 'login' }).click() //login nappulaa voidaan jälleen klikata
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible() //kirjautumisen onnistumisteksti näkyy
    })

    //epäonnistunut kirjautuminen
    test('fails with wrong credentials', async ({ page }) => {
      //kirjaudutaan väärällä salasanalla
      await page.getByRole('button', { name: 'login' }).click()
      await loginWith(page, 'mluukkai', 'wrong') //annetaan väärä salasana
      await page.getByRole('button', { name: 'login' }).click()

      //sivu näyttää virheilmoituksen
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(
        page.getByText('Matti Luukkainen logged in')
      ).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      //uusi käyttäjä

      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Toinen kayttaja',
          username: 'tkayttaja',
          password: 'salasana'
        }
      })

      await page.goto('http://localhost:5173')

      await page.getByRole('button', { name: 'login' }).click()
      await loginWith(page, 'mluukkai', 'salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    //5.19 blogi voidaan luoda
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByTestId('title').fill('titteli')
      await page.getByTestId('author').fill('kirjailija')
      await page.getByTestId('url').fill('osoite')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByText('a new blog titteli by kirjailija')
      ).toBeVisible() // katsotaan, että onnistumisviesti näkyy
      await expect(page.getByText('titteli kirjailija')).toBeVisible() //katsotaan, että blogi on ilmestynyt listaan
    })

    describe('and several blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'eka blogi', true)
        await createBlog(page, 'toka blogi', true)
        await createBlog(page, 'kolmas blogi', true)
      })

      //5.20 blogia voidaan likettää
      test('and one of those can be liked', async ({ page }) => {
        const otherBlogElement = await page.getByText('toka blogi')

        await otherBlogElement.getByRole('button', { name: 'view' }).click() //voidaan avata view
        await expect(otherBlogElement.getByText('like')).toBeVisible() //like nappula näkyy
        await page.getByRole('button', { name: 'like' }).click() //like nappulaa voidaan klikata
        await expect(page.getByText('1')).toBeVisible() // nähdään, että blogilla on yksi like
      })

      //5.21 Blogi voidaan poistaa
      test('and one of those can be removed', async ({ page }) => {
        const blogElement = page.locator('.blog', { hasText: 'kolmas blogi' }) //vältetään success messagessa esiintyvä 'kolmas blogi'

        await blogElement.getByRole('button', { name: 'view' }).click()
        await expect(
          blogElement.getByRole('button', { name: 'remove' })
        ).toBeVisible()

        page.on('dialog', (dialog) => dialog.accept()) //hakkasin taas päätäni pöytään ennenkuin tajusin että tämän pitää olla ENNEN remove napin painamista
        await blogElement.getByRole('button', { name: 'remove' }).click()

        await expect(blogElement).not.toBeVisible()
      })

      //5.22 vain blogin lisännyt näkee poistonapin
      test('only owner can see remove button', async ({ page }) => {
        //logout
        await page.getByRole('button', { name: 'logout' }).click()

        //kirjaudutaan toisena käyttäjänä
        await page.getByRole('button', { name: 'login' }).click()
        await loginWith(page, 'tkayttaja', 'salasana')

        //avataan view ja tsekataan, että remove nappula ei näy
        const blogElement = page.locator('.blog', { hasText: 'toka blogi' })
        await blogElement.getByRole('button', { name: 'view' }).click()
        await expect(
          blogElement.getByRole('button', { name: 'remove' })
        ).not.toBeVisible()
      })

      //5.23 blogit on like-järjestyksessä
      test('and blogs are in descending order by likes', async ({ page }) => {
        //liketetään eka blogeja
        const secondBlogElement = await page.getByText('toka blogi')

        await secondBlogElement.getByRole('button', { name: 'view' }).click()
        await expect(secondBlogElement.getByText('like')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('2')).toBeVisible() // tokalla blogilla pitäisi olla nyt 2 likeä
        await page.getByRole('button', { name: 'hide' }).click() //suljetaan view

        const firstBlogElement = await page.getByText('eka blogi')

        await firstBlogElement.getByRole('button', { name: 'view' }).click()
        await expect(firstBlogElement.getByText('like')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('1')).toBeVisible() // ekalla blogilla 1 like

        //kolmannelle blogille emme anna likejä, joten se tulisi olla nolla

        //päivitetään sivu, jotta like järjestys päivittyy
        await page.reload()

        //testataan, että blogit ovat like järjestyksessä suurimmasta pienimpään
        const blogList = await page.locator('.blog')
        const expectBlogsDescending = [
          'toka blogi kirjailijaviewosoite2likemluukkairemovehide',
          'eka blogi kirjailijaviewosoite1likemluukkairemovehide',
          'kolmas blogi kirjailijaviewosoite0likemluukkairemovehide'
        ]
        await expect(blogList).toHaveText(expectBlogsDescending)
      })
    })
  })
})
