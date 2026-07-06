import { useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:9999/pages'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [token, setToken] = useState(localStorage.getItem('authToken') || '')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const rawText = await response.text()
      let data

      try {
        data = JSON.parse(rawText)
      } catch {
        data = rawText
      }

      const responseMessage = typeof data === 'string' ? data : data?.msg || 'Request completed'
      setMessage(responseMessage)

      if (typeof data === 'object' && data?.token) {
        localStorage.setItem('authToken', data.token)
        setToken(data.token)
      }
    } catch (error) {
      setMessage('Unable to connect to the backend. Start the backend server first.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setToken('')
    setMessage('You have been logged out.')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
          <p>Connect your frontend with the Node.js authentication backend.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            type="button"
            className="link-btn"
            onClick={() => setIsLogin((prev) => !prev)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>

        {message ? <p className={`message ${token ? 'success' : 'error'}`}>{message}</p> : null}

        {token ? (
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default App
