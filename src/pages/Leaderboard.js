"use client"

import { useState, useEffect } from "react"
import LeaderboardCard from "../components/LeaderboardCard/LeaderboardCard"
import "./Leaderboard.css"

// Mock data
const leaderboardData = {
  reading: [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://source.unsplash.com/random/100x100?portrait,woman",
      score: 87,
      badges: [
        { name: "Bookworm", icon: "📚" },
        { name: "Speed Reader", icon: "⚡" },
        { name: "Genre Explorer", icon: "🔍" },
      ],
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://source.unsplash.com/random/100x100?portrait,man",
      score: 76,
      badges: [
        { name: "Bookworm", icon: "📚" },
        { name: "Fiction Lover", icon: "📖" },
      ],
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://source.unsplash.com/random/100x100?portrait,woman,2",
      score: 68,
      badges: [{ name: "Consistent Reader", icon: "🔄" }],
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "https://source.unsplash.com/random/100x100?portrait,man,2",
      score: 62,
      badges: [{ name: "Non-Fiction Expert", icon: "🧠" }],
    },
    {
      id: 5,
      name: "Jessica Taylor",
      avatar: "https://source.unsplash.com/random/100x100?portrait,woman,3",
      score: 59,
      badges: [{ name: "Poetry Enthusiast", icon: "🎭" }],
    },
  ],
  writing: [
    {
      id: 6,
      name: "Robert Martinez",
      avatar: "https://source.unsplash.com/random/100x100?portrait,man,3",
      score: 1250,
      badges: [
        { name: "Prolific Writer", icon: "✍️" },
        { name: "Contest Winner", icon: "🏆" },
      ],
    },
    {
      id: 7,
      name: "Olivia Wilson",
      avatar: "https://source.unsplash.com/random/100x100?portrait,woman,4",
      score: 1120,
      badges: [
        { name: "Storyteller", icon: "📝" },
        { name: "Poet", icon: "🎭" },
      ],
    },
    {
      id: 8,
      name: "James Thompson",
      avatar: "https://source.unsplash.com/random/100x100?portrait,man,4",
      score: 980,
      badges: [{ name: "Consistent Writer", icon: "🔄" }],
    },
    {
      id: 9,
      name: "Sophia Lee",
      avatar: "https://source.unsplash.com/random/100x100?portrait,woman,5",
      score: 870,
      badges: [{ name: "Rising Star", icon: "⭐" }],
    },
    {
      id: 10,
      name: "Daniel Clark",
      avatar: "https://source.unsplash.com/random/100x100?portrait,man,5",
      score: 760,
      badges: [{ name: "Fiction Writer", icon: "📖" }],
    },
  ],
  participation: [
    {
      id: 11,
      name: "Emma Davis",
      avatar: "https://source.unsplash.com/random/100x100?portrait,woman,6",
      score: 2340,
      badges: [
        { name: "Community Leader", icon: "👑" },
        { name: "Helpful Member", icon: "🤝" },
      ],
    },
    {
      id: 12,
      name: "Noah Garcia",
      avatar: "https://source.unsplash.com/random/100x100?portrait,man,6",
      score: 2180,
      badges: [
        { name: "Discussion Starter", icon: "💬" },
        { name: "Book Club Host", icon: "🏠" },
      ],
    },
    {
      id: 13,
      name: "Ava Brown",
      avatar: "https://source.unsplash.com/random/100x100?portrait,woman,7",
      score: 1950,
      badges: [{ name: "Event Organizer", icon: "📅" }],
    },
    {
      id: 14,
      name: "William Jones",
      avatar: "https://source.unsplash.com/random/100x100?portrait,man,7",
      score: 1820,
      badges: [{ name: "Reviewer", icon: "⭐" }],
    },
    {
      id: 15,
      name: "Mia Miller",
      avatar: "https://source.unsplash.com/random/100x100?portrait,woman,8",
      score: 1680,
      badges: [{ name: "Forum Contributor", icon: "📣" }],
    },
  ],
}

const Leaderboard = () => {
  const [category, setCategory] = useState("reading")
  const [leaderboard, setLeaderboard] = useState([])
  const [timeframe, setTimeframe] = useState("all-time")

  useEffect(() => {
    // Simulate API call
    setLeaderboard(leaderboardData[category])
  }, [category])

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>Leaderboard</h1>
        <p>See who's leading in reading, writing, and community participation!</p>
      </div>

      <div className="leaderboard-filters">
        <div className="category-filter">
          <button
            className={`category-button ${category === "reading" ? "active" : ""}`}
            onClick={() => setCategory("reading")}
          >
            Reading
          </button>
          <button
            className={`category-button ${category === "writing" ? "active" : ""}`}
            onClick={() => setCategory("writing")}
          >
            Writing
          </button>
          <button
            className={`category-button ${category === "participation" ? "active" : ""}`}
            onClick={() => setCategory("participation")}
          >
            Participation
          </button>
        </div>

        <div className="timeframe-filter">
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="all-time">All Time</option>
            <option value="this-month">This Month</option>
            <option value="this-week">This Week</option>
          </select>
        </div>
      </div>

      <div className="leaderboard-content">
        <div className="leaderboard-description">
          {category === "reading" && <p>This leaderboard shows users who have read the most books.</p>}
          {category === "writing" && (
            <p>
              This leaderboard shows users with the highest writing scores based on submissions and contest results.
            </p>
          )}
          {category === "participation" && (
            <p>
              This leaderboard shows users who are most active in the community through discussions, events, and
              reviews.
            </p>
          )}
        </div>

        <div className="leaderboard-list">
          {leaderboard.map((user, index) => (
            <LeaderboardCard key={user.id} user={user} rank={index + 1} score={user.score} category={category} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard

