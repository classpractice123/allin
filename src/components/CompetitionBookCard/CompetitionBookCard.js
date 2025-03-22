import { Link } from "react-router-dom"
import "./CompetitionBookCard.css"

const CompetitionBookCard = ({ book, competitionId }) => {
  const { id, title, author, coverImage, description, votes, isWinner } = book

  return (
    <div className={`competition-book-card ${isWinner ? "winner" : ""}`}>
      {isWinner && <div className="winner-badge">Winner</div>}

      <div className="competition-book-image">
        <img src={coverImage || "/placeholder.svg"} alt={title} />
      </div>

      <div className="competition-book-content">
        <h3 className="book-title">{title}</h3>
        <p className="book-author">by {author}</p>

        {description && <p className="book-description">{description}</p>}

        {votes !== undefined && (
          <div className="book-votes">
            <span className="votes-count">{votes} votes</span>
          </div>
        )}

        <div className="competition-book-actions">
          <Link to={`/book/${id}`} className="view-book-btn">
            View Book
          </Link>
          <Link to={`/competitions/${competitionId}/vote`} className="vote-btn">
            Vote
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CompetitionBookCard

