"use client"

import { createContext, useState, useContext } from "react"
import { forumsAPI } from "../services/api"

const ForumContext = createContext()

export const useForums = () => {
  const context = useContext(ForumContext)
  if (!context) {
    throw new Error("useForums must be used within a ForumProvider")
  }
  return context
}

export const ForumProvider = ({ children }) => {
  const [categories, setCategories] = useState([])
  const [subforums, setSubforums] = useState([])
  const [topics, setTopics] = useState([])
  const [currentTopic, setCurrentTopic] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all forum categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await forumsAPI.getCategories()
      setCategories(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch subforums for a category
  const fetchSubforums = async (categoryId) => {
    try {
      setLoading(true)
      const data = await forumsAPI.getSubforums(categoryId)
      setSubforums(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch topics for a subforum
  const fetchTopics = async (subforumId, params = {}) => {
    try {
      setLoading(true)
      const data = await forumsAPI.getTopics(subforumId, params)
      setTopics(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch recent topics across all forums
  const fetchRecentTopics = async () => {
    try {
      setLoading(true)
      const data = await forumsAPI.getRecentTopics()
      setTopics(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch a single topic with its replies
  const fetchTopic = async (topicId) => {
    try {
      setLoading(true)
      const data = await forumsAPI.getTopic(topicId)
      setCurrentTopic(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Create a new topic
  const createTopic = async (subforumId, topicData) => {
    try {
      setLoading(true)
      const data = await forumsAPI.createTopic(subforumId, topicData)
      setTopics([data, ...topics])
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Create a reply to a topic
  const createReply = async (topicId, replyData) => {
    try {
      setLoading(true)
      const data = await forumsAPI.createReply(topicId, replyData)

      // Update the current topic with the new reply if we're viewing it
      if (currentTopic && currentTopic.id === topicId) {
        setCurrentTopic({
          ...currentTopic,
          replies: [...currentTopic.replies, data],
        })
      }

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Like a reply
  const likeReply = async (replyId) => {
    try {
      await forumsAPI.likeReply(replyId)

      // Update the current topic if we're viewing it
      if (currentTopic) {
        setCurrentTopic({
          ...currentTopic,
          replies: currentTopic.replies.map((reply) =>
            reply.id === replyId ? { ...reply, likes: reply.likes + 1, isLiked: true } : reply,
          ),
        })
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Unlike a reply
  const unlikeReply = async (replyId) => {
    try {
      await forumsAPI.unlikeReply(replyId)

      // Update the current topic if we're viewing it
      if (currentTopic) {
        setCurrentTopic({
          ...currentTopic,
          replies: currentTopic.replies.map((reply) =>
            reply.id === replyId ? { ...reply, likes: reply.likes - 1, isLiked: false } : reply,
          ),
        })
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Bookmark a topic
  const bookmarkTopic = async (topicId) => {
    try {
      await forumsAPI.bookmarkTopic(topicId)

      // Update the current topic if we're viewing it
      if (currentTopic && currentTopic.id === topicId) {
        setCurrentTopic({
          ...currentTopic,
          isBookmarked: true,
        })
      }

      // Update the topics list if the topic is in it
      setTopics(topics.map((topic) => (topic.id === topicId ? { ...topic, isBookmarked: true } : topic)))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Unbookmark a topic
  const unbookmarkTopic = async (topicId) => {
    try {
      await forumsAPI.unbookmarkTopic(topicId)

      // Update the current topic if we're viewing it
      if (currentTopic && currentTopic.id === topicId) {
        setCurrentTopic({
          ...currentTopic,
          isBookmarked: false,
        })
      }

      // Update the topics list if the topic is in it
      setTopics(topics.map((topic) => (topic.id === topicId ? { ...topic, isBookmarked: false } : topic)))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const value = {
    categories,
    subforums,
    topics,
    currentTopic,
    loading,
    error,
    fetchCategories,
    fetchSubforums,
    fetchTopics,
    fetchRecentTopics,
    fetchTopic,
    createTopic,
    createReply,
    likeReply,
    unlikeReply,
    bookmarkTopic,
    unbookmarkTopic,
  }

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>
}

