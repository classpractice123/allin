"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useForums } from "../contexts/ForumContext"
import "./Forums.css"

const Forums = () => {
  const { currentUser } = useAuth()
  const { categories, topics, loading, error, fetchCategories, fetchRecentTopics } = useForums()

  const { categoryId, subforumId } = useParams()
  const [activeTab, setActiveTab] = useState("categories")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState([])

  useEffect(() => {
    // If we have a category ID in the URL, expand that category
    if (categoryId && !expandedCategories.includes(Number.parseInt(categoryId))) {
      setExpandedCategories([...expandedCategories, Number.parseInt(categoryId)])
    }

    // Set the active tab based on the URL parameters
    if (categoryId || subforumId) {
      setActiveTab("categories")
    }

    // Fetch categories and recent topics
    fetchCategories().catch((err) => console.error("Failed to fetch categories:", err))
    fetchRecentTopics().catch((err) => console.error("Failed to fetch recent topics:", err))
  }, [categoryId, subforumId, fetchCategories, fetchRecentTopics])

  const toggleCategoryExpansion = (categoryId) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter((id) => id !== categoryId))
    } else {
      setExpandedCategories([...expandedCategories, categoryId])
    }
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

  if (loading && categories.length === 0 && topics.length === 0) {
    return (
      <div className="forums-page loading">
        <div className="loading-spinner"></div>
        <p>Loading forums...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="forums-page error">
        <div className="error-message">
          <h2>Error Loading Forums</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="forums-page">
      <div className="forums-header">
        <h1>Forums</h1>
        <p>Join discussions, share your thoughts, and connect with fellow book lovers.</p>
      </div>

      <div className="forums-actions">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search forums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button">Search</button>
        </div>

        {currentUser && (
          <Link to="/forums/new-topic" className="new-topic-btn">
            Create New Topic
          </Link>
        )}
      </div>

      <div className="forums-tabs">
        <button
          className={`tab-button ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
        <button
          className={`tab-button ${activeTab === "recent" ? "active" : ""}`}
          onClick={() => setActiveTab("recent")}
        >
          Recent Discussions
        </button>
        {currentUser && (
          <button
            className={`tab-button ${activeTab === "participated" ? "active" : ""}`}
            onClick={() => setActiveTab("participated")}
          >
            My Discussions
          </button>
        )}
        {currentUser && (
          <button
            className={`tab-button ${activeTab === "bookmarked" ? "active" : ""}`}
            onClick={() => setActiveTab("bookmarked")}
          >
            Bookmarked
          </button>
        )}
      </div>

      {activeTab === "categories" && (
        <div className="forum-categories">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-header" onClick={() => toggleCategoryExpansion(category.id)}>
                <div className="category-icon">{category.icon}</div>
                <div className="category-info">
                  <h2 className="category-name">{category.name}</h2>
                  <p className="category-description">{category.description}</p>
                </div>
                <div className="category-stats">
                  <div className="stat-item">
                    <span className="stat-value">{category.topics}</span>
                    <span className="stat-label">Topics</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{category.posts}</span>
                    <span className="stat-label">Posts</span>
                  </div>
                </div>
                <div className="category-toggle">
                  <span className={`toggle-icon ${expandedCategories.includes(category.id) ? "expanded" : ""}`}>▼</span>
                </div>
              </div>

              {expandedCategories.includes(category.id) && (
                <div className="subforums-list">
                  {category.subforums.map((subforum) => (
                    <Link
                      key={subforum.id}
                      to={`/forums/category/${category.id}/subforum/${subforum.id}`}
                      className="subforum-item"
                    >
                      <div className="subforum-info">
                        <h3 className="subforum-name">{subforum.name}</h3>
                        <p className="subforum-description">{subforum.description}</p>
                      </div>
                      <div className="subforum-stats">
                        <div className="stat-item">
                          <span className="stat-value">{subforum.topics}</span>
                          <span className="stat-label">Topics</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{subforum.posts}</span>
                          <span className="stat-label">Posts</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "recent" && (
        <div className="recent-topics">
          <div className="topics-header">
            <div className="topic-title-col">Topic</div>
            <div className="topic-category-col">Category</div>
            <div className="topic-stats-col">Stats</div>
            <div className="topic-last-post-col">Last Post</div>
          </div>

          {topics.length > 0 ? (
            topics.map((topic) => (
              <div key={topic.id} className="topic-row">
                <div className="topic-title-col">
                  <Link to={`/forums/topic/${topic.id}`} className="topic-title">
                    {topic.title}
                  </Link>
                  <div className="topic-author">
                    <img
                      src={topic.author.avatar || "/placeholder.svg"}
                      alt={topic.author.name}
                      className="author-avatar"
                    />
                    <span>by {topic.author.name}</span>
                  </div>
                </div>

                <div className="topic-category-col">
                  <div className="topic-category">{topic.category}</div>
                  <div className="topic-subforum">{topic.subforum}</div>
                </div>

                <div className="topic-stats-col">
                  <div className="topic-replies">
                    <span className="stat-value">{topic.replies}</span> replies
                  </div>
                  <div className="topic-views">
                    <span className="stat-value">{topic.views}</span> views
                  </div>
                </div>

                <div className="topic-last-post-col">
                  <div className="last-post-date">{formatDate(topic.lastPost.date)}</div>
                  <div className="last-post-author">
                    <img
                      src={topic.lastPost.author.avatar || "/placeholder.svg"}
                      alt={topic.lastPost.author.name}
                      className="author-avatar"
                    />
                    <span>by {topic.lastPost.author.name}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-topics">
              <p>No recent topics found.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "participated" && currentUser && (
        <div className="participated-topics">
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>No participated discussions yet</h3>
            <p>Join the conversation by replying to topics or creating your own.</p>
            <Link to="/forums/new-topic" className="new-topic-btn">
              Create New Topic
            </Link>
          </div>
        </div>
      )}

      {activeTab === "bookmarked" && currentUser && (
        <div className="bookmarked-topics">
          <div className="empty-state">
            <div className="empty-icon">🔖</div>
            <h3>No bookmarked discussions yet</h3>
            <p>Bookmark topics to easily find them later.</p>
            <Link to="/forums" className="browse-topics-btn" onClick={() => setActiveTab("recent")}>
              Browse Topics
            </Link>
          </div>
        </div>
      )}

      <div className="forums-stats">
        <div className="stat-card">
          <div className="stat-value">{categories.length}</div>
          <div className="stat-label">Categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {categories.reduce((total, category) => total + category.subforums.length, 0)}
          </div>
          <div className="stat-label">Subforums</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{categories.reduce((total, category) => total + category.topics, 0)}</div>
          <div className="stat-label">Topics</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{categories.reduce((total, category) => total + category.posts, 0)}</div>
          <div className="stat-label">Posts</div>
        </div>
      </div>

      <div className="forum-guidelines">
        <h3>Forum Guidelines</h3>
        <ul>
          <li>Be respectful and considerate of other members.</li>
          <li>Stay on topic and post in the appropriate categories.</li>
          <li>No spam, advertising, or self-promotion without permission.</li>
          <li>Respect copyright and intellectual property rights.</li>
          <li>Moderators have the final say on content appropriateness.</li>
        </ul>
      </div>
    </div>
  )
}

export default Forums

