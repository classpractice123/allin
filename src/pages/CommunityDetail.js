"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./CommunityDetail.css"

// Mock data for a community
const communityData = {
  id: 1,
  name: "Fantasy Book Club",
  description: "A community for fans of fantasy literature to discuss books, authors, and all things magical.",
  coverImage: "https://source.unsplash.com/random/1200x300?fantasy,books",
  members: 1245,
  topics: 156,
  posts: 2345,
  isJoined: true,
  categories: ["Fantasy", "Book Club", "Fiction"],
  createdAt: "2022-01-15",
  moderators: [
    {
      id: 201,
      name: "FantasyMod",
      avatar: "https://source.unsplash.com/random/100x100?portrait,1",
    },
    {
      id: 202,
      name: "BookwormAdmin",
      avatar: "https://source.unsplash.com/random/100x100?portrait,2",
    },
  ],
  discussions: [
    {
      id: 301,
      title: "Brandon Sanderson's Cosmere Universe - Discussion Thread",
      author: {
        id: 401,
        name: "FantasyFan42",
        avatar: "https://source.unsplash.com/random/100x100?portrait,3",
      },
      createdAt: "2023-05-15T14:30:00",
      replies: 28,
      views: 342,
      lastPost: {
        date: "2023-05-16T09:15:00",
        author: {
          id: 402,
          name: "CosmereExpert",
          avatar: "https://source.unsplash.com/random/100x100?portrait,4",
        },
      },
      isPinned: true,
    },
    {
      id: 302,
      title: "What fantasy book are you currently reading?",
      author: {
        id: 403,
        name: "BookDragon",
        avatar: "https://source.unsplash.com/random/100x100?portrait,5",
      },
      createdAt: "2023-05-14T10:15:00",
      replies: 45,
      views: 567,
      lastPost: {
        date: "2023-05-16T11:20:00",
        author: {
          id: 404,
          name: "PageTurner",
          avatar: "https://source.unsplash.com/random/100x100?portrait,6",
        },
      },
      isPinned: false,
    },
    {
      id: 303,
      title: "Best Fantasy Series of All Time? - Poll",
      author: {
        id: 405,
        name: "EpicReader",
        avatar: "https://source.unsplash.com/random/100x100?portrait,7",
      },
      createdAt: "2023-05-13T16:45:00",
      replies: 72,
      views: 890,
      lastPost: {
        date: "2023-05-16T08:30:00",
        author: {
          id: 406,
          name: "FantasyLover",
          avatar: "https://source.unsplash.com/random/100x100?portrait,8",
        },
      },
      isPinned: false,
    },
    {
      id: 304,
      title: "Recommendations for fantasy books with strong female protagonists",
      author: {
        id: 407,
        name: "BookwormJane",
        avatar: "https://source.unsplash.com/random/100x100?portrait,9",
      },
      createdAt: "2023-05-12T13:20:00",
      replies: 36,
      views: 423,
      lastPost: {
        date: "2023-05-15T19:45:00",
        author: {
          id: 408,
          name: "LiteraryExplorer",
          avatar: "https://source.unsplash.com/random/100x100?portrait,10",
        },
      },
      isPinned: false,
    },
    {
      id: 305,
      title: "Virtual Book Club: 'The Name of the Wind' by Patrick Rothfuss - June 15th",
      author: {
        id: 409,
        name: "BookClubHost",
        avatar: "https://source.unsplash.com/random/100x100?portrait,11",
      },
      createdAt: "2023-05-11T11:30:00",
      replies: 19,
      views: 276,
      lastPost: {
        date: "2023-05-14T16:10:00",
        author: {
          id: 410,
          name: "WindFan",
          avatar: "https://source.unsplash.com/random/100x100?portrait,12",
        },
      },
      isPinned: true,
    },
  ],
  events: [
    {
      id: 501,
      title: "Virtual Book Club: 'The Name of the Wind' by Patrick Rothfuss",
      description: "Join us for a discussion of Patrick Rothfuss's fantasy classic. All are welcome!",
      date: "2023-06-15T19:00:00",
      host: "BookClubHost",
      attendees: 34,
      image: "https://source.unsplash.com/random/600x300?fantasy,book",
    },
    {
      id: 502,
      title: "Author Q&A: Sarah J. Maas",
      description: "Live Q&A session with bestselling fantasy author Sarah J. Maas. Submit your questions in advance!",
      date: "2023-06-22T18:30:00",
      host: "FantasyMod",
      attendees: 128,
      image: "https://source.unsplash.com/random/600x300?author,writing",
    },
  ],
  readingChallenges: [
    {
      id: 601,
      title: "Summer Fantasy Reading Challenge",
      description: "Read 5 fantasy books this summer and share your thoughts with the community.",
      startDate: "2023-06-01",
      endDate: "2023-08-31",
      participants: 87,
      image: "https://source.unsplash.com/random/600x300?summer,reading",
    },
  ],
  recentMembers: [
    {
      id: 701,
      name: "NewFantasyReader",
      avatar: "https://source.unsplash.com/random/100x100?portrait,13",
      joinDate: "2023-05-16",
    },
    {
      id: 702,
      name: "MagicBookworm",
      avatar: "https://source.unsplash.com/random/100x100?portrait,14",
      joinDate: "2023-05-15",
    },
    {
      id: 703,
      name: "DragonLover",
      avatar: "https://source.unsplash.com/random/100x100?portrait,15",
      joinDate: "2023-05-14",
    },
    {
      id: 704,
      name: "EpicTales",
      avatar: "https://source.unsplash.com/random/100x100?portrait,16",
      joinDate: "2023-05-13",
    },
  ],
}

