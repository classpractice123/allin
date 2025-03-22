"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./ForumTopic.css"

// Mock data for a forum topic
const topicData = {
  id: 1001,
  title: "What did you think of the ending of 'The Midnight Library'?",
  content:
    "I just finished reading 'The Midnight Library' by Matt Haig and I'm still processing the ending. Without giving away too many spoilers, I found the conclusion both satisfying and thought-provoking. I'd love to hear what others thought about it. Did you find the ending hopeful? Did it change your perspective on life choices?",
  author: {
    id: 101,
    name: "BookLover42",
    avatar: "https://source.unsplash.com/random/100x100?portrait",
    joinDate: "2022-03-15",
    posts: 87,
  },
  category: "Book Discussions",
  subforum: "Fiction",
  createdAt: "2023-05-10T09:30:00",
  views: 342,
  isBookmarked: false,
  replies: [
    {
      id: 2001,
      content:
        "I absolutely loved the ending! I think it struck the perfect balance between being uplifting without being too saccharine. The way Matt Haig explored the concept of regret and the infinite possibilities of our lives was really powerful. The ending made me reflect on my own life choices and appreciate the present more.",
      author: {
        id: 102,
        name: "ReadingAddict",
        avatar: "https://source.unsplash.com/random/100x100?portrait,2",
        joinDate: "2022-05-20",
        posts: 124,
      },
      createdAt: "2023-05-10T11:45:00",
      likes: 15,
      isLiked: false,
    },
    {
      id: 2002,
      content:
        "I had mixed feelings about the ending. While I appreciated the message about appreciating the life you have, I felt it was a bit predictable. I was hoping for a more complex resolution to Nora's journey. That said, I still think it's a fantastic book overall and the ending does fit with the overall theme.",
      author: {
        id: 103,
        name: "LiteraryExplorer",
        avatar: "https://source.unsplash.com/random/100x100?portrait,3",
        joinDate: "2022-01-10",
        posts: 256,
      },
      createdAt: "2023-05-11T14:20:00",
      likes: 8,
      isLiked: false,
    },
    {
      id: 2003,
      content:
        "The ending really resonated with me. I've struggled with depression in the past, and the way Haig portrayed Nora's journey to self-acceptance felt authentic. The ending wasn't about finding the perfect life, but about finding meaning in the life you have. It was hopeful without being unrealistic about the challenges of mental health.",
      author: {
        id: 104,
        name: "BookwormJane",
        avatar: "https://source.unsplash.com/random/100x100?portrait,4",
        joinDate: "2022-07-05",
        posts: 73,
      },
      createdAt: "2023-05-12T09:15:00",
      likes: 22,
      isLiked: true,
    },
    {
      id: 2004,
      content:
        "I think what made the ending work so well was how it tied back to the themes established throughout the book. The Midnight Library wasn't just about second chances, but about perspective. The ending challenges us to see our own lives differently, which I found really powerful. Has anyone read Haig's other books? I'm curious if they explore similar themes.",
      author: {
        id: 105,
        name: "ClassicReader",
        avatar: "https://source.unsplash.com/random/100x100?portrait,5",
        joinDate: "2022-02-18",
        posts: 142,
      },
      createdAt: "2023-05-13T16:30:00",
      likes: 11,
      isLiked: false,
    },
    {
      id: 2005,
      content:
        "I just finished the book yesterday and came here to see what others thought! I found the ending beautiful and moving. It made me think about how we often idealize other paths we could have taken without appreciating the unique value of the path we're on. I've been recommending this book to everyone I know.",
      author: {
        id: 106,
        name: "PageTurner",
        avatar: "https://source.unsplash.com/random/100x100?portrait,6",
        joinDate: "2022-09-30",
        posts: 51,
      },
      createdAt: "2023-05-15T14:32:00",
      likes: 7,
      isLiked: false,
    },
  ],
}

