"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./AdminDashboard.css"

// Mock data for the dashboard
const dashboardData = {
  stats: {
    totalUsers: 1245,
    activeUsers: 876,
    totalBooks: 3567,
    newBooks: 124,
    totalReviews: 8932,
    pendingReviews: 47,
    totalForumPosts: 2156,
    reportedContent: 18,
  },
  recentUsers: [
    {
      id: 101,
      name: "Emma Johnson",
      email: "emma.j@example.com",
      joinDate: "2023-05-15",
      status: "active",
    },
    {
      id: 102,
      name: "Michael Smith",
      email: "michael.s@example.com",
      joinDate: "2023-05-14",
      status: "active",
    },
    {
      id: 103,
      name: "Sophia Williams",
      email: "sophia.w@example.com",
      joinDate: "2023-05-13",
      status: "pending",
    },
    {
      id: 104,
      name: "James Brown",
      email: "james.b@example.com",
      joinDate: "2023-05-12",
      status: "active",
    },
    {
      id: 105,
      name: "Olivia Davis",
      email: "olivia.d@example.com",
      joinDate: "2023-05-11",
      status: "inactive",
    },
  ],
  recentBooks: [
    {
      id: 201,
      title: "The Midnight Library",
      author: "Matt Haig",
      addedDate: "2023-05-15",
      status: "published",
    },
    {
      id: 202,
      title: "Project Hail Mary",
      author: "Andy Weir",
      addedDate: "2023-05-14",
      status: "published",
    },
    {
      id: 203,
      title: "The Four Winds",
      author: "Kristin Hannah",
      addedDate: "2023-05-13",
      status: "pending",
    },
    {
      id: 204,
      title: "The Invisible Life of Addie LaRue",
      author: "V.E. Schwab",
      addedDate: "2023-05-12",
      status: "published",
    },
    {
      id: 205,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      addedDate: "2023-05-11",
      status: "published",
    },
  ],
  reportedContent: [
    {
      id: 301,
      type: "review",
      content: "This book is absolutely terrible and the author should...",
      reportedBy: "user123",
      reportDate: "2023-05-15",
      status: "pending",
    },
    {
      id: 302,
      type: "forum post",
      content: "I completely disagree with your opinion and think you're...",
      reportedBy: "reader456",
      reportDate: "2023-05-14",
      status: "pending",
    },
    {
      id: 303,
      type: "comment",
      content: "Your review is biased and clearly you didn't even read...",
      reportedBy: "bookworm789",
      reportDate: "2023-05-13",
      status: "pending",
    },
  ],
}

const AdminDashboard = () => {
  const { currentUser } = useAuth()
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setDashboardStats(dashboardData)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="admin-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user">
          <span>Logged in as: </span>
          <strong>{currentUser?.name}</strong>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{dashboardStats.stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
          <div className="stat-info">
            <span className="stat-highlight">{dashboardStats.stats.activeUsers}</span> active
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{dashboardStats.stats.totalBooks}</div>
          <div className="stat-label">Total Books</div>
          <div className="stat-info">
            <span className="stat-highlight">{dashboardStats.stats.newBooks}</span> added this month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{dashboardStats.stats.totalReviews}</div>
          <div className="stat-label">Total Reviews</div>
          <div className="stat-info">
            <span className="stat-highlight">{dashboardStats.stats.pendingReviews}</span> pending approval
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{dashboardStats.stats.totalForumPosts}</div>
          <div className="stat-label">Forum Posts</div>
          <div className="stat-info">
            <span className="stat-highlight">{dashboardStats.stats.reportedContent}</span> reported content
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Users</h2>
            <Link to="/admin/users" className="view-all-link">
              View All Users
            </Link>
          </div>
          <div className="section-content">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardStats.recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${user.status}`}>{user.status}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/admin/users/${user.id}`} className="action-button view">
                          View
                        </Link>
                        <button className="action-button edit">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Books</h2>
            <Link to="/admin/books" className="view-all-link">
              View All Books
            </Link>
          </div>
          <div className="section-content">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Added Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardStats.recentBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{new Date(book.addedDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${book.status}`}>{book.status}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/book/${book.id}`} className="action-button view">
                          View
                        </Link>
                        <button className="action-button edit">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Reported Content</h2>
            <Link to="/admin/reports" className="view-all-link">
              View All Reports
            </Link>
          </div>
          <div className="section-content">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Content</th>
                  <th>Reported By</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardStats.reportedContent.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <span className="content-type">{report.type}</span>
                    </td>
                    <td>
                      <div className="truncated-content">{report.content}</div>
                    </td>
                    <td>{report.reportedBy}</td>
                    <td>{new Date(report.reportDate).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <button className="action-button view">Review</button>
                        <button className="action-button delete">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="admin-quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/admin/users/new" className="quick-action-card">
            <div className="quick-action-icon">👤</div>
            <div className="quick-action-label">Add New User</div>
          </Link>
          <Link to="/admin/books/new" className="quick-action-card">
            <div className="quick-action-icon">📚</div>
            <div className="quick-action-label">Add New Book</div>
          </Link>
          <Link to="/admin/competitions/new" className="quick-action-card">
            <div className="quick-action-icon">🏆</div>
            <div className="quick-action-label">Create Competition</div>
          </Link>
          <Link to="/admin/announcements/new" className="quick-action-card">
            <div className="quick-action-icon">📢</div>
            <div className="quick-action-label">Post Announcement</div>
          </Link>
          <Link to="/admin/reports" className="quick-action-card">
            <div className="quick-action-icon">⚠️</div>
            <div className="quick-action-label">Moderate Content</div>
          </Link>
          <Link to="/admin/settings" className="quick-action-card">
            <div className="quick-action-icon">⚙️</div>
            <div className="quick-action-label">Site Settings</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

