"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Users.css"

// Mock data for users
const usersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user",
    status: "active",
    joinDate: "2022-09-15",
    lastLogin: "2023-05-15",
    booksRead: 42,
    reviewsWritten: 15,
  },
  {
    id: 2,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    joinDate: "2022-01-10",
    lastLogin: "2023-05-16",
    booksRead: 128,
    reviewsWritten: 47,
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    status: "active",
    joinDate: "2022-11-20",
    lastLogin: "2023-05-14",
    booksRead: 37,
    reviewsWritten: 12,
  },
  {
    id: 4,
    name: "Robert Johnson",
    email: "robert.j@example.com",
    role: "moderator",
    status: "active",
    joinDate: "2022-08-05",
    lastLogin: "2023-05-15",
    booksRead: 65,
    reviewsWritten: 28,
  },
  {
    id: 5,
    name: "Emily Davis",
    email: "emily.d@example.com",
    role: "user",
    status: "inactive",
    joinDate: "2023-01-15",
    lastLogin: "2023-04-20",
    booksRead: 12,
    reviewsWritten: 3,
  },
  {
    id: 6,
    name: "Michael Wilson",
    email: "michael.w@example.com",
    role: "user",
    status: "pending",
    joinDate: "2023-05-10",
    lastLogin: null,
    booksRead: 0,
    reviewsWritten: 0,
  },
  {
    id: 7,
    name: "Sarah Thompson",
    email: "sarah.t@example.com",
    role: "user",
    status: "active",
    joinDate: "2022-12-08",
    lastLogin: "2023-05-12",
    booksRead: 28,
    reviewsWritten: 9,
  },
  {
    id: 8,
    name: "David Martinez",
    email: "david.m@example.com",
    role: "user",
    status: "active",
    joinDate: "2023-02-22",
    lastLogin: "2023-05-13",
    booksRead: 15,
    reviewsWritten: 5,
  },
  {
    id: 9,
    name: "Jessica Brown",
    email: "jessica.b@example.com",
    role: "user",
    status: "active",
    joinDate: "2023-03-17",
    lastLogin: "2023-05-11",
    booksRead: 8,
    reviewsWritten: 2,
  },
  {
    id: 10,
    name: "Daniel Taylor",
    email: "daniel.t@example.com",
    role: "user",
    status: "banned",
    joinDate: "2022-10-30",
    lastLogin: "2023-04-15",
    booksRead: 22,
    reviewsWritten: 7,
  },
]

