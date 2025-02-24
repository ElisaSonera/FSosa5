import View from './View'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
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
      likes: blog.likes + 1,
      user: blog.user._id
    }

    await blogService.update(blog.id, blogObject)
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <View buttonLabel="view">
        <div>{blog.url}</div>
        <div>
          {blog.likes}
          <button onClick={handleLike}>like</button>
        </div>
        <div>{blog.user.username}</div>
      </View>
    </div>
  )
}

export default Blog
