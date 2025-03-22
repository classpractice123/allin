"use client"

import { createContext, useContext, useReducer } from "react"
import {
  notificationReducer,
  initialState,
  addNotification,
  removeNotification,
  clearAllNotifications,
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarning,
} from "../store/reducers/notificationReducer"

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  // Action dispatchers
  const addNotificationAction = (notification) => {
    dispatch(addNotification(notification))
  }

  const removeNotificationAction = (id) => {
    dispatch(removeNotification(id))
  }

  const clearAllNotificationsAction = () => {
    dispatch(clearAllNotifications())
  }

  // Helper functions
  const success = (message, options = {}) => {
    dispatch(notifySuccess(message, options))
  }

  const error = (message, options = {}) => {
    dispatch(notifyError(message, options))
  }

  const info = (message, options = {}) => {
    dispatch(notifyInfo(message, options))
  }

  const warning = (message, options = {}) => {
    dispatch(notifyWarning(message, options))
  }

  const value = {
    notifications: state.notifications,
    addNotification: addNotificationAction,
    removeNotification: removeNotificationAction,
    clearAllNotifications: clearAllNotificationsAction,
    success,
    error,
    info,
    warning,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

