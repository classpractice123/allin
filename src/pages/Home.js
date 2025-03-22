"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useBooks } from "../contexts/BookContext"
import BookCard from "../components/BookCard/BookCard"
import "./Home.css"

// Mock data for competitions - we'll replace this later
const upcomingCompetitions = [
  {
    id: 1,
    title: "Summer Reading Challenge",
    description: "Read 10 books this summer and win exciting prizes!",
    startDate: "June 1, 2023",
    endDate: "August 31, 2023",
    image: "https://source.unsplash.com/random/600x400?summer,reading",
  },
  {
    id: 2,
    title: "Poetry Writing Contest",
    description: "Submit your original poems and get a chance to be published!",
    startDate: "July 15, 2023",
    endDate: "September 15, 2023",
    image: "https://source.unsplash.com/random/600x400?poetry,writing",
  },
]

const Home = () => {
  const { featuredBooks, loading, error, fetchFeaturedBooks } = useBooks()

  useEffect(() => {
    // Fetch featured books when component mounts
    fetchFeaturedBooks().catch((err) => console.error("Failed to fetch featured books:", err))
  }, [fetchFeaturedBooks])

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Your Next Favorite Book</h1>
          <p>Join our community of book lovers, readers, and writers.</p>
          <div className="hero-buttons">
            <Link to="/bookstore" className="btn primary-btn">
              Explore Books
            </Link>
            <Link to="/communities" className="btn secondary-btn">
              Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="section">
        <div className="section-header">
          <h2>Featured Books</h2>
          <Link to="/bookstore" className="view-all-link">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading featured books...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Error loading featured books: {error}</p>
            <button onClick={fetchFeaturedBooks} className="retry-button">
              Try Again
            </button>
          </div>
        ) : (
          <div className="books-grid">
            {featuredBooks.length > 0 ? (
              featuredBooks.map((book) => (
                <div key={book.id} className="book-item">
                  <BookCard book={book} />
                </div>
              ))
            ) : (
              <p className="no-books">No featured books available at the moment.</p>
            )}
          </div>
        )}
      </section>

      {/* Competitions Section */}
      <section className="section">
        <div className="section-header">
          <h2>Upcoming Competitions</h2>
          <Link to="/competitions" className="view-all-link">
            View All
          </Link>
        </div>
        <div className="competitions-grid">
          {upcomingCompetitions.map((competition) => (
            <div key={competition.id} className="competition-card">
              <div className="competition-image">
                <img src={competition.image || "/placeholder.svg"} alt={competition.title} />
              </div>
              <div className="competition-content">
                <h3>{competition.title}</h3>
                <p>{competition.description}</p>
                <div className="competition-dates">
                  <span>{competition.startDate}</span> - <span>{competition.endDate}</span>
                </div>
                <Link to={`/competitions/${competition.id}`} className="btn primary-btn">
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="community-section">
        <div className="community-content">
          <h2>Join Our Book Community</h2>
          <p>
            Connect with fellow readers, participate in discussions, share your thoughts, and discover new perspectives.
          </p>
          <div className="community-features">
            <div className="feature">
              <div className="feature-icon">📚</div>
              <h3>Book Clubs</h3>
              <p>Join virtual book clubs based on your favorite genres.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💬</div>
              <h3>Forums</h3>
              <p>Engage in discussions about books, authors, and literary topics.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🏆</div>
              <h3>Competitions</h3>
              <p>Participate in reading challenges and writing contests.</p>
            </div>
          </div>
          <Link to="/communities" className="btn primary-btn">
            Explore Communities
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Stay updated with the latest books, events, and community activities.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" required />
            <button type="submit" className="btn primary-btn">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Home

