"use client"

import { createContext, useState, useEffect, useContext } from "react"

// Create context
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Mock user data for demonstration
  const mockUsers = [
    {
      id: 1,
      email: "user@example.com",
      password: "password123",
      name: "John Doe",
      avatar: "https://source.unsplash.com/random/100x100?portrait,user",
      role: "user",
      joinDate: "2022-09-15",
      bio: "Avid reader and book enthusiast. I love discussing literature and discovering new authors.",
      favoriteGenres: ["Fiction", "Mystery", "Science Fiction"],
      booksRead: 42,
      reviewsWritten: 15,
      points: 1250,
    },
    {
      id: 2,
      email: "admin@example.com",
      password: "admin123",
      name: "Admin User",
      avatar: "https://source.unsplash.com/random/100x100?portrait,admin",
      role: "admin",
      joinDate: "2022-01-10",
      bio: "BookApp administrator and literature professor.",
      favoriteGenres: ["Classic Literature", "Poetry", "Philosophy"],
      booksRead: 128,
      reviewsWritten: 47,
      points: 3800,
    },
  ]

  useEffect(() => {
    // Check if user is stored in localStorage on initial load
    const storedUser = localStorage.getItem("bookapp_user")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = (email, password) => {
    setError("")

    try {
      // In a real app, this would be an API call
      const user = mockUsers.find((u) => u.email === email && u.password === password)

      if (user) {
        // Remove password before storing
        const { password, ...userWithoutPassword } = user
        setCurrentUser(userWithoutPassword)
        // Store in localStorage for persistence
        localStorage.setItem("bookapp_user", JSON.stringify(userWithoutPassword))
        return userWithoutPassword
      } else {
        throw new Error("Invalid email or password")
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Register function
  const register = (email, password, name) => {
    setError("")

    try {
      // Check if user already exists
      if (mockUsers.some((u) => u.email === email)) {
        throw new Error("Email already in use")
      }

      // In a real app, this would be an API call to create the user
      const newUser = {
        id: mockUsers.length + 1,
        email,
        password,
        name,
        avatar: "https://source.unsplash.com/random/100x100?portrait,default",
        role: "user",
        joinDate: new Date().toISOString().split("T")[0],
        bio: "",
        favoriteGenres: [],
        booksRead: 0,
        reviewsWritten: 0,
        points: 0,
      }

      // Add to mock users array
      mockUsers.push(newUser)

      // Remove password before storing
      const { password: _, ...userWithoutPassword } = newUser
      setCurrentUser(userWithoutPassword)
      // Store in localStorage for persistence
      localStorage.setItem("bookapp_user", JSON.stringify(userWithoutPassword))
      return userWithoutPassword
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Logout function
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("bookapp_user")
  }

  // Update user profile
  const updateProfile = (userData) => {
    try {
      // In a real app, this would be an API call
      const updatedUser = { ...currentUser, ...userData }
      setCurrentUser(updatedUser)
      localStorage.setItem("bookapp_user", JSON.stringify(updatedUser))
      return updatedUser
    } catch (err) {
      setError("Failed to update profile")
      throw err
    }
  }

  // Reset password (mock implementation)
  const resetPassword = (email) => {
    setError("")

    try {
      // Check if email exists
      const userExists = mockUsers.some((u) => u.email === email)
      if (!userExists) {
        throw new Error("Email not found")
      }
      // In a real app, this would send a password reset email
      return true
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

