/**
 * Utility functions for caching data
 */

// Cache configuration
const CACHE_CONFIG = {
  defaultTTL: 5 * 60 * 1000, // 5 minutes in milliseconds
  storagePrefix: "bookapp_cache_",
}

/**
 * In-memory cache for API responses
 */
const memoryCache = new Map()

/**
 * Get an item from the cache
 * @param {string} key - The cache key
 * @param {string} source - The cache source ('memory' or 'localStorage')
 * @returns {any|null} - The cached value or null if not found/expired
 */
export const getCachedItem = (key, source = "memory") => {
  const fullKey = `${CACHE_CONFIG.storagePrefix}${key}`

  try {
    if (source === "localStorage") {
      const cachedData = localStorage.getItem(fullKey)
      if (!cachedData) return null

      const { value, expiry } = JSON.parse(cachedData)
      if (expiry && expiry < Date.now()) {
        localStorage.removeItem(fullKey)
        return null
      }

      return value
    } else {
      // Memory cache
      const cachedData = memoryCache.get(fullKey)
      if (!cachedData) return null

      const { value, expiry } = cachedData
      if (expiry && expiry < Date.now()) {
        memoryCache.delete(fullKey)
        return null
      }

      return value
    }
  } catch (error) {
    console.error("Cache retrieval error:", error)
    return null
  }
}

/**
 * Set an item in the cache
 * @param {string} key - The cache key
 * @param {any} value - The value to cache
 * @param {number} ttl - Time to live in milliseconds
 * @param {string} source - The cache source ('memory' or 'localStorage')
 */
export const setCachedItem = (key, value, ttl = CACHE_CONFIG.defaultTTL, source = "memory") => {
  const fullKey = `${CACHE_CONFIG.storagePrefix}${key}`
  const expiry = ttl ? Date.now() + ttl : null

  try {
    if (source === "localStorage") {
      localStorage.setItem(
        fullKey,
        JSON.stringify({
          value,
          expiry,
        }),
      )
    } else {
      // Memory cache
      memoryCache.set(fullKey, {
        value,
        expiry,
      })
    }
  } catch (error) {
    console.error("Cache storage error:", error)
  }
}

/**
 * Remove an item from the cache
 * @param {string} key - The cache key
 * @param {string} source - The cache source ('memory' or 'localStorage')
 */
export const removeCachedItem = (key, source = "memory") => {
  const fullKey = `${CACHE_CONFIG.storagePrefix}${key}`

  try {
    if (source === "localStorage") {
      localStorage.removeItem(fullKey)
    } else {
      // Memory cache
      memoryCache.delete(fullKey)
    }
  } catch (error) {
    console.error("Cache removal error:", error)
  }
}

/**
 * Clear all cached items
 * @param {string} source - The cache source ('memory' or 'localStorage')
 */
export const clearCache = (source = "memory") => {
  try {
    if (source === "localStorage") {
      // Clear only our app's cache items
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(CACHE_CONFIG.storagePrefix)) {
          localStorage.removeItem(key)
        }
      })
    } else {
      // Memory cache
      memoryCache.clear()
    }
  } catch (error) {
    console.error("Cache clearing error:", error)
  }
}

/**
 * Cache API responses with a wrapper function
 * @param {Function} apiCall - The API call function to cache
 * @param {string} cacheKey - The cache key
 * @param {Object} options - Cache options
 * @returns {Promise} - The API response
 */
export const cacheApiResponse = async (apiCall, cacheKey, options = {}) => {
  const { ttl = CACHE_CONFIG.defaultTTL, source = "memory", forceRefresh = false } = options

  // Try to get from cache first (unless forceRefresh is true)
  if (!forceRefresh) {
    const cachedData = getCachedItem(cacheKey, source)
    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`)
      return cachedData
    }
  }

  // If not in cache or forceRefresh, make the API call
  console.log(`Cache miss for ${cacheKey}, fetching data...`)
  const data = await apiCall()

  // Store in cache
  setCachedItem(cacheKey, data, ttl, source)

  return data
}

