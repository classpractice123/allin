"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useBooks } from "../contexts/BookContext"
import BookCard from "../components/BookCard/BookCard"
import LoadingIndicator from "../components/LoadingIndicator/LoadingIndicator"
import ErrorMessage from "../components/ErrorMessage/ErrorMessage"
import { debounce } from "../utils/apiUtils"
import "./BookStore.css"

const BookStore = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get("search") || ""

  const { books, loading, error, fetchBooks, searchBooks, fetchBooksByGenre } = useBooks()

  const [filteredBooks, setFilteredBooks] = useState([])
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [currentSearch, setCurrentSearch] = useState(searchQuery)
  const [genres, setGenres] = useState(["All"])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    // Fetch all books initially
    fetchBooks()
      .then((data) => {
        // Extract unique genres from the books
        const uniqueGenres = ["All", ...new Set(data.map((book) => book.genre))]
        setGenres(uniqueGenres)

        // Apply initial search if provided in URL
        if (searchQuery) {
          setIsSearching(true)
          searchBooks(searchQuery).finally(() => setIsSearching(false))
        }
      })
      .catch((err) => console.error("Failed to fetch books:", err))
  }, [fetchBooks, searchBooks, searchQuery])

  useEffect(() => {
    // Apply filters and sorting to the books
    let filtered = [...books]

    // Apply genre filter
    if (selectedGenre !== "All") {
      filtered = filtered.filter((book) => book.genre === selectedGenre)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered = filtered.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
        break
      case "price-low":
        filtered = filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered = filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered = filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    setFilteredBooks(filtered)
  }, [books, selectedGenre, sortBy])

  // Create a debounced search function
  const debouncedSearch = debounce((query) => {
    if (query.trim()) {
      setIsSearching(true)
      searchBooks(query).finally(() => setIsSearching(false))
    } else {
      fetchBooks()
    }
  }, 500)

  const handleSearch = (e) => {
    e.preventDefault()
    debouncedSearch(currentSearch)
  }

  const handleSearchInputChange = (e) => {
    const value = e.target.value
    setCurrentSearch(value)

    // If the input is cleared, reset to all books
    if (!value.trim()) {
      fetchBooks()
    }
  }

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre)
    if (genre === "All") {
      fetchBooks()
    } else {
      fetchBooksByGenre(genre)
    }
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const handleRetry = () => {
    if (currentSearch.trim()) {
      searchBooks(currentSearch)
    } else {
      fetchBooks()
    }
  }

  return (
    <div className="bookstore-page">
      <div className="bookstore-header">
        <h1>Book Store</h1>
        <p>Discover your next favorite book from our collection</p>
      </div>

      <div className="bookstore-filters">
        <div className="search-filter">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by title or author"
              value={currentSearch}
              onChange={handleSearchInputChange}
            />
            <button type="submit" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        <div className="genre-filter">
          <div className="filter-label">Genre:</div>
          <div className="genre-buttons">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`genre-button ${selectedGenre === genre ? "active" : ""}`}
                onClick={() => handleGenreChange(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="sort-filter">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" value={sortBy} onChange={handleSortChange}>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {error && <ErrorMessage error={error} onRetry={handleRetry} retryText="Retry Loading Books" />}

      <div className="books-results">
        <div className="results-info">
          <p>Showing {filteredBooks.length} books</p>
        </div>

        {loading && !isSearching ? (
          <LoadingIndicator text="Loading books..." />
        ) : (
          <div className="books-grid">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div key={book.id} className="book-item">
                  <BookCard book={book} />
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No books found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookStore

