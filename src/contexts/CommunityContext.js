"use client"

import { createContext, useState, useContext } from "react"
import { communitiesAPI } from "../services/api"

const CommunityContext = createContext()

export const useCommunities = () => {
  const context = useContext(CommunityContext)
  if (!context) {
    throw new Error("useCommunities must be used within a CommunityProvider")
  }
  return context
}

export const CommunityProvider = ({ children }) => {
  const [communities, setCommunities] = useState([])
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [currentCommunity, setCurrentCommunity] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all communities
  const fetchCommunities = async (params = {}) => {
    try {
      setLoading(true)
      const data = await communitiesAPI.getAllCommunities(params)
      setCommunities(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch a single community by ID
  const fetchCommunityById = async (id) => {
    try {
      setLoading(true)
      const data = await communitiesAPI.getCommunityById(id)
      setCurrentCommunity(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch communities the user has joined
  const fetchJoinedCommunities = async () => {
    try {
      setLoading(true)
      const data = await communitiesAPI.getJoinedCommunities()
      setJoinedCommunities(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Join a community
  const joinCommunity = async (communityId) => {
    try {
      await communitiesAPI.joinCommunity(communityId)

      // Update the current community if we're viewing it
      if (currentCommunity && currentCommunity.id === communityId) {
        setCurrentCommunity({
          ...currentCommunity,
          isJoined: true,
          members: currentCommunity.members + 1,
        })
      }

      // Update the communities list
      setCommunities(
        communities.map((community) =>
          community.id === communityId ? { ...community, isJoined: true, members: community.members + 1 } : community,
        ),
      )

      // Update joined communities list
      const joinedCommunity = communities.find((c) => c.id === communityId)
      if (joinedCommunity) {
        setJoinedCommunities([...joinedCommunities, { ...joinedCommunity, isJoined: true }])
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Leave a community
  const leaveCommunity = async (communityId) => {
    try {
      await communitiesAPI.leaveCommunity(communityId)

      // Update the current community if we're viewing it
      if (currentCommunity && currentCommunity.id === communityId) {
        setCurrentCommunity({
          ...currentCommunity,
          isJoined: false,
          members: currentCommunity.members - 1,
        })
      }

      // Update the communities list
      setCommunities(
        communities.map((community) =>
          community.id === communityId ? { ...community, isJoined: false, members: community.members - 1 } : community,
        ),
      )

      // Update joined communities list
      setJoinedCommunities(joinedCommunities.filter((c) => c.id !== communityId))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Create a new community
  const createCommunity = async (communityData) => {
    try {
      setLoading(true)
      const data = await communitiesAPI.createCommunity(communityData)
      setCommunities([data, ...communities])
      setJoinedCommunities([data, ...joinedCommunities])
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch discussions for a community
  const fetchCommunityDiscussions = async (communityId) => {
    try {
      setLoading(true)
      const data = await communitiesAPI.getCommunityDiscussions(communityId)

      // Update the current community if we're viewing it
      if (currentCommunity && currentCommunity.id === communityId) {
        setCurrentCommunity({
          ...currentCommunity,
          discussions: data,
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

  // Fetch events for a community
  const fetchCommunityEvents = async (communityId) => {
    try {
      setLoading(true)
      const data = await communitiesAPI.getCommunityEvents(communityId)

      // Update the current community if we're viewing it
      if (currentCommunity && currentCommunity.id === communityId) {
        setCurrentCommunity({
          ...currentCommunity,
          events: data,
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

  // Fetch members for a community
  const fetchCommunityMembers = async (communityId) => {
    try {
      setLoading(true)
      const data = await communitiesAPI.getCommunityMembers(communityId)

      // Update the current community if we're viewing it
      if (currentCommunity && currentCommunity.id === communityId) {
        setCurrentCommunity({
          ...currentCommunity,
          members: data.length,
          membersList: data,
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

  // Create a discussion in a community
  const createCommunityDiscussion = async (communityId, discussionData) => {
    try {
      setLoading(true)
      const data = await communitiesAPI.createCommunityDiscussion(communityId, discussionData)

      // Update the current community if we're viewing it
      if (currentCommunity && currentCommunity.id === communityId && currentCommunity.discussions) {
        setCurrentCommunity({
          ...currentCommunity,
          discussions: [data, ...currentCommunity.discussions],
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

  // Create an event in a community
  const createCommunityEvent = async (communityId, eventData) => {
    try {
      setLoading(true)
      const data = await communitiesAPI.createCommunityEvent(communityId, eventData)

      // Update the current community if we're viewing it
      if (currentCommunity && currentCommunity.id === communityId && currentCommunity.events) {
        setCurrentCommunity({
          ...currentCommunity,
          events: [data, ...currentCommunity.events],
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

  const value = {
    communities,
    joinedCommunities,
    currentCommunity,
    loading,
    error,
    fetchCommunities,
    fetchCommunityById,
    fetchJoinedCommunities,
    joinCommunity,
    leaveCommunity,
    createCommunity,
    fetchCommunityDiscussions,
    fetchCommunityEvents,
    fetchCommunityMembers,
    createCommunityDiscussion,
    createCommunityEvent,
  }

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>
}

