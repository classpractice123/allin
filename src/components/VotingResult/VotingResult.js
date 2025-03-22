import "./VotingResult.css"

const VotingResult = ({ options, totalVotes }) => {
  // Sort options by votes (descending)
  const sortedOptions = [...options].sort((a, b) => b.votes - a.votes)

  // Find the winner (option with the most votes)
  const winner = sortedOptions[0]

  return (
    <div className="voting-result">
      <div className="voting-result-header">
        <h2>Voting Results</h2>
        <div className="total-votes">{totalVotes} total votes</div>
      </div>

      {winner && (
        <div className="winner-section">
          <div className="winner-label">Winner</div>
          <div className="winner-card">
            <div className="winner-image">
              <img src={winner.image || "/placeholder.svg"} alt={winner.title} />
            </div>
            <div className="winner-info">
              <h3>{winner.title}</h3>
              {winner.author && <p className="winner-author">by {winner.author}</p>}
              <div className="winner-votes">
                <span className="votes-count">{winner.votes} votes</span>
                <span className="votes-percentage">
                  ({totalVotes > 0 ? Math.round((winner.votes / totalVotes) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="results-list">
        <h3>All Results</h3>

        {sortedOptions.map((option, index) => (
          <div key={option.id} className="result-item">
            <div className="result-rank">{index + 1}</div>
            <div className="result-image">
              <img src={option.image || "/placeholder.svg"} alt={option.title} />
            </div>
            <div className="result-info">
              <h4>{option.title}</h4>
              {option.author && <p className="result-author">by {option.author}</p>}
            </div>
            <div className="result-votes">
              <div className="votes-bar-container">
                <div
                  className="votes-bar"
                  style={{ width: `${totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="votes-text">
                <span className="votes-count">{option.votes}</span>
                <span className="votes-percentage">
                  ({totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VotingResult

