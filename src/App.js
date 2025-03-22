import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { BookProvider } from "./contexts/BookContext"
import { ForumProvider } from "./contexts/ForumContext"
import { CommunityProvider } from "./contexts/CommunityContext"
import { CartProvider } from "./contexts/CartContext"
import { NotificationProvider } from "./contexts/NotificationContext"
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary"
import NotificationContainer from "./components/Notifications/NotificationContainer"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer/Footer"
import Home from "./pages/Home"
import BookStore from "./pages/BookStore"
import BookDetail from "./pages/BookDetail"
import Cart from "./pages/Cart"
import Forums from "./pages/Forums"
import ForumTopic from "./pages/ForumTopic"
import Communities from "./pages/Communities"
import CommunityDetail from "./pages/CommunityDetail"
import UserProfile from "./pages/UserProfile"
import AdminDashboard from "./pages/AdminDashboard"
import Competitions from "./pages/Competitions"
import Users from "./pages/Users"
import Books from "./pages/Books"
import Notifications from "./pages/Notifications"
import Leaderboard from "./pages/Leaderboard"
import Voting from "./pages/Voting"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import "./App.css"

function App() {
  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === "development"}>
      <NotificationProvider>
        <AuthProvider>
          <BookProvider>
            <ForumProvider>
              <CommunityProvider>
                <CartProvider>
                  <Router>
                    <div className="app">
                      <Navbar />
                      <main className="main-content">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/bookstore" element={<BookStore />} />
                          <Route path="/book/:id" element={<BookDetail />} />
                          <Route path="/cart" element={<Cart />} />

                          {/* Forums Routes */}
                          <Route path="/forums" element={<Forums />} />
                          <Route path="/forums/topic/:id" element={<ForumTopic />} />
                          <Route path="/forums/category/:categoryId" element={<Forums />} />
                          <Route path="/forums/category/:categoryId/subforum/:subforumId" element={<Forums />} />
                          <Route
                            path="/forums/new-topic"
                            element={
                              <ProtectedRoute>
                                <ForumTopic />
                              </ProtectedRoute>
                            }
                          />

                          {/* Communities Routes */}
                          <Route path="/communities" element={<Communities />} />
                          <Route path="/communities/:id" element={<CommunityDetail />} />
                          <Route
                            path="/communities/create"
                            element={
                              <ProtectedRoute>
                                <CommunityDetail />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/communities/:id/new-discussion"
                            element={
                              <ProtectedRoute>
                                <ForumTopic />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/communities/:id/discussion/:discussionId" element={<ForumTopic />} />
                          <Route path="/communities/:id/event/:eventId" element={<CommunityDetail />} />
                          <Route path="/communities/:id/challenge/:challengeId" element={<CommunityDetail />} />
                          <Route path="/communities/:id/members" element={<CommunityDetail />} />

                          <Route path="/profile/:id" element={<UserProfile />} />
                          <Route
                            path="/admin"
                            element={
                              <ProtectedRoute requireAdmin={true}>
                                <AdminDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/competitions" element={<Competitions />} />
                          <Route
                            path="/admin/users"
                            element={
                              <ProtectedRoute requireAdmin={true}>
                                <Users />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/books"
                            element={
                              <ProtectedRoute requireAdmin={true}>
                                <Books />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/notifications"
                            element={
                              <ProtectedRoute>
                                <Notifications />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/leaderboard" element={<Leaderboard />} />
                          <Route path="/voting" element={<Voting />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                        </Routes>
                      </main>
                      <Footer />
                      <NotificationContainer />
                    </div>
                  </Router>
                </CartProvider>
              </CommunityProvider>
            </ForumProvider>
          </BookProvider>
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  )
}

export default App

