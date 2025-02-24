import View from './View'
import blogService from '../services/blogs'
import { useState } from 'react'

const Blog = ({ blog }) => {
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

    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: likesUpdate + 1,
      user: blog.user._id
    }

    await blogService.update(blog.id, blogObject)
    setLikesUpdate(likesUpdate + 1)
  }

  const handleRemove = async (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
    } else {
      return
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <View buttonLabel="view">
        <div>{blog.url}</div>
        <div>
          {likesUpdate}
          <button onClick={handleLike}>like</button>
        </div>
        <div>{blog.user.username}</div>
        <div>
          <button onClick={handleRemove}>remove</button>
        </div>
      </View>
    </div>
  )
}

export default Blog
