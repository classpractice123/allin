"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import VotingForm from "../components/VotingForm/VotingForm"
import VotingResult from "../components/VotingResult/VotingResult"
import "./Voting.css"

// Mock data
const votingData = {
  id: 101,
  title: "Best Fiction Book of the Month",
  description: "Vote for your favorite fiction book released this month!",
  startDate: "2023-05-01",
  endDate: "2023-06-30",
  status: "active",
  options: [
    {
      id: 1,
      title: "The Silent Echo",
      author: "Rebecca Chen",
      image: "https://source.unsplash.com/random/300x450?book,echo",
      description: "A haunting tale of loss and redemption.",
      votes: 42,
    },
    {
      id: 2,
      title: "Beyond the Horizon",
      author: "Michael Torres",
      image: "https://source.unsplash.com/random/300x450?book,horizon",
      description: "An epic adventure across uncharted territories.",
      votes: 38,
    },
    {
      id: 3,
      title: "Whispers in the Dark",
      author: "Sophia Williams",
      image: "https://source.unsplash.com/random/300x450?book,dark",
      description: "A psychological thriller that will keep you guessing.",
      votes: 27,
    },
    {
      id: 4,
      title: "The Last Summer",
      author: "David Johnson",
      image: "https://source.unsplash.com/random/300x450?book,summer",
      description: "A coming-of-age story set in a small coastal town.",
      votes: 19,
    },
  ],
}

const Voting = () => {
  const { id } = useParams()
  const [voting, setVoting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVoting(votingData)
      setLoading(false)
    }, 1000)
  }, [id])

  const handleVoteSubmit = (votingId, optionId) => {
    // In a real app, this would send the vote to the server
    console.log(`Voted for option ${optionId} in voting ${votingId}`)

    // Update local state to reflect the vote
    setVoting((prevVoting) => {
      const updatedOptions = prevVoting.options.map((option) => {
        if (option.id === optionId) {
          return { ...option, votes: option.votes + 1 }
        }
        return option
      })

      return { ...prevVoting, options: updatedOptions }
    })

    setHasVoted(true)
  }

  if (loading) {
    return (
      <div className="voting-page loading">
        <div className="loading-spinner"></div>
        <p>Loading voting information...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="voting-page error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    )
  }

  if (!voting) {
    return (
      <div className="voting-page not-found">
        <p>Voting not found.</p>
      </div>
    )
  }

  const totalVotes = voting.options.reduce((sum, option) => sum + option.votes, 0)

  return (
    <div className="voting-page">
      <div className="voting-header">
        <h1>{voting.title}</h1>
        <p>{voting.description}</p>
      </div>

      <div className="voting-dates">
        <div className="date-item">
          <span className="date-label">Start Date:</span>
          <span className="date-value">{new Date(voting.startDate).toLocaleDateString()}</span>
        </div>
        <div className="date-item">
          <span className="date-label">End Date:</span>
          <span className="date-value">{new Date(voting.endDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="voting-content">
        {!hasVoted ? (
          <VotingForm
            options={voting.options}
            competitionId={voting.id}
            onVoteSubmit={handleVoteSubmit}
            votingEnds={voting.endDate}
          />
        ) : (
          <div className="voting-thank-you">
            <h2>Thank You for Voting!</h2>
            <p>Your vote has been recorded. Check out the current results below.</p>
          </div>
        )}

        <VotingResult options={voting.options} totalVotes={totalVotes} />
      </div>
    </div>
  )
}

export default Voting

