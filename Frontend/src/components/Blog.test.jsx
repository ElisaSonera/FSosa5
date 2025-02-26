import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
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
  screen.debug(element)
  expect(element).toBeDefined()
})


test('clicking the button calls event handler once', async () => {
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
  
    const mockHandler = vi.fn()
  
    render(
      <Blog blog={blog} toggleView={mockHandler} />
    )
  
    const user = userEvent.setup()
    const button = screen.getByText('osoite')
    await user.click(button)
  
    expect(mockHandler.mock.calls).toHaveLength(1)
  })