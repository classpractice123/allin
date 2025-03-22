"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useBooks } from "../contexts/BookContext"
import { useCart } from "../contexts/CartContext"
import "./BookDetail.css"

const BookDetail = () => {
  const { id } = useParams()
  const { fetchBookById, loading, error } = useBooks()
  const { addToCart } = useCart()
  const [book, setBook] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")

  useEffect(() => {
    // Fetch book details when component mounts or ID changes
    fetchBookById(id)
      .then((data) => {
        setBook(data)
      })
      .catch((err) => console.error("Failed to fetch book details:", err))
  }, [id, fetchBookById])

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    if (book) {
      addToCart(book, quantity)
      alert(`Added ${quantity} copy/copies of "${book.title}" to cart`)
    }
  }

  const handleAddToWishlist = () => {
    // In a real app, this would add the book to the wishlist
    alert(`Added "${book.title}" to your wishlist`)
  }

  if (loading && !book) {
    return (
      <div className="book-detail-page loading">
        <div className="loading-spinner"></div>
        <p>Loading book details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="book-detail-page error">
        <div className="error-message">
          <h2>Error Loading Book</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="book-detail-page not-found">
        <p>Book not found.</p>
        <Link to="/bookstore" className="back-to-store">
          Back to Book Store
        </Link>
      </div>
    )
  }

  return (
    <div className="book-detail-page">
      <div className="book-detail-container">
        <div className="book-detail-header">
          <div className="book-image-container">
            <img src={book.coverImage || "/placeholder.svg"} alt={book.title} className="book-image" />
            {book.isNew && <span className="book-badge new-badge">New</span>}
            {book.isBestseller && <span className="book-badge bestseller-badge">Bestseller</span>}
          </div>

          <div className="book-info">
            <h1 className="book-title">{book.title}</h1>
            <p className="book-author">by {book.author}</p>

            <div className="book-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < Math.floor(book.rating) ? "filled" : ""}`}>
                  ★
                </span>
              ))}
              <span className="rating-number">({book.rating})</span>
            </div>

            <div className="book-price">${book.price.toFixed(2)}</div>

            <div className="book-meta">
              <div className="meta-item">
                <span className="meta-label">Genre:</span>
                <span className="meta-value">{book.genre}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Published:</span>
                <span className="meta-value">{new Date(book.publishDate).toLocaleDateString()}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Publisher:</span>
                <span className="meta-value">{book.publisher}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Pages:</span>
                <span className="meta-value">{book.pages}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">ISBN:</span>
                <span className="meta-value">{book.isbn}</span>
              </div>
            </div>

            <div className="book-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <input type="number" id="quantity" min="1" value={quantity} onChange={handleQuantityChange} />
              </div>

              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>

              <button className="wishlist-btn" onClick={handleAddToWishlist}>
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        <div className="book-detail-content">
          <div className="book-tabs">
            <button
              className={`tab-button ${activeTab === "description" ? "active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({book.reviews ? book.reviews.length : 0})
            </button>
            <button
              className={`tab-button ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "description" && (
              <div className="description-tab">
                {book.description.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="reviews-tab">
                <div className="reviews-header">
                  <h3>Customer Reviews</h3>
                  <button className="write-review-btn">Write a Review</button>
                </div>

                {book.reviews && book.reviews.length > 0 ? (
                  <div className="reviews-list">
                    {book.reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <img
                              src={review.avatar || "/placeholder.svg"}
                              alt={review.user}
                              className="reviewer-avatar"
                            />
                            <div className="reviewer-details">
                              <div className="reviewer-name">{review.user}</div>
                              <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`star ${i < Math.floor(review.rating) ? "filled" : ""}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="review-comment">{review.comment}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-reviews">No reviews yet. Be the first to review this book!</p>
                )}
              </div>
            )}

            {activeTab === "details" && (
              <div className="details-tab">
                <table className="details-table">
                  <tbody>
                    <tr>
                      <th>Title</th>
                      <td>{book.title}</td>
                    </tr>
                    <tr>
                      <th>Author</th>
                      <td>{book.author}</td>
                    </tr>
                    <tr>
                      <th>ISBN</th>
                      <td>{book.isbn}</td>
                    </tr>
                    <tr>
                      <th>Publisher</th>
                      <td>{book.publisher}</td>
                    </tr>
                    <tr>
                      <th>Publication Date</th>
                      <td>{new Date(book.publishDate).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <th>Pages</th>
                      <td>{book.pages}</td>
                    </tr>
                    <tr>
                      <th>Genre</th>
                      <td>{book.genre}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {book.relatedBooks && book.relatedBooks.length > 0 && (
          <div className="related-books">
            <h2>You May Also Like</h2>
            <div className="related-books-grid">
              {book.relatedBooks.map((relatedBook) => (
                <div key={relatedBook.id} className="related-book-item">
                  <Link to={`/book/${relatedBook.id}`} className="related-book-link">
                    <div className="related-book-image">
                      <img src={relatedBook.coverImage || "/placeholder.svg"} alt={relatedBook.title} />
                    </div>
                    <div className="related-book-info">
                      <h3 className="related-book-title">{relatedBook.title}</h3>
                      <p className="related-book-author">by {relatedBook.author}</p>
                      <div className="related-book-price">${relatedBook.price.toFixed(2)}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookDetail

