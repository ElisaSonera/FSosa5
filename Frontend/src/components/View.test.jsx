import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import View from './View'

describe('<View />', () => {
  let container

  beforeEach(() => {
    container = render(
      <View buttonLabel="show...">
        <div className="testDiv">view content</div>
      </View>
    ).container
  })

  test('renders its children', () => {
    screen.getByText('view content')
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.viewContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const div = container.querySelector('.viewContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('viewed content can be closed', async () => {
    const user = userEvent.setup()

    const button = screen.getByText('show...')
    await user.click(button)

    const closeButton = screen.getByText('hide')
    await user.click(closeButton)

    const div = container.querySelector('.viewContent')
    expect(div).toHaveStyle('display: none')
  })
})
