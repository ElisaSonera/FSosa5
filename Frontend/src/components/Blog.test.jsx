import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

//5.13
test('renders title', () => {
  const blog = {
    title: 'titteli',
    author: 'tekijä',
    url: 'osoite',
    likes: 13,
    user: {
      username: 'käyttis',
      name: 'joku',
      password: 'salasana'
    }
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('titteli', { exact: false })
  expect(element).toBeDefined()
})

test('clicking the like button calls event handler once', async () => {
  const blog = {
    title: 'titteli',
    author: 'tekijä',
    url: 'osoite',
    likes: 0,
    user: {
      username: 'käyttis',
      name: 'joku',
      password: 'salasana'
    }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} likeBlog={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

//5.14
test('renders everything after clicking view', async () => {
  const blog = {
    title: 'titteli',
    author: 'tekijä',
    url: 'osoite',
    likes: 0,
    user: {
      username: 'käyttis',
      name: 'joku',
      password: 'salasana'
    }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const title = screen.getByText('titteli', { exact: false })
  expect(title).toBeDefined()

  const author = screen.getByText('tekijä', { exact: false })
  expect(author).toBeDefined()

  const url = screen.getByText('osoite', { exact: false })
  expect(url).toBeDefined()

  const likes = screen.getByText('0', { exact: false })
  expect(likes).toBeDefined()

  const username = screen.getByText('käyttis', { exact: false })
  expect(username).toBeDefined()
})