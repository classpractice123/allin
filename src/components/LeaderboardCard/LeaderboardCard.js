import { Link } from "react-router-dom"
import "./LeaderboardCard.css"

const LeaderboardCard = ({ user, rank, score, category }) => {
  const { id, name, avatar, badges } = user

  // Determine badge color based on rank
  const getBadgeColor = (rank) => {
    if (rank === 1) return "gold"
    if (rank === 2) return "silver"
    if (rank === 3) return "bronze"
    return ""
  }

  return (
    <div className={`leaderboard-card ${getBadgeColor(rank)}`}>
      <div className="leaderboard-rank">
        <span>{rank}</span>
      </div>

      <div className="leaderboard-user">
        <div className="user-avatar">
          <img src={avatar || "/placeholder.svg"} alt={name} />
        </div>
        <div className="user-info">
          <Link to={`/profile/${id}`} className="user-name">
            {name}
          </Link>

          {badges && badges.length > 0 && (
            <div className="user-badges">
              {badges.map((badge, index) => (
                <span key={index} className="badge" title={badge.name}>
                  {badge.icon}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="leaderboard-score">
        <div className="score-value">{score}</div>
        <div className="score-label">{category === "reading" ? "Books Read" : "Points"}</div>
      </div>
    </div>
  )
}

export default LeaderboardCard

