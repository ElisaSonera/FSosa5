import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

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

  const element = screen.getByText('titteli', {exact: false})
  expect(element).toBeDefined()
})


test('clicking the button calls event handler once', async () => {
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
  
    render(
      <Blog blog={blog} toggleView={mockHandler} />
    )
  
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
  
    expect(mockHandler.mock.calls).toHaveLength(1)
  })