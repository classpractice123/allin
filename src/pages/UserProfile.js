"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { usersAPI } from "../services/api"
import "./UserProfile.css"

const UserProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, updateProfile } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({})
  const [activeTab, setActiveTab] = useState("profile")
  const [readingHistory, setReadingHistory] = useState([])
  const [userReviews, setUserReviews] = useState([])
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        // If viewing own profile
        if (id === "me" && currentUser) {
          setUser(currentUser)
          setEditedUser({
            name: currentUser.name,
            bio: currentUser.bio || "",
            favoriteGenres: [...(currentUser.favoriteGenres || [])],
          })

          // Fetch additional user data
          const [historyData, reviewsData, achievementsData] = await Promise.all([
            usersAPI.getUserReadingHistory(),
            usersAPI.getUserReviews(),
            usersAPI.getUserAchievements(),
          ])

          setReadingHistory(historyData)
          setUserReviews(reviewsData)
          setAchievements(achievementsData)
        }
        // If viewing another user's profile
        else if (id !== "me") {
          const userData = await usersAPI.getUserProfile(id)
          setUser(userData)
        }
        // If not logged in and trying to view own profile
        else {
          navigate("/login", { state: { from: "/profile/me" } })
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err)
        setError(err.message || "Failed to load user profile")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id, currentUser, navigate])

  const handleEditToggle = () => {
    if (isEditing) {
      // Discard changes
      setEditedUser({
        name: user.name,
        bio: user.bio || "",
        favoriteGenres: [...(user.favoriteGenres || [])],
      })
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedUser({
      ...editedUser,
      [name]: value,
    })
  }

  const handleGenreToggle = (genre) => {
    const currentGenres = [...editedUser.favoriteGenres]
    if (currentGenres.includes(genre)) {
      setEditedUser({
        ...editedUser,
        favoriteGenres: currentGenres.filter((g) => g !== genre),
      })
    } else {
      setEditedUser({
        ...editedUser,
        favoriteGenres: [...currentGenres, genre],
      })
    }
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const updatedUser = await updateProfile(editedUser)
      setUser({
        ...user,
        ...updatedUser,
      })
      setIsEditing(false)
      setError("")
    } catch (err) {
      setError("Failed to update profile: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="user-profile loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="user-profile error">
        <p>{error}</p>
        <Link to="/" className="back-link">
          Back to Home
        </Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="user-profile not-found">
        <p>User not found</p>
        <Link to="/" className="back-link">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar">
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} />
          </div>
          <div className="profile-info">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="edit-name-input"
              />
            ) : (
              <h1 className="profile-name">{user.name}</h1>
            )}
            <div className="profile-details">
              <div className="profile-detail">
                <span className="detail-label">Member Since:</span>
                <span className="detail-value">{new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="profile-detail">
                <span className="detail-label">Books Read:</span>
                <span className="detail-value">{user.booksRead}</span>
              </div>
              <div className="profile-detail">
                <span className="detail-label">Reviews:</span>
                <span className="detail-value">{user.reviewsWritten}</span>
              </div>
              <div className="profile-detail">
                <span className="detail-label">Points:</span>
                <span className="detail-value">{user.points}</span>
              </div>
            </div>
          </div>
          {id === "me" && (
            <div className="profile-actions">
              <button className="edit-profile-btn" onClick={handleEditToggle}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
              {isEditing && (
                <button className="save-profile-btn" onClick={handleSaveProfile}>
                  Save Changes
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`tab-button ${activeTab === "reading" ? "active" : ""}`}
          onClick={() => setActiveTab("reading")}
        >
          Reading History
        </button>
        <button
          className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
        <button
          className={`tab-button ${activeTab === "achievements" ? "active" : ""}`}
          onClick={() => setActiveTab("achievements")}
        >
          Achievements
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "profile" && (
          <div className="profile-tab">
            <div className="profile-section">
              <h2 className="section-title">About</h2>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editedUser.bio}
                  onChange={handleInputChange}
                  className="edit-bio-input"
                  placeholder="Write something about yourself..."
                />
              ) : (
                <p className="profile-bio">{user.bio || "No bio available."}</p>
              )}
            </div>

            <div className="profile-section">
              <h2 className="section-title">Favorite Genres</h2>
              {isEditing ? (
                <div className="genre-selection">
                  {[
                    "Fiction",
                    "Non-Fiction",
                    "Mystery",
                    "Science Fiction",
                    "Fantasy",
                    "Romance",
                    "Thriller",
                    "Horror",
                    "Biography",
                    "History",
                    "Self-Help",
                  ].map((genre) => (
                    <label key={genre} className="genre-checkbox">
                      <input
                        type="checkbox"
                        checked={editedUser.favoriteGenres.includes(genre)}
                        onChange={() => handleGenreToggle(genre)}
                      />
                      <span>{genre}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="favorite-genres">
                  {user.favoriteGenres && user.favoriteGenres.length > 0 ? (
                    user.favoriteGenres.map((genre) => (
                      <span key={genre} className="genre-tag">
                        {genre}
                      </span>
                    ))
                  ) : (
                    <p>No favorite genres specified.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "reading" && (
          <div className="reading-tab">
            <h2 className="section-title">Reading History</h2>
            {readingHistory && readingHistory.length > 0 ? (
              <div className="reading-history-list">
                {readingHistory.map((book) => (
                  <div key={book.id} className="reading-history-item">
                    <div className="book-cover">
                      <img src={book.coverImage || "/placeholder.svg"} alt={book.title} />
                    </div>
                    <div className="book-details">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">by {book.author}</p>
                      <div className="book-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < Math.floor(book.rating) ? "filled" : ""}`}>
                            ★
                          </span>
                        ))}
                        <span className="rating-number">({book.rating})</span>
                      </div>
                      <p className="date-read">Read on {new Date(book.dateRead).toLocaleDateString()}</p>
                    </div>
                    <div className="book-actions">
                      <Link to={`/book/${book.id}`} className="view-book-btn">
                        View Book
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No reading history available.</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="reviews-tab">
            <h2 className="section-title">My Reviews</h2>
            {userReviews && userReviews.length > 0 ? (
              <div className="user-reviews-list">
                {userReviews.map((review) => (
                  <div key={review.id} className="user-review-item">
                    <div className="review-book-info">
                      <div className="book-cover">
                        <img src={review.bookCover || "/placeholder.svg"} alt={review.bookTitle} />
                      </div>
                      <div className="book-details">
                        <h3 className="book-title">{review.bookTitle}</h3>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`star ${i < Math.floor(review.rating) ? "filled" : ""}`}>
                              ★
                            </span>
                          ))}
                          <span className="rating-number">({review.rating})</span>
                        </div>
                        <p className="review-date">Reviewed on {new Date(review.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="review-content">
                      <p>{review.content}</p>
                    </div>
                    <div className="review-actions">
                      <Link to={`/book/${review.bookId}`} className="view-book-btn">
                        View Book
                      </Link>
                      {id === "me" && <button className="edit-review-btn">Edit Review</button>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No reviews written yet.</p>
            )}
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="achievements-tab">
            <h2 className="section-title">Achievements</h2>
            {achievements && achievements.length > 0 ? (
              <div className="achievements-list">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="achievement-item">
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-details">
                      <h3 className="achievement-title">{achievement.title}</h3>
                      <p className="achievement-description">{achievement.description}</p>
                      <p className="achievement-date">Achieved on {new Date(achievement.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No achievements earned yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile

