import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
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

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title,
      author,
      url,
    }

    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
        const notification = {
          message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
          color: 'green',
        }
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

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} is logged in{' '}
        <button onClick={handleLogout}> logout </button>
      </p>

      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title:{' '}
          <input type="text" value={title} onChange={handleTitleChange} />
        </div>
        <div>
          author:{' '}
          <input type="text" value={author} onChange={handleAuthorChange} />
        </div>
        <div>
          url: <input type="text" value={url} onChange={handleUrlChange} />
        </div>
        <button type="submit">create</button>
      </form>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )

  return (
    <div>
      <Notification notification={notification} />
      {user === null ? loginForm() : blogForm()}
    </div>
  )
}

export default App
