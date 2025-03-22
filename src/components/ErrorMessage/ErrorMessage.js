"use client"
import "./ErrorMessage.css"

const ErrorMessage = ({ error, onRetry = null, retryText = "Try Again", showDetails = false }) => {
  // Format the error message
  const errorMessage = typeof error === "string" ? error : error?.message || "An unexpected error occurred"

  return (
    <div className="error-message-container">
      <div className="error-message-icon">⚠️</div>
      <div className="error-message-content">
        <p className="error-message-text">{errorMessage}</p>

        {onRetry && (
          <button className="error-retry-btn" onClick={onRetry}>
            {retryText}
          </button>
        )}

        {showDetails && error?.stack && (
          <details className="error-details">
            <summary>Error Details</summary>
            <pre>{error.stack}</pre>
          </details>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage

