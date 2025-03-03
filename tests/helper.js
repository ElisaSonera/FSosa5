const loginWith = async (page, username, password)  => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }

  const createBlog = async (page, content) => {
    await page.getByRole('button', { name: 'create new blog' }).click()

    await page.getByTestId('title').fill(content)
    await page.getByTestId('author').fill('kirjailija')
    await page.getByTestId('url').fill('osoite')

    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText(content, {exact: true}).first().waitFor()
  }
  
  export { loginWith, createBlog }