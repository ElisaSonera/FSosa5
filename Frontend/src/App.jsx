import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogs from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
      setSuccessMessage(
        `a new blog ${blogObject.title} by ${blogObject.author}`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    })
  }

  const likeBlog = async (blogObject) => {
    const blog = {
      title: blogObject.title,
      author: blogObject.author,
      url: blogObject.url,
      likes: blogObject.likes + 1,
      user: blogObject.user.id || blogObject.user._id
    }

    await blogService.update(blogObject.id, blog)
  }

  const removeBlog = async (blogObject) => {
    await blogService.remove(blogObject.id)
    setBlogs(blogs.filter((blog) => blog.id !== blogObject.id))
  }

  const compareLikes = (firstBlog, secondBlog) => {
    return secondBlog.likes - firstBlog.likes
  }

  const sortedBlogs = blogs.sort(compareLikes)

  const mapBlogs = (blogList) => {
    return blogList.map((blog) => (
      <Blog
        key={blog.id}
        blog={blog}
        likeBlog={likeBlog}
        removeBlog={removeBlog}
        user={user}
      />
    ))
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel="login">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    )
  }

  const blogForm = () => {
    return (
      <div>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
      </div>
    )
  }

  if (user === null) {
    return (
      <div>
        <Notification className="error" message={errorMessage} />
        <h2>Log in to application</h2>
        {!user && loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification className="success" message={successMessage} />
      <Notification className="error" message={errorMessage} />

      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          {blogForm()}
        </div>
      )}

      {mapBlogs(sortedBlogs)}
    </div>
  )
}

export default App
