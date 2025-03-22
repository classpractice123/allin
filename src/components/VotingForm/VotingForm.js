"use client"

import { useState } from "react"
import VotingOption from "../VotingOption/VotingOption"
import "./VotingForm.css"

const VotingForm = ({ options, competitionId, onVoteSubmit, votingEnds }) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Check if voting has ended
  const currentDate = new Date()
  const endDate = new Date(votingEnds)
  const votingEnded = currentDate > endDate

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId)
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (votingEnded) {
      setError("Voting has ended for this competition.")
      return
    }

    if (!selectedOption) {
      setError("Please select an option to vote.")
      return
    }

    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call the parent component's onVoteSubmit function
      onVoteSubmit(competitionId, selectedOption)

      setSuccess("Your vote has been submitted successfully!")
      setSelectedOption(null)
    } catch (err) {
      setError("Failed to submit your vote. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTimeRemaining = () => {
    if (votingEnded) return "Voting has ended"

    const timeRemaining = endDate - currentDate
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ${hours} hour${hours !== 1 ? "s" : ""} remaining`
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""} remaining`
    } else {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} remaining`
    }
  }

  return (
    <div className="voting-form">
      <div className="voting-form-header">
        <h2>Cast Your Vote</h2>
        <div className={`time-remaining ${votingEnded ? "ended" : ""}`}>{formatTimeRemaining()}</div>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="voting-options">
          {options.map((option) => (
            <VotingOption
              key={option.id}
              option={option}
              selected={selectedOption === option.id}
              onSelect={handleOptionSelect}
              disabled={votingEnded || isSubmitting}
            />
          ))}
        </div>

        <div className="voting-form-footer">
          <button type="submit" className="submit-vote-btn" disabled={votingEnded || isSubmitting || !selectedOption}>
            {isSubmitting ? "Submitting..." : "Submit Vote"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default VotingForm