const CommunityDetail = () => {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const [community, setCommunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("discussions")

  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setCommunity(communityData)
      setLoading(false)
    }, 1000)
  }, [id])

  const handleJoinCommunity = () => {
    if (!currentUser) return

    setCommunity({
      ...community,
      isJoined: !community.isJoined,
      members: community.isJoined ? community.members - 1 : community.members + 1,
    })
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

  if (loading) {
    return (
      <div className="community-detail-page loading">
        <div className="loading-spinner"></div>
        <p>Loading community...</p>
      </div>
    )
  }

  if (!community) {
    return (
      <div className="community-detail-page not-found">
        <h2>Community Not Found</h2>
        <p>The community you're looking for doesn't exist or has been removed.</p>
        <Link to="/communities" className="back-to-communities">
          Back to Communities
        </Link>
      </div>
    )
  }

  return (
    <div className="community-detail-page">
      <div className="community-cover-image">
        <img src={community.coverImage || "/placeholder.svg"} alt={community.name} />
      </div>

      <div className="community-header">
        <div className="community-info">
          <h1 className="community-name">{community.name}</h1>
          <div className="community-categories">
            {community.categories.map((category) => (
              <span key={category} className="category-tag">
                {category}
              </span>
            ))}
          </div>
          <p className="community-description">{community.description}</p>
        </div>

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

        <div className="community-actions">
          {currentUser && (
            <button
              className={`join-community-btn ${community.isJoined ? "joined" : ""}`}
              onClick={handleJoinCommunity}
            >
              {community.isJoined ? "Leave Community" : "Join Community"}
            </button>
          )}
          {!currentUser && (
            <Link to="/login" className="login-to-join">
              Log in to join
            </Link>
          )}
        </div>
      </div>

      <div className="community-tabs">
        <button
          className={`tab-button ${activeTab === "discussions" ? "active" : ""}`}
          onClick={() => setActiveTab("discussions")}
        >
          Discussions
        </button>
        <button
          className={`tab-button ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
          className={`tab-button ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
        <button
          className={`tab-button ${activeTab === "challenges" ? "active" : ""}`}
          onClick={() => setActiveTab("challenges")}
        >
          Reading Challenges
        </button>
        <button
          className={`tab-button ${activeTab === "members" ? "active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          Members
        </button>
        <button className={`tab-button ${activeTab === "about" ? "active" : ""}`} onClick={() => setActiveTab("about")}>
          About
        </button>
      </div>

      <div className="community-content">
        {activeTab === "discussions" && (
          <div className="discussions-tab">
            <div className="tab-header">
              <h2>Discussions</h2>
              {currentUser && community.isJoined && (
                <Link to={`/communities/${community.id}/new-discussion`} className="new-discussion-btn">
                  New Discussion
                </Link>
              )}
            </div>

            <div className="discussions-list">
              {community.discussions.map((discussion) => (
                <div key={discussion.id} className={`discussion-item ${discussion.isPinned ? "pinned" : ""}`}>
                  {discussion.isPinned && <div className="pinned-badge">📌 Pinned</div>}
                  <div className="discussion-main">
                    <div className="discussion-author">
                      <img
                        src={discussion.author.avatar || "/placeholder.svg"}
                        alt={discussion.author.name}
                        className="author-avatar"
                      />
                    </div>
                    <div className="discussion-content">
                      <Link
                        to={`/communities/${community.id}/discussion/${discussion.id}`}
                        className="discussion-title"
                      >
                        {discussion.title}
                      </Link>
                      <div className="discussion-meta">
                        <span className="discussion-author-name">by {discussion.author.name}</span>
                        <span className="discussion-date">{formatDate(discussion.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="discussion-stats">
                    <div className="stat-item">
                      <span className="stat-value">{discussion.replies}</span>
                      <span className="stat-label">Replies</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{discussion.views}</span>
                      <span className="stat-label">Views</span>
                    </div>
                  </div>
                  <div className="discussion-last-post">
                    <div className="last-post-info">
                      <span className="last-post-label">Last post</span>
                      <span className="last-post-date">{formatDate(discussion.lastPost.date)}</span>
                    </div>
                    <div className="last-post-author">
                      <img
                        src={discussion.lastPost.author.avatar || "/placeholder.svg"}
                        alt={discussion.lastPost.author.name}
                        className="author-avatar"
                      />
                      <span>{discussion.lastPost.author.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="events-tab">
            <div className="tab-header">
              <h2>Upcoming Events</h2>
              {currentUser && community.isJoined && (
                <Link to={`/communities/${community.id}/new-event`} className="new-event-btn">
                  Create Event
                </Link>
              )}
            </div>

            <div className="events-grid">
              {community.events.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <img src={event.image || "/placeholder.svg"} alt={event.title} />
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    <div className="event-details">
                      <div className="event-date">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="event-time">
                        <span className="detail-label">Time:</span>
                        <span className="detail-value">
                          {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="event-host">
                        <span className="detail-label">Host:</span>
                        <span className="detail-value">{event.host}</span>
                      </div>
                      <div className="event-attendees">
                        <span className="detail-label">Attendees:</span>
                        <span className="detail-value">{event.attendees}</span>
                      </div>
                    </div>
                    <div className="event-actions">
                      <Link to={`/communities/${community.id}/event/${event.id}`} className="view-event-btn">
                        View Details
                      </Link>
                      {currentUser && community.isJoined && <button className="attend-event-btn">Attend</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "challenges" && (
          <div className="challenges-tab">
            <div className="tab-header">
              <h2>Reading Challenges</h2>
              {currentUser && community.isJoined && (
                <Link to={`/communities/${community.id}/new-challenge`} className="new-challenge-btn">
                  Create Challenge
                </Link>
              )}
            </div>

            <div className="challenges-grid">
              {community.readingChallenges.map((challenge) => (
                <div key={challenge.id} className="challenge-card">
                  <div className="challenge-image">
                    <img src={challenge.image || "/placeholder.svg"} alt={challenge.title} />
                  </div>
                  <div className="challenge-content">
                    <h3 className="challenge-title">{challenge.title}</h3>
                    <p className="challenge-description">{challenge.description}</p>
                    <div className="challenge-details">
                      <div className="challenge-dates">
                        <span className="detail-label">Dates:</span>
                        <span className="detail-value">
                          {new Date(challenge.startDate).toLocaleDateString()} -{" "}
                          {new Date(challenge.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="challenge-participants">
                        <span className="detail-label">Participants:</span>
                        <span className="detail-value">{challenge.participants}</span>
                      </div>
                    </div>
                    <div className="challenge-actions">
                      <Link
                        to={`/communities/${community.id}/challenge/${challenge.id}`}
                        className="view-challenge-btn"
                      >
                        View Details
                      </Link>
                      {currentUser && community.isJoined && (
                        <button className="join-challenge-btn">Join Challenge</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="members-tab">
            <div className="tab-header">
              <h2>Members</h2>
              <div className="members-count">{community.members} members</div>
            </div>

            <div className="members-section">
              <h3>Moderators</h3>
              <div className="members-grid moderators">
                {community.moderators.map((moderator) => (
                  <div key={moderator.id} className="member-card moderator">
                    <div className="member-avatar">
                      <img src={moderator.avatar || "/placeholder.svg"} alt={moderator.name} />
                    </div>
                    <div className="member-info">
                      <div className="member-name">{moderator.name}</div>
                      <div className="member-role">Moderator</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="members-section">
              <h3>Recent Members</h3>
              <div className="members-grid">
                {community.recentMembers.map((member) => (
                  <div key={member.id} className="member-card">
                    <div className="member-avatar">
                      <img src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    </div>
                    <div className="member-info">
                      <div className="member-name">{member.name}</div>
                      <div className="member-join-date">Joined {formatDate(member.joinDate)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="view-all-members">
              <Link to={`/communities/${community.id}/members`} className="view-all-btn">
                View All Members
              </Link>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="about-tab">
            <div className="about-section">
              <h3>About This Community</h3>
              <p className="community-description">{community.description}</p>
              <div className="community-details">
                <div className="detail-item">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">{new Date(community.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Members:</span>
                  <span className="detail-value">{community.members}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Topics:</span>
                  <span className="detail-value">{community.topics}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Posts:</span>
                  <span className="detail-value">{community.posts}</span>
                </div>
              </div>
            </div>

            <div className="about-section">
              <h3>Categories</h3>
              <div className="community-categories about-categories">
                {community.categories.map((category) => (
                  <span key={category} className="category-tag">
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="about-section">
              <h3>Moderators</h3>
              <div className="moderators-list">
                {community.moderators.map((moderator) => (
                  <div key={moderator.id} className="moderator-item">
                    <img
                      src={moderator.avatar || "/placeholder.svg"}
                      alt={moderator.name}
                      className="moderator-avatar"
                    />
                    <span className="moderator-name">{moderator.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-section">
              <h3>Community Guidelines</h3>
              <ul className="guidelines-list">
                <li>Be respectful and considerate of other members.</li>
                <li>Stay on topic and post in the appropriate discussions.</li>
                <li>No spam, advertising, or self-promotion without permission.</li>
                <li>Respect copyright and intellectual property rights.</li>
                <li>Moderators have the final say on content appropriateness.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommunityDetail

