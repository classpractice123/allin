"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Books.css"

// Mock data for books
const booksData = [
  {
    id: 1,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    coverImage: "https://source.unsplash.com/random/300x450?book,thriller",
    genre: "Thriller",
    publishDate: "2019-02-05",
    status: "published",
    featured: true,
    price: 12.99,
    rating: 4.6,
    sales: 1245,
    reviews: 328,
  },
  {
    id: 2,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    coverImage: "https://source.unsplash.com/random/300x450?book,nature",
    genre: "Fiction",
    publishDate: "2018-08-14",
    status: "published",
    featured: true,
    price: 14.99,
    rating: 4.8,
    sales: 1876,
    reviews: 542,
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    coverImage: "https://source.unsplash.com/random/300x450?book,habits",
    genre: "Self-Help",
    publishDate: "2018-10-16",
    status: "published",
    featured: false,
    price: 16.99,
    rating: 4.9,
    sales: 2134,
    reviews: 687,
  },
  {
    id: 4,
    title: "The Midnight Library",
    author: "Matt Haig",
    coverImage: "https://source.unsplash.com/random/300x450?book,library",
    genre: "Fiction",
    publishDate: "2020-08-13",
    status: "published",
    featured: false,
    price: 11.99,
    rating: 4.5,
    sales: 987,
    reviews: 245,
  },
  {
    id: 5,
    title: "Educated",
    author: "Tara Westover",
    coverImage: "https://source.unsplash.com/random/300x450?book,education",
    genre: "Memoir",
    publishDate: "2018-02-20",
    status: "published",
    featured: false,
    price: 13.99,
    rating: 4.7,
    sales: 1432,
    reviews: 376,
  },
  {
    id: 6,
    title: "The Alchemist",
    author: "Paulo Coelho",
    coverImage: "https://source.unsplash.com/random/300x450?book,desert",
    genre: "Fiction",
    publishDate: "1988-01-01",
    status: "published",
    featured: true,
    price: 10.99,
    rating: 4.8,
    sales: 3245,
    reviews: 1245,
  },
  {
    id: 7,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    coverImage: "https://source.unsplash.com/random/300x450?book,history",
    genre: "Non-Fiction",
    publishDate: "2011-01-01",
    status: "published",
    featured: false,
    price: 15.99,
    rating: 4.7,
    sales: 1876,
    reviews: 543,
  },
  {
    id: 8,
    title: "Becoming",
    author: "Michelle Obama",
    coverImage: "https://source.unsplash.com/random/300x450?book,biography",
    genre: "Memoir",
    publishDate: "2018-11-13",
    status: "published",
    featured: true,
    price: 14.99,
    rating: 4.9,
    sales: 2543,
    reviews: 876,
  },
  {
    id: 9,
    title: "The Four Winds",
    author: "Kristin Hannah",
    coverImage: "https://source.unsplash.com/random/300x450?book,wind",
    genre: "Historical Fiction",
    publishDate: "2021-02-02",
    status: "published",
    featured: false,
    price: 13.99,
    rating: 4.6,
    sales: 876,
    reviews: 234,
  },
  {
    id: 10,
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverImage: "https://source.unsplash.com/random/300x450?book,space",
    genre: "Science Fiction",
    publishDate: "2021-05-04",
    status: "published",
    featured: false,
    price: 15.99,
    rating: 4.8,
    sales: 765,
    reviews: 187,
  },
  {
    id: 11,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    coverImage: "https://source.unsplash.com/random/300x450?book,money",
    genre: "Finance",
    publishDate: "2020-09-08",
    status: "published",
    featured: false,
    price: 12.99,
    rating: 4.7,
    sales: 1432,
    reviews: 376,
  },
  {
    id: 12,
    title: "The Vanishing Half",
    author: "Brit Bennett",
    coverImage: "https://source.unsplash.com/random/300x450?book,portrait",
    genre: "Fiction",
    publishDate: "2020-06-02",
    status: "published",
    featured: false,
    price: 13.99,
    rating: 4.5,
    sales: 987,
    reviews: 254,
  },
]

