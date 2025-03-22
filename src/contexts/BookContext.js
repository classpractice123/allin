"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { booksAPI } from "../services/api"

const BookContext = createContext()

export const useBooks = () => {
  const context = useContext(BookContext)
  if (!context) {
    throw new Error("useBooks must be used within a BookProvider")
  }
  return context
}

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([])
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all books
  const fetchBooks = async (params = {}) => {
    try {
      setLoading(true)
      const data = await booksAPI.getAllBooks(params)
      setBooks(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch a single book by ID
  const fetchBookById = async (id) => {
    try {
      setLoading(true)
      const data = await booksAPI.getBookById(id)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Search books
  const searchBooks = async (query) => {
    try {
      setLoading(true)
      const data = await booksAPI.searchBooks(query)
      setBooks(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch books by genre
  const fetchBooksByGenre = async (genre) => {
    try {
      setLoading(true)
      const data = await booksAPI.getBooksByGenre(genre)
      setBooks(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Add a new book (admin only)
  const addBook = async (bookData) => {
    try {
      setLoading(true)
      const data = await booksAPI.addBook(bookData)
      setBooks([...books, data])
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update a book (admin only)
  const updateBook = async (id, bookData) => {
    try {
      setLoading(true)
      const data = await booksAPI.updateBook(id, bookData)
      setBooks(books.map((book) => (book.id === id ? data : book)))
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete a book (admin only)
  const deleteBook = async (id) => {
    try {
      setLoading(true)
      await booksAPI.deleteBook(id)
      setBooks(books.filter((book) => book.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch featured books for homepage
  const fetchFeaturedBooks = async () => {
    try {
      setLoading(true)
      const data = await booksAPI.getAllBooks({ featured: true, limit: 4 })
      setFeaturedBooks(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Load featured books on initial render
  useEffect(() => {
    fetchFeaturedBooks().catch((err) => console.error("Failed to fetch featured books:", err))
  }, [])

  const value = {
    books,
    featuredBooks,
    loading,
    error,
    fetchBooks,
    fetchBookById,
    searchBooks,
    fetchBooksByGenre,
    addBook,
    updateBook,
    deleteBook,
    fetchFeaturedBooks,
  }

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>
}

