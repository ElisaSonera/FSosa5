import View from './View'
import { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
  const [likesUpdate, setLikesUpdate] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async (event) => {
    event.preventDefault()
    setLikesUpdate(likesUpdate + 1)
    blog.likes = likesUpdate
    await likeBlog(blog)
  }

  const handleRemove = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog)
    } else {
      return
    }
  }

  const blogOwner = user && blog.user.username === user.username

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <View buttonLabel="view">
        <div>{blog.url}</div>
        <div>
          {likesUpdate}
          <button onClick={handleLike}>like</button>
        </div>
        <div>{blog.user.username}</div>
        {blogOwner && (
          <div>
            <button onClick={handleRemove}>remove</button>
          </div>
        )}
      </View>
    </div>
  )
}

export default Blog
