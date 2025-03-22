"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import CompetitionBookCard from "../components/CompetitionBookCard/CompetitionBookCard"
import "./Competitions.css"

// Mock data
const competitionsData = [
  {
    id: 1,
    title: "Summer Reading Challenge",
    description: "Read 10 books this summer and win exciting prizes!",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    status: "active",
    type: "reading",
    image: "https://source.unsplash.com/random/600x400?summer,reading",
    participants: 245,
    books: [],
  },
  {
    id: 2,
    title: "Poetry Writing Contest",
    description: "Submit your original poems and get a chance to be published!",
    startDate: "2023-07-15",
    endDate: "2023-09-15",
    status: "active",
    type: "writing",
    image: "https://source.unsplash.com/random/600x400?poetry,writing",
    participants: 128,
    books: [],
  },
  {
    id: 3,
    title: "Best Fiction of 2023",
    description: "Vote for your favorite fiction book published this year.",
    startDate: "2023-05-01",
    endDate: "2023-06-30",
    status: "completed",
    type: "voting",
    image: "https://source.unsplash.com/random/600x400?books,fiction",
    participants: 512,
    books: [
      {
        id: 101,
        title: "The Last Horizon",
        author: "Emily Chen",
        coverImage: "https://source.unsplash.com/random/300x450?book,horizon",
        description: "A thrilling journey through space and time.",
        votes: 187,
        isWinner: true,
      },
      {
        id: 102,
        title: "Whispers in the Dark",
        author: "James Peterson",
        coverImage: "https://source.unsplash.com/random/300x450?book,dark",
        description: "A mystery that will keep you on the edge of your seat.",
        votes: 154,
        isWinner: false,
      },
      {
        id: 103,
        title: "The Garden of Memories",
        author: "Sophia Williams",
        coverImage: "https://source.unsplash.com/random/300x450?book,garden",
        description: "A touching story about family, love, and redemption.",
        votes: 128,
        isWinner: false,
      },
    ],
  },
  {
    id: 4,
    title: "Young Adult Book Club",
    description: "Join our YA book club and discuss the latest releases.",
    startDate: "2023-08-01",
    endDate: "2023-10-31",
    status: "upcoming",
    type: "reading",
    image: "https://source.unsplash.com/random/600x400?young,adult",
    participants: 0,
    books: [],
  },
]

const Competitions = () => {
  const [competitions, setCompetitions] = useState([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // Simulate API call
    setCompetitions(competitionsData)
  }, [])

  const filteredCompetitions = competitions.filter((competition) => {
    if (filter === "all") return true
    return competition.status === filter
  })

  return (
    <div className="competitions-page">
      <div className="competitions-header">
        <h1>Competitions</h1>
        <p>Participate in reading challenges, writing contests, and book voting!</p>
      </div>

      <div className="competitions-filters">
        <button className={`filter-button ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          All
        </button>
        <button className={`filter-button ${filter === "active" ? "active" : ""}`} onClick={() => setFilter("active")}>
          Active
        </button>
        <button
          className={`filter-button ${filter === "upcoming" ? "active" : ""}`}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`filter-button ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="competitions-list">
        {filteredCompetitions.length > 0 ? (
          filteredCompetitions.map((competition) => (
            <div key={competition.id} className="competition-item">
              <div className="competition-card">
                <div className="competition-image">
                  <img src={competition.image || "/placeholder.svg"} alt={competition.title} />
                  <div className={`competition-status ${competition.status}`}>
                    {competition.status.charAt(0).toUpperCase() + competition.status.slice(1)}
                  </div>
                </div>

                <div className="competition-content">
                  <h2>{competition.title}</h2>
                  <p className="competition-description">{competition.description}</p>

                  <div className="competition-details">
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">
                        {competition.type.charAt(0).toUpperCase() + competition.type.slice(1)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Dates:</span>
                      <span className="detail-value">
                        {new Date(competition.startDate).toLocaleDateString()} -{" "}
                        {new Date(competition.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Participants:</span>
                      <span className="detail-value">{competition.participants}</span>
                    </div>
                  </div>

                  <div className="competition-actions">
                    <Link to={`/competitions/${competition.id}`} className="view-details-btn">
                      View Details
                    </Link>

                    {competition.status === "active" && (
                      <Link to={`/competitions/${competition.id}/participate`} className="participate-btn">
                        {competition.type === "voting" ? "Vote Now" : "Participate"}
                      </Link>
                    )}

                    {competition.status === "completed" && competition.type === "voting" && (
                      <Link to={`/competitions/${competition.id}/results`} className="results-btn">
                        View Results
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {competition.status === "completed" && competition.type === "voting" && competition.books.length > 0 && (
                <div className="competition-results-preview">
                  <h3>Results</h3>
                  <div className="results-books">
                    {competition.books.map((book) => (
                      <div key={book.id} className="result-book-item">
                        <CompetitionBookCard book={book} competitionId={competition.id} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-competitions">
            <p>No competitions found matching your filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Competitions

