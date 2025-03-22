"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import {
  cartReducer,
  initialState,
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
  applyCoupon as applyCouponAction,
  removeCoupon as removeCouponAction,
} from "../store/reducers/cartReducer"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)

        // Dispatch actions to rebuild the cart state
        parsedCart.items.forEach((item) => {
          dispatch(
            addToCartAction(
              {
                id: item.id,
                title: item.title,
                author: item.author,
                coverImage: item.coverImage,
                price: item.price,
              },
              item.quantity,
            ),
          )
        })

        // Apply coupon if it exists
        if (parsedCart.coupon) {
          dispatch(
            applyCouponAction(
              parsedCart.coupon.code,
              parsedCart.coupon.discountAmount,
              parsedCart.coupon.discountPercentage,
            ),
          )
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state))
  }, [state])

  // Action dispatchers
  const addToCart = (book, quantity = 1) => {
    dispatch(addToCartAction(book, quantity))
  }

  const removeFromCart = (id) => {
    dispatch(removeFromCartAction(id))
  }

  const updateQuantity = (id, quantity) => {
    dispatch(updateQuantityAction(id, quantity))
  }

  const clearCart = () => {
    dispatch(clearCartAction())
  }

  const applyCoupon = (code, discountAmount = 0, discountPercentage = 0) => {
    dispatch(applyCouponAction(code, discountAmount, discountPercentage))
  }

  const removeCoupon = () => {
    dispatch(removeCouponAction())
  }

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

