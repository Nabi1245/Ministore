import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SVGSymbols from '../components/SVGSymbols'

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    paymentMethod: 'card'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Process order here
    alert('Order placed successfully!')
    clearCart()
    navigate('/')
  }

  if (cartItems.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <>
      <SVGSymbols />
      <Header />
      <div className="padding-large">
        <div className="container">
          <h1 className="display-5 text-uppercase mb-4">Checkout</h1>

          <div className="row">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Shipping Information</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">First Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Last Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Phone *</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Address *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Zip Code *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Country *</label>
                      <select
                        className="form-select"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <h5 className="mb-3">Payment Method</h5>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="card"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="card">
                          Credit/Debit Card
                        </label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="paypal"
                          value="paypal"
                          checked={formData.paymentMethod === 'paypal'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="paypal">
                          PayPal
                        </label>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-dark btn-lg w-100">
                      Place Order
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  {cartItems.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between mb-3">
                      <div>
                        <strong>{item.name}</strong>
                        <br />
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                      <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <strong>${getCartTotal().toFixed(2)}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total</strong>
                    <strong className="h4 text-primary">${getCartTotal().toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Checkout

