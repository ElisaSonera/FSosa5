const BlogForm = ({
  onSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  blogTitle,
  blogAuthor,
  blogUrl
}) => {
  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={onSubmit}>
        <div>
          title:
          <input value={blogTitle} onChange={handleTitleChange} />
        </div>
        <div>
          author:
          <input value={blogAuthor} onChange={handleAuthorChange} />
        </div>
        <div>
          url:
          <input value={blogUrl} onChange={handleUrlChange} />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm
