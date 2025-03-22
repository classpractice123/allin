import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_UPDATE_QUANTITY,
  CART_CLEAR,
  CART_APPLY_COUPON,
  CART_REMOVE_COUPON,
} from "../types"

export const initialState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  discount: 0,
  total: 0,
  coupon: null,
}

// Helper function to calculate cart totals
const calculateTotals = (items, discount = 0) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const total = subtotal - discount

  return {
    totalItems,
    subtotal,
    discount,
    total,
  }
}

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_ADD_ITEM: {
      const { book, quantity = 1 } = action.payload

      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex((item) => item.id === book.id)

      let updatedItems

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + quantity,
            }
          }
          return item
        })
      } else {
        // Add new item to cart
        updatedItems = [
          ...state.items,
          {
            id: book.id,
            title: book.title,
            author: book.author,
            coverImage: book.coverImage,
            price: book.price,
            quantity,
          },
        ]
      }

      return {
        ...state,
        items: updatedItems,
        ...calculateTotals(updatedItems, state.discount),
      }
    }

    case CART_REMOVE_ITEM: {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)

      return {
        ...state,
        items: updatedItems,
        ...calculateTotals(updatedItems, state.discount),
      }
    }

    case CART_UPDATE_QUANTITY: {
      const { id, quantity } = action.payload

      // If quantity is 0 or less, remove the item
      if (quantity <= 0) {
        const updatedItems = state.items.filter((item) => item.id !== id)

        return {
          ...state,
          items: updatedItems,
          ...calculateTotals(updatedItems, state.discount),
        }
      }

      // Otherwise update the quantity
      const updatedItems = state.items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity,
          }
        }
        return item
      })

      return {
        ...state,
        items: updatedItems,
        ...calculateTotals(updatedItems, state.discount),
      }
    }

    case CART_CLEAR:
      return {
        ...initialState,
      }

    case CART_APPLY_COUPON: {
      const { code, discountAmount, discountPercentage } = action.payload

      // Calculate discount based on either fixed amount or percentage
      let discount = 0
      if (discountAmount) {
        discount = discountAmount
      } else if (discountPercentage) {
        discount = (state.subtotal * discountPercentage) / 100
      }

      return {
        ...state,
        coupon: {
          code,
          discountAmount,
          discountPercentage,
        },
        discount,
        total: state.subtotal - discount,
      }
    }

    case CART_REMOVE_COUPON:
      return {
        ...state,
        coupon: null,
        discount: 0,
        total: state.subtotal,
      }

    default:
      return state
  }
}

// Action creators
export const addToCart = (book, quantity = 1) => ({
  type: CART_ADD_ITEM,
  payload: { book, quantity },
})

export const removeFromCart = (id) => ({
  type: CART_REMOVE_ITEM,
  payload: id,
})

export const updateQuantity = (id, quantity) => ({
  type: CART_UPDATE_QUANTITY,
  payload: { id, quantity },
})

export const clearCart = () => ({
  type: CART_CLEAR,
})

export const applyCoupon = (code, discountAmount = 0, discountPercentage = 0) => ({
  type: CART_APPLY_COUPON,
  payload: { code, discountAmount, discountPercentage },
})

export const removeCoupon = () => ({
  type: CART_REMOVE_COUPON,
})

