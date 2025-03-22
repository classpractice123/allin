"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useCommunities } from "../contexts/CommunityContext"
import "./Communities.css"

const Communities = () => {
  const { currentUser } = useAuth()
  const {
    communities,
    joinedCommunities,
    loading,
    error,
    fetchCommunities,
    fetchJoinedCommunities,
    joinCommunity,
    leaveCommunity,
  } = useCommunities()

  const [filteredCommunities, setFilteredCommunities] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    // Fetch all communities
    fetchCommunities().catch((err) => console.error("Failed to fetch communities:", err))

    // If user is logged in, fetch joined communities
    if (currentUser) {
      fetchJoinedCommunities().catch((err) => console.error("Failed to fetch joined communities:", err))
    }
  }, [currentUser, fetchCommunities, fetchJoinedCommunities])

  useEffect(() => {
    filterCommunities()
  }, [searchTerm, selectedCategory, activeTab, communities, joinedCommunities])

  const filterCommunities = () => {
    let filtered = activeTab === "joined" && currentUser ? [...joinedCommunities] : [...communities]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (community) =>
          community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          community.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((community) =>
        community.categories.some((category) => category.toLowerCase() === selectedCategory.toLowerCase()),
      )
    }

    setFilteredCommunities(filtered)
  }

  const handleJoinCommunity = (communityId) => {
    if (!currentUser) return

    const community = communities.find((c) => c.id === communityId)
    if (community && !community.isJoined) {
      joinCommunity(communityId).catch((err) => console.error("Failed to join community:", err))
    } else {
      leaveCommunity(communityId).catch((err) => console.error("Failed to leave community:", err))
    }
  }

  const getAllCategories = () => {
    const allCategories = new Set()
    communities.forEach((community) => {
      community.categories.forEach((category) => {
        allCategories.add(category)
      })
    })
    return ["all", ...Array.from(allCategories).sort()]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading && communities.length === 0) {
    return (
      <div className="communities-page loading">
        <div className="loading-spinner"></div>
        <p>Loading communities...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="communities-page error">
        <div className="error-message">
          <h2>Error Loading Communities</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="communities-page">
      <div className="communities-header">
        <h1>Communities</h1>
        <p>Join book communities based on your interests and connect with fellow readers.</p>
      </div>

      <div className="communities-actions">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button" onClick={filterCommunities}>
            Search
          </button>
        </div>

        {currentUser && (
          <Link to="/communities/create" className="create-community-btn">
            Create Community
          </Link>
        )}
      </div>

      <div className="communities-filters">
        <div className="tabs-filter">
          <button className={`tab-button ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
            All Communities
          </button>
          {currentUser && (
            <button
              className={`tab-button ${activeTab === "joined" ? "active" : ""}`}
              onClick={() => setActiveTab("joined")}
            >
              My Communities
            </button>
          )}
        </div>

        <div className="category-filter">
          <label>Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {getAllCategories().map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredCommunities.length > 0 ? (
        <div className="communities-grid">
          {filteredCommunities.map((community) => (
            <div key={community.id} className="community-card">
              <div className="community-cover">
                <img src={community.coverImage || "/placeholder.svg"} alt={community.name} />
              </div>
              <div className="community-content">
                <h2 className="community-name">{community.name}</h2>
                <p className="community-description">{community.description}</p>
                <div className="community-stats">
                  <div className="stat-item">
                    <span className="stat-value">{community.members}</span>
                    <span className="stat-label">Members</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{community.topics}</span>
                    <span className="stat-label">Topics</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{community.posts}</span>
                    <span className="stat-label">Posts</span>
                  </div>
                </div>
                <div className="community-categories">
                  {community.categories.map((category) => (
                    <span key={category} className="category-tag">
                      {category}
                    </span>
                  ))}
                </div>
                <div className="community-actions">
                  <Link to={`/communities/${community.id}`} className="view-community-btn">
                    View Community
                  </Link>
                  {currentUser && (
                    <button
                      className={`join-community-btn ${community.isJoined ? "joined" : ""}`}
                      onClick={() => handleJoinCommunity(community.id)}
                    >
                      {community.isJoined ? "Leave" : "Join"}
                    </button>
                  )}
                </div>
              </div>
              <div className="community-activity">
                <h3>Recent Activity</h3>
                {community.recentActivity && community.recentActivity.length > 0 ? (
                  <ul className="activity-list">
                    {community.recentActivity.map((activity) => (
                      <li key={activity.id} className="activity-item">
                        <div className={`activity-type ${activity.type}`}>
                          {activity.type === "discussion" && "💬"}
                          {activity.type === "event" && "📅"}
                          {activity.type === "poll" && "📊"}
                          {activity.type === "recommendation" && "📚"}
                        </div>
                        <div className="activity-content">
                          <Link to={`/communities/${community.id}/activity/${activity.id}`} className="activity-title">
                            {activity.title}
                          </Link>
                          <div className="activity-meta">
                            <span className="activity-author">by {activity.author}</span>
                            <span className="activity-date">{formatDate(activity.date)}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-activity">No recent activity</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-communities">
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No communities found</h3>
            <p>
              {activeTab === "joined"
                ? "You haven't joined any communities yet."
                : "No communities match your search criteria."}
            </p>
            {activeTab === "joined" && (
              <button className="browse-communities-btn" onClick={() => setActiveTab("all")}>
                Browse Communities
              </button>
            )}
          </div>
        </div>
      )}

      <div className="communities-info">
        <div className="info-card">
          <div className="info-icon">👥</div>
          <h3>Join Communities</h3>
          <p>Connect with readers who share your interests and discover new books through community recommendations.</p>
        </div>
        <div className="info-card">
          <div className="info-icon">💬</div>
          <h3>Participate in Discussions</h3>
          <p>Share your thoughts, ask questions, and engage in meaningful conversations about books and reading.</p>
        </div>
        <div className="info-card">
          <div className="info-icon">📅</div>
          <h3>Attend Events</h3>
          <p>Join virtual book clubs, author Q&As, and reading challenges organized by community members.</p>
        </div>
      </div>
    </div>
  )
}

export default Communities

