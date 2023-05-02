import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      const notification = {
        message: 'Successfully logged in!',
        color: 'green',
      }
      setNotification(notification)
    } catch (exception) {
      const notification = {
        message: 'Wrong credentials',
        color: 'red',
      }
      setNotification(notification)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))
        const notification = {
          message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
          color: 'green',
        }
        blogFormRef.current.toggleVisibility()
        setNotification(notification)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      .catch((error) => {
        const notification = {
          message: error.response.data,
          color: 'red',
        }
        setNotification(notification)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const handleLike = async (id) => {
    // use blog service to update blog
    const blog = await blogs.find((blog) => blog.id === id)
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    const returnedBlog = await blogService.update(id, updatedBlog)
    const updatedBlogs = blogs.map((blog) =>
      blog.id !== id ? blog : { ...blog, likes: returnedBlog.likes }
    )
    setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
    return returnedBlog
  }

  const handleRemove = async (id) => {
    await blogService.remove(id)
    const updatedBlogs = blogs.filter((blog) => blog.id !== id)
    setBlogs(updatedBlogs)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>log in to application</h1>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="text"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogFormRef = useRef()

  const blogForm = () => {
    return (
      <div>
        <h2>blogs</h2>
        <p>
          {user.name} is logged in{' '}
          <button onClick={handleLogout}> logout </button>
        </p>

        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>

        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            addLikes={handleLike}
            removeBlog={handleRemove}
            canDelete={blog.user.username === user.username}
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />
      {user === null ? loginForm() : blogForm()}
    </div>
  )
}

export default App
