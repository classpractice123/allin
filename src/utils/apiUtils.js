/**
 * Utility functions for API calls, error handling, and retries
 */

// Configuration for API retries
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  factor: 2, // exponential backoff factor
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} - The result of the function
 */
export const retryWithBackoff = async (fn, options = {}) => {
  const { maxRetries, initialDelay, maxDelay, factor } = {
    ...RETRY_CONFIG,
    ...options,
  }

  let retries = 0
  let delay = initialDelay

  while (true) {
    try {
      return await fn()
    } catch (error) {
      // Don't retry if we've reached the max retries
      if (retries >= maxRetries) {
        throw error
      }

      // Don't retry for certain error types
      if (!isRetryable(error)) {
        throw error
      }

      // Increment retries and calculate next delay
      retries++
      delay = Math.min(delay * factor, maxDelay)

      // Log the retry attempt
      console.log(`Retry attempt ${retries} after ${delay}ms`)

      // Wait for the delay
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

/**
 * Check if an error is retryable
 * @param {Error} error - The error to check
 * @returns {boolean} - Whether the error is retryable
 */
const isRetryable = (error) => {
  // Don't retry for client errors (4xx) except for 429 (Too Many Requests)
  if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
    return false
  }

  // Don't retry for network errors that indicate no connectivity
  if (error.name === "TypeError" && error.message === "Network request failed") {
    return false
  }

  // Retry for server errors (5xx) and network issues
  return true
}

/**
 * Format error messages for display
 * @param {Error} error - The error to format
 * @returns {string} - Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return "An unknown error occurred"

  // Handle API error responses
  if (error.response && error.response.data) {
    const { data } = error.response
    if (data.message) return data.message
    if (data.error) return data.error
    if (typeof data === "string") return data
  }

  // Handle network errors
  if (error.message === "Network Error") {
    return "Unable to connect to the server. Please check your internet connection."
  }

  // Handle timeout errors
  if (error.code === "ECONNABORTED") {
    return "The request took too long to complete. Please try again."
  }

  // Handle other errors
  return error.message || "An unexpected error occurred"
}

/**
 * Create a debounced function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in milliseconds
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Create a throttled function
 * @param {Function} func - The function to throttle
 * @param {number} limit - The throttle limit in milliseconds
 * @returns {Function} - The throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