const Users = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isAllSelected, setIsAllSelected] = useState(false)

  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setUsers(usersData)
      setFilteredUsers(usersData)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    filterUsers()
  }, [searchTerm, roleFilter, statusFilter, sortBy, sortOrder, users])

  const filterUsers = () => {
    let filtered = [...users]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "email":
          comparison = a.email.localeCompare(b.email)
          break
        case "role":
          comparison = a.role.localeCompare(b.role)
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "joinDate":
          comparison = new Date(a.joinDate) - new Date(b.joinDate)
          break
        case "lastLogin":
          // Handle null lastLogin values
          if (!a.lastLogin) return 1
          if (!b.lastLogin) return -1
          comparison = new Date(a.lastLogin) - new Date(b.lastLogin)
          break
        case "booksRead":
          comparison = a.booksRead - b.booksRead
          break
        case "reviewsWritten":
          comparison = a.reviewsWritten - b.reviewsWritten
          break
        default:
          comparison = 0
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredUsers(filtered)
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
    setIsAllSelected(!isAllSelected)
  }

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
      setIsAllSelected(false)
    } else {
      setSelectedUsers([...selectedUsers, userId])
      if (selectedUsers.length + 1 === filteredUsers.length) {
        setIsAllSelected(true)
      }
    }
  }

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) return

    // In a real app, this would be an API call
    console.log(`Performing ${action} on users:`, selectedUsers)

    // Update local state for demo purposes
    if (action === "activate" || action === "deactivate" || action === "ban") {
      const newStatus = action === "activate" ? "active" : action === "deactivate" ? "inactive" : "banned"
      const updatedUsers = users.map((user) =>
        selectedUsers.includes(user.id) ? { ...user, status: newStatus } : user,
      )
      setUsers(updatedUsers)
    } else if (action === "delete") {
      const updatedUsers = users.filter((user) => !selectedUsers.includes(user.id))
      setUsers(updatedUsers)
    }

    // Reset selection
    setSelectedUsers([])
    setIsAllSelected(false)
  }

  if (loading) {
    return (
      <div className="users-page loading">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    )
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <h1>User Management</h1>
        <Link to="/admin/users/new" className="add-user-btn">
          Add New User
        </Link>
      </div>

      <div className="users-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter">
            <label>Role:</label>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="filter">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="bulk-actions">
          <span className="selected-count">{selectedUsers.length} users selected</span>
          <div className="action-buttons">
            <button className="bulk-action-btn activate" onClick={() => handleBulkAction("activate")}>
              Activate
            </button>
            <button className="bulk-action-btn deactivate" onClick={() => handleBulkAction("deactivate")}>
              Deactivate
            </button>
            <button className="bulk-action-btn ban" onClick={() => handleBulkAction("ban")}>
              Ban
            </button>
            <button className="bulk-action-btn delete" onClick={() => handleBulkAction("delete")}>
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th className="checkbox-cell">
                <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
              </th>
              <th className={`sortable ${sortBy === "name" ? "sorted" : ""}`} onClick={() => handleSort("name")}>
                Name
                {sortBy === "name" && <span className="sort-indicator">{sortOrder === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th className={`sortable ${sortBy === "email" ? "sorted" : ""}`} onClick={() => handleSort("email")}>
                Email
                {sortBy === "email" && <span className="sort-indicator">{sortOrder === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th className={`sortable ${sortBy === "role" ? "sorted" : ""}`} onClick={() => handleSort("role")}>
                Role
                {sortBy === "role" && <span className="sort-indicator">{sortOrder === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th className={`sortable ${sortBy === "status" ? "sorted" : ""}`} onClick={() => handleSort("status")}>
                Status
                {sortBy === "status" && <span className="sort-indicator">{sortOrder === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th
                className={`sortable ${sortBy === "joinDate" ? "sorted" : ""}`}
                onClick={() => handleSort("joinDate")}
              >
                Join Date
                {sortBy === "joinDate" && <span className="sort-indicator">{sortOrder === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th
                className={`sortable ${sortBy === "lastLogin" ? "sorted" : ""}`}
                onClick={() => handleSort("lastLogin")}
              >
                Last Login
                {sortBy === "lastLogin" && <span className="sort-indicator">{sortOrder === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th
                className={`sortable ${sortBy === "booksRead" ? "sorted" : ""}`}
                onClick={() => handleSort("booksRead")}
              >
                Books Read
                {sortBy === "booksRead" && <span className="sort-indicator">{sortOrder === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th
                className={`sortable ${sortBy === "reviewsWritten" ? "sorted" : ""}`}
                onClick={() => handleSort("reviewsWritten")}
              >
                Reviews
                {sortBy === "reviewsWritten" && (
                  <span className="sort-indicator">{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="checkbox-cell">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>{user.status}</span>
                  </td>
                  <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</td>
                  <td>{user.booksRead}</td>
                  <td>{user.reviewsWritten}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/admin/users/${user.id}`} className="action-button view">
                        View
                      </Link>
                      <Link to={`/admin/users/${user.id}/edit`} className="action-button edit">
                        Edit
                      </Link>
                      <button className="action-button delete">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-results">
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="pagination-btn" disabled>
          Previous
        </button>
        <div className="pagination-pages">
          <button className="pagination-page active">1</button>
          <button className="pagination-page">2</button>
          <button className="pagination-page">3</button>
        </div>
        <button className="pagination-btn">Next</button>
      </div>
    </div>
  )
}

export default Users

