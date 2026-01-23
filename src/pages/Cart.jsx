import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { getImageUrl } from '../utils/api'

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal, loading, loadCart, isLoggedIn } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    loadCart()
  }, [])

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }
    
    // Check if user is logged in before proceeding to checkout
    if (!isLoggedIn) {
      alert('Please login to proceed with checkout')
      // Store the intended destination to redirect after login
      localStorage.setItem('redirectAfterLogin', '/checkout')
      navigate('/login')
      return
    }
    
    navigate('/checkout')
  }

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="padding-large text-center" style={{ minHeight: '60vh' }}>
        <div className="container">
          <div className="py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="padding-large text-center" style={{ minHeight: '60vh' }}>
        <div className="container">
          <div className="py-5">
            <svg className="cart-outline mb-4" width="100" height="100" style={{ opacity: 0.3 }}>
              <use xlinkHref="#cart-outline"></use>
            </svg>
            <h2 className="mb-3 fw-semibold" style={{ fontSize: '1.5rem' }}>Your cart is empty</h2>
            <p className="mb-4" style={{ fontSize: '1rem' }}>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="btn btn-dark btn-lg">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="padding-large">
        <div className="container">
          <h1 className="h2 h-md-3 text-uppercase mb-4 fw-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Shopping Cart</h1>

          <div className="row">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  {cartItems.map((item) => {
                    const itemPrice = item.discountPrice || item.price
                    const itemTotal = itemPrice * item.quantity
                    
                    return (
                      <div key={item.id} className="d-flex align-items-center mb-4 pb-4 border-bottom">
                        <Link to={`/product/${item.id}`} className="text-decoration-none">
                          <img
                            src={getImageUrl(item.image || item.thumbnailImage || '/images/product-item1.jpg')}
                            alt={item.title}
                            className="img-fluid"
                            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                            onError={(e) => {
                              e.target.src = '/images/product-item1.jpg'
                            }}
                          />
                        </Link>

                        <div className="flex-grow-1 ms-4">
                          <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">
                            <h5 className="mb-2 fw-semibold" style={{ fontSize: '1rem' }}>{item.title}</h5>
                          </Link>
                          {item.category && (
                            <p className="text-muted mb-2">Category: <span className="text-capitalize">{item.category}</span></p>
                          )}
                          {item.caseDetails && (
                            <p className="text-muted mb-2 small">
                              {item.caseDetails.brand?.name} {item.caseDetails.model?.name}
                            </p>
                          )}
                          <p className="text-primary mb-0 fw-bold" style={{ fontSize: '1.1rem' }}>{formatPrice(itemPrice)}</p>
                          {item.discountPrice && (
                            <small className="text-muted text-decoration-line-through" style={{ fontSize: '0.85rem' }}>{formatPrice(item.price)}</small>
                          )}
                        </div>

                        <div className="d-flex align-items-center me-4">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="form-control text-center mx-2"
                            style={{ width: '80px' }}
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1
                              updateQuantity(item.id, val)
                            }}
                            min="1"
                          />
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>

                        <div className="text-end me-4">
                          <p className="mb-2 fw-bold" style={{ fontSize: '1.25rem' }}>{formatPrice(itemTotal)}</p>
                          <button
                            className="btn btn-link text-danger p-0"
                            onClick={() => removeFromCart(item.id)}
                            style={{ fontSize: '0.9rem' }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )
                  })}

                  <div className="d-flex justify-content-between mt-3">
                    <Link to="/shop" className="btn btn-outline-dark">
                      Continue Shopping
                    </Link>
                    <button
                      className="btn btn-outline-danger"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.1rem' }}>Order Summary</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3" style={{ fontSize: '0.95rem' }}>
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <strong>{formatPrice(getCartTotal())}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-3" style={{ fontSize: '0.95rem' }}>
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <strong style={{ fontSize: '1.1rem' }}>Total</strong>
                    <strong className="text-primary fw-bold" style={{ fontSize: '1.5rem' }}>{formatPrice(getCartTotal())}</strong>
                  </div>

                  <button
                    className="btn btn-dark btn-lg w-100 mb-3"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>

                  <Link to="/shop" className="btn btn-outline-dark w-100">
                    Continue Shopping
                  </Link>
                </div>
              </div>

              <div className="card mt-3">
                <div className="card-body">
                  <h6 className="mb-3">Why shop with us?</h6>
                  <ul className="list-unstyled small">
                    <li className="mb-2">
                      <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                      </svg>
                      Free delivery
                    </li>
                    <li className="mb-2">
                      <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                      </svg>
                      Quality guarantee
                    </li>
                    <li className="mb-2">
                      <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                      </svg>
                      Secure payment
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  )
}

export default Cart
