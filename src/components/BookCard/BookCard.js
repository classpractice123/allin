"use client"

import { Link } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import "./BookCard.css"

const BookCard = ({ book }) => {
  const { id, title, author, coverImage, price, rating, isNew, isBestseller } = book
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault() // Prevent navigation when clicking the button
    addToCart(book, 1)
    // Show a brief notification that the book was added
    alert(`Added "${title}" to your cart`)
  }

  return (
    <div className="book-card">
      <div className="book-card-image-container">
        <img src={coverImage || "/placeholder.svg"} alt={title} className="book-card-image" />
        {isNew && <span className="book-badge new-badge">New</span>}
        {isBestseller && <span className="book-badge bestseller-badge">Bestseller</span>}
      </div>

      <div className="book-card-content">
        <h3 className="book-title">
          <Link to={`/book/${id}`}>{title}</Link>
        </h3>
        <p className="book-author">by {author}</p>

        <div className="book-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < Math.floor(rating) ? "filled" : ""}`}>
              ★
            </span>
          ))}
          <span className="rating-number">({rating})</span>
        </div>

        <div className="book-card-footer">
          <span className="book-price">${price.toFixed(2)}</span>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookCard

