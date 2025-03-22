"use client"
import "./VotingOption.css"

const VotingOption = ({ option, selected, onSelect, disabled }) => {
  return (
    <div
      className={`voting-option ${selected ? "selected" : ""} ${disabled ? "disabled" : ""}`}
      onClick={() => !disabled && onSelect(option.id)}
    >
      <div className="voting-option-image">
        <img src={option.image || "/placeholder.svg"} alt={option.title} />
      </div>
      <div className="voting-option-content">
        <h3>{option.title}</h3>
        {option.author && <p className="option-author">by {option.author}</p>}
        {option.description && <p className="option-description">{option.description}</p>}
      </div>
      <div className="voting-option-select">
        <div className="select-indicator"></div>
      </div>
    </div>
  )
}

export default VotingOption

