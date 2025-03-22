"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import "./AuthForms.css"

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email")
      return
    }

    try {
      setError("")
      setMessage("")
      setLoading(true)
      await resetPassword(email)
      setMessage("Check your email for password reset instructions")
    } catch (err) {
      setError("Failed to reset password: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form-container">
      <h2>Reset Password</h2>
      {error && <div className="auth-error">{error}</div>}
      {message && <div className="auth-success">{message}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <p className="form-helper">
            Enter the email address associated with your account, and we'll send you instructions to reset your
            password.
          </p>
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="auth-switch">
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  )
}

export default ForgotPasswordForm

