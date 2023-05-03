import { useState } from 'react'
import PropTypes from 'prop-types'
const Blog = ({ blog, addLikes, removeBlog, canDelete }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    const updatedBlog = await addLikes(blog.id)
    setLikes(updatedBlog.likes)
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      console.log('delete blog')
      await removeBlog(blog.id)
    }
  }

  if (!visible) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}{' '}
          <button onClick={toggleVisibility}>view</button>
        </div>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes {likes} <button onClick={handleLike}>like</button>
      </div>
      <div>{blog.user.name}</div>
      <div>{canDelete && <button onClick={handleDelete}>remove</button>}</div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  canDelete: PropTypes.bool.isRequired,
}

export default Blog
