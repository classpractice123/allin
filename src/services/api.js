// Base API URL - in a real app, this would be your backend API endpoint
import { retryWithBackoff, formatErrorMessage } from "../utils/apiUtils"
import { cacheApiResponse } from "../utils/cacheUtils"

const API_URL = "https://api.example.com"

// Helper function for handling API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    // Get error message from the response body
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`
    const error = new Error(errorMessage)
    error.status = response.status
    error.response = response
    throw error
  }
  return response.json()
}

// Generic fetch function with error handling and retries
const fetchData = async (endpoint, options = {}) => {
  const { skipRetry = false, ...fetchOptions } = options

  const fetchFn = async () => {
    try {
      const url = `${API_URL}${endpoint}`
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
      })
      return await handleResponse(response)
    } catch (error) {
      console.error(`API Error: ${formatErrorMessage(error)}`)
      throw error
    }
  }

  // Use retry mechanism unless explicitly skipped
  if (skipRetry) {
    return fetchFn()
  } else {
    return retryWithBackoff(fetchFn)
  }
}

// Auth API calls
export const authAPI = {
  login: (credentials) =>
    fetchData("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      skipRetry: true, // Don't retry auth requests
    }),

  register: (userData) =>
    fetchData("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
      skipRetry: true, // Don't retry auth requests
    }),

  resetPassword: (email) =>
    fetchData("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      skipRetry: true, // Don't retry auth requests
    }),

  getCurrentUser: () =>
    fetchData("/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
}

// Books API calls with caching
export const booksAPI = {
  getAllBooks: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const cacheKey = `books_${queryParams || "all"}`

    return cacheApiResponse(
      () => fetchData(`/books?${queryParams}`),
      cacheKey,
      { ttl: 5 * 60 * 1000 }, // 5 minutes cache
    )
  },

  getBookById: async (id) => {
    const cacheKey = `book_${id}`

    return cacheApiResponse(
      () => fetchData(`/books/${id}`),
      cacheKey,
      { ttl: 10 * 60 * 1000 }, // 10 minutes cache
    )
  },

  searchBooks: (query) => fetchData(`/books/search?q=${encodeURIComponent(query)}`),

  getBooksByGenre: async (genre) => {
    const cacheKey = `books_genre_${genre}`

    return cacheApiResponse(
      () => fetchData(`/books/genre/${encodeURIComponent(genre)}`),
      cacheKey,
      { ttl: 5 * 60 * 1000 }, // 5 minutes cache
    )
  },

  addBook: (bookData) =>
    fetchData("/books", {
      method: "POST",
      body: JSON.stringify(bookData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  updateBook: (id, bookData) =>
    fetchData(`/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  deleteBook: (id) =>
    fetchData(`/books/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
}

// Forums API calls with caching for read operations
export const forumsAPI = {
  getCategories: async () => {
    const cacheKey = "forum_categories"

    return cacheApiResponse(
      () => fetchData("/forums/categories"),
      cacheKey,
      { ttl: 30 * 60 * 1000 }, // 30 minutes cache
    )
  },

  getSubforums: async (categoryId) => {
    const cacheKey = `forum_subforums_${categoryId}`

    return cacheApiResponse(
      () => fetchData(`/forums/categories/${categoryId}/subforums`),
      cacheKey,
      { ttl: 15 * 60 * 1000 }, // 15 minutes cache
    )
  },

  getTopics: (subforumId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return fetchData(`/forums/subforums/${subforumId}/topics?${queryParams}`)
  },

  getRecentTopics: () => fetchData("/forums/topics/recent"),

  getTopic: (topicId) => fetchData(`/forums/topics/${topicId}`),

  createTopic: (subforumId, topicData) =>
    fetchData(`/forums/subforums/${subforumId}/topics`, {
      method: "POST",
      body: JSON.stringify(topicData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  createReply: (topicId, replyData) =>
    fetchData(`/forums/topics/${topicId}/replies`, {
      method: "POST",
      body: JSON.stringify(replyData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  likeReply: (replyId) =>
    fetchData(`/forums/replies/${replyId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  unlikeReply: (replyId) =>
    fetchData(`/forums/replies/${replyId}/unlike`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  bookmarkTopic: (topicId) =>
    fetchData(`/forums/topics/${topicId}/bookmark`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  unbookmarkTopic: (topicId) =>
    fetchData(`/forums/topics/${topicId}/unbookmark`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
}

// Communities API calls with caching for read operations
export const communitiesAPI = {
  getAllCommunities: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const cacheKey = `communities_${queryParams || "all"}`

    return cacheApiResponse(
      () => fetchData(`/communities?${queryParams}`),
      cacheKey,
      { ttl: 10 * 60 * 1000 }, // 10 minutes cache
    )
  },

  getCommunityById: async (id) => {
    const cacheKey = `community_${id}`

    return cacheApiResponse(
      () => fetchData(`/communities/${id}`),
      cacheKey,
      { ttl: 5 * 60 * 1000 }, // 5 minutes cache
    )
  },

  getJoinedCommunities: () =>
    fetchData("/communities/joined", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  joinCommunity: (communityId) =>
    fetchData(`/communities/${communityId}/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  leaveCommunity: (communityId) =>
    fetchData(`/communities/${communityId}/leave`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  createCommunity: (communityData) =>
    fetchData("/communities", {
      method: "POST",
      body: JSON.stringify(communityData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  getCommunityDiscussions: async (communityId) => {
    const cacheKey = `community_discussions_${communityId}`

    return cacheApiResponse(
      () => fetchData(`/communities/${communityId}/discussions`),
      cacheKey,
      { ttl: 5 * 60 * 1000 }, // 5 minutes cache
    )
  },

  getCommunityEvents: async (communityId) => {
    const cacheKey = `community_events_${communityId}`

    return cacheApiResponse(
      () => fetchData(`/communities/${communityId}/events`),
      cacheKey,
      { ttl: 5 * 60 * 1000 }, // 5 minutes cache
    )
  },

  getCommunityMembers: (communityId) => fetchData(`/communities/${communityId}/members`),

  createCommunityDiscussion: (communityId, discussionData) =>
    fetchData(`/communities/${communityId}/discussions`, {
      method: "POST",
      body: JSON.stringify(discussionData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  createCommunityEvent: (communityId, eventData) =>
    fetchData(`/communities/${communityId}/events`, {
      method: "POST",
      body: JSON.stringify(eventData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
}

// User API calls
export const usersAPI = {
  getUserProfile: (userId) => fetchData(`/users/${userId}`),

  updateUserProfile: (userData) =>
    fetchData("/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  getUserReadingHistory: () =>
    fetchData("/users/reading-history", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  getUserReviews: () =>
    fetchData("/users/reviews", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  getUserAchievements: () =>
    fetchData("/users/achievements", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
}

// Admin API calls
export const adminAPI = {
  getDashboardStats: () =>
    fetchData("/admin/stats", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  getAllUsers: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return fetchData(`/admin/users?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
  },

  updateUser: (userId, userData) =>
    fetchData(`/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  deleteUser: (userId) =>
    fetchData(`/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  getReportedContent: () =>
    fetchData("/admin/reported-content", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

  moderateContent: (contentId, action) =>
    fetchData(`/admin/moderate/${contentId}`, {
      method: "POST",
      body: JSON.stringify({ action }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
}

