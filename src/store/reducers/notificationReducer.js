import { NOTIFICATION_ADD, NOTIFICATION_REMOVE, NOTIFICATION_CLEAR_ALL } from "../types"

// Generate a unique ID for each notification
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const initialState = {
  notifications: [],
}

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_ADD:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: generateId(),
            ...action.payload,
            timestamp: new Date().toISOString(),
          },
        ],
      }

    case NOTIFICATION_REMOVE:
      return {
        ...state,
        notifications: state.notifications.filter((notification) => notification.id !== action.payload),
      }

    case NOTIFICATION_CLEAR_ALL:
      return {
        ...state,
        notifications: [],
      }

    default:
      return state
  }
}

// Action creators
export const addNotification = (notification) => ({
  type: NOTIFICATION_ADD,
  payload: notification,
})

export const removeNotification = (id) => ({
  type: NOTIFICATION_REMOVE,
  payload: id,
})

export const clearAllNotifications = () => ({
  type: NOTIFICATION_CLEAR_ALL,
})

// Helper functions to create different types of notifications
export const notifySuccess = (message, options = {}) => {
  return addNotification({
    type: "success",
    message,
    autoClose: options.autoClose !== undefined ? options.autoClose : true,
    duration: options.duration || 5000, // Default 5 seconds
    ...options,
  })
}

export const notifyError = (message, options = {}) => {
  return addNotification({
    type: "error",
    message,
    autoClose: options.autoClose !== undefined ? options.autoClose : true,
    duration: options.duration || 7000, // Default 7 seconds
    ...options,
  })
}

export const notifyInfo = (message, options = {}) => {
  return addNotification({
    type: "info",
    message,
    autoClose: options.autoClose !== undefined ? options.autoClose : true,
    duration: options.duration || 5000, // Default 5 seconds
    ...options,
  })
}

export const notifyWarning = (message, options = {}) => {
  return addNotification({
    type: "warning",
    message,
    autoClose: options.autoClose !== undefined ? options.autoClose : true,
    duration: options.duration || 6000, // Default 6 seconds
    ...options,
  })
}

