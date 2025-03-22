"use client"

import { useEffect, useState } from "react"
import "./Notification.css"

const Notification = ({ id, type = "info", message, autoClose = true, duration = 5000, onClose }) => {
  const [isClosing, setIsClosing] = useState(false)
  const [progress, setProgress] = useState(100)
  const [intervalId, setIntervalId] = useState(null)

  // Handle auto-close with progress bar
  useEffect(() => {
    if (autoClose) {
      // Set up progress bar
      const startTime = Date.now()
      const endTime = startTime + duration

      const id = setInterval(() => {
        const now = Date.now()
        const remaining = endTime - now
        const newProgress = (remaining / duration) * 100

        if (remaining <= 0) {
          handleClose()
        } else {
          setProgress(newProgress)
        }
      }, 50)

      setIntervalId(id)

      return () => {
        clearInterval(id)
      }
    }
  }, [autoClose, duration])

  const handleClose = () => {
    if (intervalId) {
      clearInterval(intervalId)
    }

    setIsClosing(true)

    // Wait for the closing animation to finish
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  return (
    <div className={`notification notification-${type} ${isClosing ? "closing" : ""}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {type === "success" && "✓"}
          {type === "error" && "✕"}
          {type === "warning" && "⚠"}
          {type === "info" && "ℹ"}
        </div>
        <div className="notification-message">{message}</div>
        <button className="notification-close" onClick={handleClose}>
          ×
        </button>
      </div>

      {autoClose && <div className="notification-progress" style={{ width: `${progress}%` }}></div>}
    </div>
  )
}

export default Notification

