"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    // You could render a loading spinner here
    return <div>Loading...</div>
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (requireAdmin && currentUser.role !== "admin") {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute

