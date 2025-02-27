import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewBlog('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input data-testid="title" value={newTitle} onChange={event => setNewTitle(event.target.value)} placeholder='title'/>
        </div>
        <div>
          author:
          <input data-testid="author" value={newAuthor} onChange={event => setNewAuthor(event.target.value)} placeholder='author'/>
        </div>
        <div>
          url:
          <input data-testid="url" value={newUrl} onChange={event => setNewUrl(event.target.value)} placeholder='url'/>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