const ForumTopic = () => {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const [topic, setTopic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setTopic(topicData)
      setLoading(false)
    }, 1000)
  }, [id])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleReplySubmit = (e) => {
    e.preventDefault()

    if (!replyContent.trim()) {
      setError("Reply cannot be empty")
      return
    }

    setIsSubmitting(true)
    setError("")

    // In a real app, this would be an API call
    setTimeout(() => {
      const newReply = {
        id: Date.now(),
        content: replyContent,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          joinDate: currentUser.joinDate,
          posts: currentUser.reviewsWritten || 0,
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
      }

      setTopic({
        ...topic,
        replies: [...topic.replies, newReply],
      })

      setReplyContent("")
      setIsSubmitting(false)
    }, 1000)
  }

  const toggleLike = (replyId) => {
    if (!currentUser) return

    setTopic({
      ...topic,
      replies: topic.replies.map((reply) => {
        if (reply.id === replyId) {
          const newIsLiked = !reply.isLiked
          return {
            ...reply,
            likes: newIsLiked ? reply.likes + 1 : reply.likes - 1,
            isLiked: newIsLiked,
          }
        }
        return reply
      }),
    })
  }

  const toggleBookmark = () => {
    if (!currentUser) return

    setTopic({
      ...topic,
      isBookmarked: !topic.isBookmarked,
    })
  }

  if (loading) {
    return (
      <div className="forum-topic-page loading">
        <div className="loading-spinner"></div>
        <p>Loading topic...</p>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="forum-topic-page not-found">
        <h2>Topic Not Found</h2>
        <p>The topic you're looking for doesn't exist or has been removed.</p>
        <Link to="/forums" className="back-to-forums">
          Back to Forums
        </Link>
      </div>
    )
  }

  return (
    <div className="forum-topic-page">
      <div className="topic-breadcrumbs">
        <Link to="/forums">Forums</Link> &gt; <Link to={`/forums/category/${topic.category}`}>{topic.category}</Link>{" "}
        &gt; <Link to={`/forums/subforum/${topic.subforum}`}>{topic.subforum}</Link> &gt;{" "}
        <span className="current-topic">{topic.title}</span>
      </div>

      <div className="topic-header">
        <h1>{topic.title}</h1>
        <div className="topic-meta">
          <span className="topic-date">Posted on {formatDate(topic.createdAt)}</span>
          <span className="topic-views">{topic.views} views</span>
          <span className="topic-replies">{topic.replies.length} replies</span>
        </div>
      </div>

      <div className="topic-actions">
        {currentUser && (
          <button className={`bookmark-button ${topic.isBookmarked ? "bookmarked" : ""}`} onClick={toggleBookmark}>
            {topic.isBookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        )}
        <Link to="/forums/new-topic" className="new-topic-btn">
          New Topic
        </Link>
      </div>

      <div className="topic-content">
        <div className="post-container original-post">
          <div className="post-sidebar">
            <div className="author-avatar">
              <img src={topic.author.avatar || "/placeholder.svg"} alt={topic.author.name} />
            </div>
            <div className="author-info">
              <div className="author-name">{topic.author.name}</div>
              <div className="author-stats">
                <div className="join-date">Joined: {new Date(topic.author.joinDate).toLocaleDateString()}</div>
                <div className="post-count">Posts: {topic.author.posts}</div>
              </div>
            </div>
          </div>
          <div className="post-content">
            <div className="post-text">{topic.content}</div>
            <div className="post-footer">
              <div className="post-date">{formatDate(topic.createdAt)}</div>
            </div>
          </div>
        </div>

        {topic.replies.length > 0 && (
          <div className="replies-header">
            <h2>Replies</h2>
          </div>
        )}

        <div className="replies-container">
          {topic.replies.map((reply) => (
            <div key={reply.id} className="post-container reply">
              <div className="post-sidebar">
                <div className="author-avatar">
                  <img src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
                </div>
                <div className="author-info">
                  <div className="author-name">{reply.author.name}</div>
                  <div className="author-stats">
                    <div className="join-date">Joined: {new Date(reply.author.joinDate).toLocaleDateString()}</div>
                    <div className="post-count">Posts: {reply.author.posts}</div>
                  </div>
                </div>
              </div>
              <div className="post-content">
                <div className="post-text">{reply.content}</div>
                <div className="post-footer">
                  <div className="post-date">{formatDate(reply.createdAt)}</div>
                  <div className="post-actions">
                    <button
                      className={`like-button ${reply.isLiked ? "liked" : ""}`}
                      onClick={() => toggleLike(reply.id)}
                      disabled={!currentUser}
                    >
                      {reply.likes} {reply.likes === 1 ? "Like" : "Likes"}
                    </button>
                    {currentUser && <button className="quote-button">Quote</button>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentUser ? (
          <div className="reply-form-container">
            <h3>Post a Reply</h3>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleReplySubmit}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply here..."
                rows={6}
                disabled={isSubmitting}
              ></textarea>
              <div className="form-actions">
                <button type="submit" className="submit-reply" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Reply"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="login-to-reply">
            <p>You need to be logged in to reply to this topic.</p>
            <Link to="/login" className="login-button">
              Log In
            </Link>
            <Link to="/register" className="register-button">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForumTopic

