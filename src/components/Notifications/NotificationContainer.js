"use client"
import { useNotifications } from "../../contexts/NotificationContext"
import Notification from "./Notification"
import "./NotificationContainer.css"

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={notification.message}
          autoClose={notification.autoClose}
          duration={notification.duration}
          onClose={removeNotification}
        />
      ))}
    </div>
  )
}

export default NotificationContainer

