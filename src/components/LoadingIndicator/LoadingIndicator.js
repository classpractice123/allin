import "./LoadingIndicator.css"

const LoadingIndicator = ({ size = "medium", text = "Loading...", fullPage = false }) => {
  const sizeClass = `spinner-${size}`

  if (fullPage) {
    return (
      <div className="loading-fullpage">
        <div className={`loading-spinner ${sizeClass}`}></div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    )
  }

  return (
    <div className="loading-container">
      <div className={`loading-spinner ${sizeClass}`}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  )
}

export default LoadingIndicator

