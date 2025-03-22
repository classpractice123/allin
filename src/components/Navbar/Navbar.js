"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useCart } from "../../contexts/CartContext"
import "./Navbar.css"

const Navbar = () => {
  const { currentUser, logout } = useAuth()
  const { totalItems } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/bookstore?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setMobileMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
    setMobileMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          BookApp
        </Link>

        <div className="search-bar">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>

        <div className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`navbar-menu ${mobileMenuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/bookstore" onClick={() => setMobileMenuOpen(false)}>
              Book Store
            </Link>
          </li>
          <li>
            <Link to="/forums" onClick={() => setMobileMenuOpen(false)}>
              Forums
            </Link>
          </li>
          <li>
            <Link to="/communities" onClick={() => setMobileMenuOpen(false)}>
              Communities
            </Link>
          </li>
          <li>
            <Link to="/competitions" onClick={() => setMobileMenuOpen(false)}>
              Competitions
            </Link>
          </li>
          <li>
            <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)}>
              Leaderboard
            </Link>
          </li>
          <li>
            <Link to="/cart" className="cart-link" onClick={() => setMobileMenuOpen(false)}>
              Cart
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </Link>
          </li>

          {currentUser ? (
            <>
              <li>
                <Link to="/notifications" onClick={() => setMobileMenuOpen(false)}>
                  Notifications
                </Link>
              </li>
              <li>
                <Link to="/profile/me" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
              </li>
              {currentUser.role === "admin" && (
                <li>
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <button className="auth-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="auth-button" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="auth-button-secondary" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

