"use client"

import React from "react"
import "./ErrorBoundary.css"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
    this.setState({ errorInfo })

    // You could also log to a monitoring service like Sentry here
    // if (window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = "/"
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h1>Something went wrong</h1>
            <p className="error-message">{this.state.error && this.state.error.toString()}</p>
            <div className="error-actions">
              <button onClick={this.handleReload} className="reload-btn">
                Reload Page
              </button>
              <button onClick={this.handleGoHome} className="home-btn">
                Go to Homepage
              </button>
            </div>
            {this.props.showDetails && this.state.errorInfo && (
              <details className="error-details">
                <summary>Error Details</summary>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

