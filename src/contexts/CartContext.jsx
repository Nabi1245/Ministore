import React, { createContext, useContext, useState, useEffect } from 'react'
import { guestCartAPI, userCartAPI, getImageUrl } from '../utils/api'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

// Helper to get or create guest cart ID
const getGuestCartId = () => {
  let guestCartId = localStorage.getItem('guestCartId')
  if (!guestCartId) {
    guestCartId = Math.floor(100000 + Math.random() * 900000).toString()
    localStorage.setItem('guestCartId', guestCartId)
  }
  return guestCartId
}

// Helper to check if user is logged in
const isLoggedIn = () => {
  return !!localStorage.getItem('token')
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [wasLoggedIn, setWasLoggedIn] = useState(isLoggedIn())

  const mergeGuestCart = async () => {
    if (!isLoggedIn()) return
    
    try {
      const guestCartId = localStorage.getItem('guestCartId')
      if (guestCartId) {
        await userCartAPI.mergeGuestCart(guestCartId)
        localStorage.removeItem('guestCartId')
        // Reload cart after merge
        await loadCart()
      }
    } catch (error) {
      console.error('Error merging cart:', error)
      throw error
    }
  }

  // Load cart on mount and when auth status changes
  useEffect(() => {
    loadCart()
  }, [])

  // Listen for token changes to reload cart
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        const nowLoggedIn = !!localStorage.getItem('token')
        if (nowLoggedIn && !wasLoggedIn) {
          // User just logged in - merge cart first
          mergeGuestCart().then(() => {
            setWasLoggedIn(true)
            loadCart()
          }).catch(() => {
            setWasLoggedIn(true)
            loadCart()
          })
        } else {
          setWasLoggedIn(nowLoggedIn)
          loadCart()
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Also check for token changes in same window
    const checkAuth = setInterval(() => {
      const hasToken = !!localStorage.getItem('token')
      if (hasToken !== wasLoggedIn) {
        if (hasToken && !wasLoggedIn) {
          // User just logged in - merge cart first
          mergeGuestCart().then(() => {
            setWasLoggedIn(true)
            loadCart()
          }).catch(() => {
            setWasLoggedIn(true)
            loadCart()
          })
        } else {
          setWasLoggedIn(hasToken)
          loadCart()
        }
      }
    }, 500)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(checkAuth)
    }
  }, [wasLoggedIn])

  const loadCart = async (shouldMergeFirst = false) => {
    try {
      setLoading(true)
      
      if (isLoggedIn()) {
        // Load user cart
        const cartData = await userCartAPI.get()
        if (cartData && cartData.products) {
          setCart(cartData)
          setCartItems(cartData.products.map(p => {
            const imagePath = p.images?.[0]?.imageUrl || p.thumbnailImage
            return {
              id: p.id,
              title: p.title,
              price: parseFloat(p.price),
              discountPrice: p.discountPrice ? parseFloat(p.discountPrice) : null,
              thumbnailImage: p.thumbnailImage,
              image: getImageUrl(imagePath),
              quantity: p.cartItem.quantity,
              category: p.category?.name || '',
              caseDetails: p.caseDetails || null,
            }
          }))
        } else {
          setCartItems([])
          setCart(null)
        }
      } else {
        // Load guest cart
        const guestCartId = getGuestCartId()
        try {
          const cartData = await guestCartAPI.get(guestCartId)
          if (cartData && cartData.products) {
            setCart(cartData)
            setCartItems(cartData.products.map(p => {
              const imagePath = p.images?.[0]?.imageUrl || p.thumbnailImage
              return {
                id: p.id,
                title: p.title,
                price: parseFloat(p.price),
                discountPrice: p.discountPrice ? parseFloat(p.discountPrice) : null,
                thumbnailImage: p.thumbnailImage,
                image: getImageUrl(imagePath),
                quantity: p.cartItem.quantity,
                category: p.category?.name || '',
                caseDetails: p.caseDetails || null,
              }
            }))
          } else {
            // Create guest cart if it doesn't exist
            await guestCartAPI.create(guestCartId)
            setCartItems([])
            setCart(null)
          }
        } catch (error) {
          // Create guest cart if not found
          try {
            await guestCartAPI.create(guestCartId)
            setCartItems([])
            setCart(null)
          } catch (e) {
            console.error('Error creating guest cart:', e)
          }
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      setCartItems([])
      setCart(null)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product, quantity = 1) => {
    try {
      if (isLoggedIn()) {
        await userCartAPI.addItem(product.id, quantity)
      } else {
        const guestCartId = getGuestCartId()
        await guestCartAPI.addItem(guestCartId, product.id, quantity)
      }
      await loadCart()
      return true
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert(error.message || 'Failed to add item to cart')
      return false
    }
  }

  const removeFromCart = async (productId) => {
    try {
      if (isLoggedIn()) {
        await userCartAPI.removeItem(productId)
      } else {
        const guestCartId = getGuestCartId()
        await guestCartAPI.removeItem(guestCartId, productId)
      }
      await loadCart()
      return true
    } catch (error) {
      console.error('Error removing from cart:', error)
      alert(error.message || 'Failed to remove item from cart')
      return false
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }
    
    try {
      if (isLoggedIn()) {
        await userCartAPI.updateItem(productId, quantity)
      } else {
        const guestCartId = getGuestCartId()
        await guestCartAPI.updateItem(guestCartId, productId, quantity)
      }
      await loadCart()
      return true
    } catch (error) {
      console.error('Error updating cart quantity:', error)
      alert(error.message || 'Failed to update quantity')
      return false
    }
  }

  const clearCart = async () => {
    try {
      if (isLoggedIn()) {
        await userCartAPI.clear()
      } else {
        // For guest cart, remove items one by one
        const itemsToRemove = [...cartItems]
        for (const item of itemsToRemove) {
          const guestCartId = getGuestCartId()
          await guestCartAPI.removeItem(guestCartId, item.id)
        }
      }
      await loadCart()
      return true
    } catch (error) {
      console.error('Error clearing cart:', error)
      alert(error.message || 'Failed to clear cart')
      return false
    }
  }


  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discountPrice || item.price
      return total + (price * item.quantity)
    }, 0)
  }

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId)
  }

  const value = {
    cartItems,
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    mergeGuestCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    loadCart,
    isLoggedIn: isLoggedIn(),
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