const Books = () => {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [genreFilter, setGenreFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [featuredFilter, setFeaturedFilter] = useState("all")
  const [sortBy, setSortBy] = useState("title")
  const [sortOrder, setSortOrder] = useState("asc")
  const [selectedBooks, setSelectedBooks] = useState([])
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [viewMode, setViewMode] = useState("grid")

  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setBooks(booksData)
      setFilteredBooks(booksData)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    filterBooks()
  }, [searchTerm, genreFilter, statusFilter, featuredFilter, sortBy, sortOrder, books])

  const filterBooks = () => {
    let filtered = [...books]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply genre filter
    if (genreFilter !== "all") {
      filtered = filtered.filter((book) => book.genre === genreFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((book) => book.status === statusFilter)
    }

    // Apply featured filter
    if (featuredFilter !== "all") {
      filtered = filtered.filter((book) => (featuredFilter === "featured" ? book.featured : !book.featured))
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "author":
          comparison = a.author.localeCompare(b.author)
          break
        case "genre":
          comparison = a.genre.localeCompare(b.genre)
          break
        case "publishDate":
          comparison = new Date(a.publishDate) - new Date(b.publishDate)
          break
        case "price":
          comparison = a.price - b.price
          break
        case "rating":
          comparison = a.rating - b.rating
          break
        case "sales":
          comparison = a.sales - b.sales
          break
        case "reviews":
          comparison = a.reviews - b.reviews
          break
        default:
          comparison = 0
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredBooks(filtered)
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedBooks([])
    } else {
      setSelectedBooks(filteredBooks.map((book) => book.id))
    }
    setIsAllSelected(!isAllSelected)
  }

  const handleSelectBook = (bookId) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId))
      setIsAllSelected(false)
    } else {
      setSelectedBooks([...selectedBooks, bookId])
      if (selectedBooks.length + 1 === filteredBooks.length) {
        setIsAllSelected(true)
      }
    }
  }

  const handleBulkAction = (action) => {
    if (selectedBooks.length === 0) return

    // In a real app, this would be an API call
    console.log(`Performing ${action} on books:`, selectedBooks)

    // Update local state for demo purposes
    if (action === "publish" || action === "unpublish") {
      const newStatus = action === "publish" ? "published" : "draft"
      const updatedBooks = books.map((book) =>
        selectedBooks.includes(book.id) ? { ...book, status: newStatus } : book,
      )
      setBooks(updatedBooks)
    } else if (action === "feature" || action === "unfeature") {
      const updatedBooks = books.map((book) =>
        selectedBooks.includes(book.id) ? { ...book, featured: action === "feature" } : book,
      )
      setBooks(updatedBooks)
    } else if (action === "delete") {
      const updatedBooks = books.filter((book) => !selectedBooks.includes(book.id))
      setBooks(updatedBooks)
    }

    // Reset selection
    setSelectedBooks([])
    setIsAllSelected(false)
  }

  const getUniqueGenres = () => {
    const genres = books.map((book) => book.genre)
    return ["all", ...new Set(genres)]
  }

  if (loading) {
    return (
      <div className="books-page loading">
        <div className="loading-spinner"></div>
        <p>Loading books...</p>
      </div>
    )
  }

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>Book Management</h1>
        <Link to="/admin/books/new" className="add-book-btn">
          Add New Book
        </Link>
      </div>

      <div className="books-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter">
            <label>Genre:</label>
            <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
              {getUniqueGenres().map((genre) => (
                <option key={genre} value={genre}>
                  {genre === "all" ? "All Genres" : genre}
                </option>
              ))}
            </select>
          </div>

          <div className="filter">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="filter">
            <label>Featured:</label>
            <select value={featuredFilter} onChange={(e) => setFeaturedFilter(e.target.value)}>
              <option value="all">All Books</option>
              <option value="featured">Featured</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>
        </div>
      </div>

      <div className="view-options">
        <div className="view-mode-toggle">
          <button
            className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
          <button
            className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
        </div>

        <div className="sort-options">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="publishDate">Publish Date</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="sales">Sales</option>
            <option value="reviews">Reviews</option>
          </select>
          <button className="sort-order-btn" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {selectedBooks.length > 0 && (
        <div className="bulk-actions">
          <span className="selected-count">{selectedBooks.length} books selected</span>
          <div className="action-buttons">
            <button className="bulk-action-btn publish" onClick={() => handleBulkAction("publish")}>
              Publish
            </button>
            <button className="bulk-action-btn unpublish" onClick={() => handleBulkAction("unpublish")}>
              Unpublish
            </button>
            <button className="bulk-action-btn feature" onClick={() => handleBulkAction("feature")}>
              Feature
            </button>
            <button className="bulk-action-btn unfeature" onClick={() => handleBulkAction("unfeature")}>
              Unfeature
            </button>
            <button className="bulk-action-btn delete" onClick={() => handleBulkAction("delete")}>
              Delete
            </button>
          </div>
        </div>
      )}

      {viewMode === "grid" ? (
        <div className="books-grid">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-card-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(book.id)}
                    onChange={() => handleSelectBook(book.id)}
                  />
                </div>
                {book.featured && <div className="featured-badge">Featured</div>}
                <div className="book-card-image">
                  <img src={book.coverImage || "/placeholder.svg"} alt={book.title} />
                </div>
                <div className="book-card-content">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-meta">
                    <span className="book-genre">{book.genre}</span>
                    <span className="book-price">${book.price.toFixed(2)}</span>
                  </div>
                  <div className="book-stats">
                    <div className="stat-item">
                      <span className="stat-label">Rating:</span>
                      <span className="stat-value">{book.rating}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Sales:</span>
                      <span className="stat-value">{book.sales}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Reviews:</span>
                      <span className="stat-value">{book.reviews}</span>
                    </div>
                  </div>
                  <div className="book-status">
                    <span className={`status-badge ${book.status}`}>{book.status}</span>
                  </div>
                  <div className="book-actions">
                    <Link to={`/book/${book.id}`} className="action-button view">
                      View
                    </Link>
                    <Link to={`/admin/books/${book.id}/edit`} className="action-button edit">
                      Edit
                    </Link>
                    <button className="action-button delete">Delete</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No books found matching your criteria.</div>
          )}
        </div>
      ) : (
        <div className="books-table-container">
          <table className="books-table">
            <thead>
              <tr>
                <th className="checkbox-cell">
                  <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
                </th>
                <th className="image-cell">Cover</th>
                <th className={`sortable ${sortBy === "title" ? "sorted" : ""}`} onClick={() => handleSort("title")}>
                  Title
                  {sortBy === "title" && <span className="sort-indicator">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th className={`sortable ${sortBy === "author" ? "sorted" : ""}`} onClick={() => handleSort("author")}>
                  Author
                  {sortBy === "author" && <span className="sort-indicator">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th className={`sortable ${sortBy === "genre" ? "sorted" : ""}`} onClick={() => handleSort("genre")}>
                  Genre
                  {sortBy === "genre" && <span className="sort-indicator">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th className={`sortable ${sortBy === "price" ? "sorted" : ""}`} onClick={() => handleSort("price")}>
                  Price
                  {sortBy === "price" && <span className="sort-indicator">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th className={`sortable ${sortBy === "rating" ? "sorted" : ""}`} onClick={() => handleSort("rating")}>
                  Rating
                  {sortBy === "rating" && <span className="sort-indicator">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th className={`sortable ${sortBy === "sales" ? "sorted" : ""}`} onClick={() => handleSort("sales")}>
                  Sales
                  {sortBy === "sales" && <span className="sort-indicator">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedBooks.includes(book.id)}
                        onChange={() => handleSelectBook(book.id)}
                      />
                    </td>
                    <td className="image-cell">
                      <img src={book.coverImage || "/placeholder.svg"} alt={book.title} className="book-thumbnail" />
                    </td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>${book.price.toFixed(2)}</td>
                    <td>{book.rating}</td>
                    <td>{book.sales}</td>
                    <td>
                      <span className={`status-badge ${book.status}`}>{book.status}</span>
                    </td>
                    <td>
                      <span className={`featured-indicator ${book.featured ? "yes" : "no"}`}>
                        {book.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/book/${book.id}`} className="action-button view">
                          View
                        </Link>
                        <Link to={`/admin/books/${book.id}/edit`} className="action-button edit">
                          Edit
                        </Link>
                        <button className="action-button delete">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="no-results">
                    No books found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button className="pagination-btn" disabled>
          Previous
        </button>
        <div className="pagination-pages">
          <button className="pagination-page active">1</button>
          <button className="pagination-page">2</button>
          <button className="pagination-page">3</button>
        </div>
        <button className="pagination-btn">Next</button>
      </div>
    </div>
  )
}

export default Books

