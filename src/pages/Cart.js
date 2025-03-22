"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import { useNotifications } from "../contexts/NotificationContext"
import "./Cart.css"

const Cart = () => {
  const {
    items,
    subtotal,
    discount,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    coupon,
  } = useCart()
  const { currentUser } = useAuth()
  const { success, error, info } = useNotifications()
  const [couponCode, setCouponCode] = useState("")
  const navigate = useNavigate()

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity)
    }
  }

  const handleRemoveItem = (id, title) => {
    if (window.confirm("Are you sure you want to remove this item from your cart?")) {
      removeFromCart(id)
      info(`"${title}" has been removed from your cart`)
    }
  }

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      clearCart()
      info("Your cart has been cleared")
    }
  }

  const handleApplyCoupon = () => {
    // In a real app, this would validate the coupon code with the backend
    if (couponCode.toLowerCase() === "bookapp10") {
      applyCoupon("BOOKAPP10", 0, 10) // 10% discount
      success("Coupon applied successfully! You got 10% off.")
    } else if (couponCode.toLowerCase() === "welcome5") {
      applyCoupon("WELCOME5", 5, 0) // $5 off
      success("Coupon applied successfully! You got $5 off.")
    } else {
      error("Invalid coupon code.")
    }

    setCouponCode("")
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    info("Coupon has been removed")
  }

  const handleCheckout = () => {
    // In a real app, this would redirect to a checkout page or process
    if (!currentUser) {
      if (window.confirm("You need to be logged in to checkout. Would you like to log in now?")) {
        navigate("/login?redirect=cart")
      }
      return
    }

    success("Proceeding to checkout...")
    // Redirect to checkout page
    setTimeout(() => {
      navigate("/checkout")
    }, 1000)
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <h1>Your Shopping Cart</h1>
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any books to your cart yet.</p>
          <Link to="/bookstore" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p>
          {items.length} {items.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          <div className="cart-items-header">
            <div className="item-product">Product</div>
            <div className="item-price">Price</div>
            <div className="item-quantity">Quantity</div>
            <div className="item-total">Total</div>
            <div className="item-actions">Actions</div>
          </div>

          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-product">
                <div className="item-image">
                  <img src={item.coverImage || "/placeholder.svg"} alt={item.title} />
                </div>
                <div className="item-details">
                  <Link to={`/book/${item.id}`} className="item-title">
                    {item.title}
                  </Link>
                  <div className="item-author">by {item.author}</div>
                </div>
              </div>

              <div className="item-price">${item.price.toFixed(2)}</div>

              <div className="item-quantity">
                <div className="quantity-controls">
                  <button
                    className="quantity-btn decrease"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                  />
                  <button
                    className="quantity-btn increase"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>

              <div className="item-actions">
                <button className="remove-item-btn" onClick={() => handleRemoveItem(item.id, item.title)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
            <Link to="/bookstore" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="summary-row discount">
              <span>Discount:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>

          <div className="summary-row total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="coupon-section">
            <h3>Apply Coupon</h3>
            {coupon ? (
              <div className="applied-coupon">
                <div className="coupon-info">
                  <span className="coupon-code">{coupon.code}</span>
                  <span className="coupon-discount">
                    {coupon.discountPercentage ? `${coupon.discountPercentage}% off` : `$${coupon.discountAmount} off`}
                  </span>
                </div>
                <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>
                  Remove
                </button>
              </div>
            ) : (
              <div className="coupon-input">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={handleApplyCoupon} disabled={!couponCode}>
                  Apply
                </button>
              </div>
            )}
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>

          <div className="secure-checkout">
            <span className="secure-icon">🔒</span> Secure Checkout
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

