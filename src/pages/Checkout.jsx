import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { checkoutAPI, orderAPI, paymentAPI } from '../utils/api'

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, isLoggedIn } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [checkoutSummary, setCheckoutSummary] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    emailAddress: '',
    fullAddress: '',
    townOrCity: '',
    country: 'India',
    state: '',
    pinCode: '',
  })
  const [errors, setErrors] = useState({})
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    // Check login status and cart items whenever they change
    if (!isLoggedIn) {
      alert('Please login to proceed with checkout')
      localStorage.setItem('redirectAfterLogin', '/checkout')
      navigate('/login')
      return
    }

    if (cartItems.length === 0) {
      navigate('/cart')
      return
    }

    loadCheckoutSummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, cartItems.length])

  const loadCheckoutSummary = async () => {
    try {
      setLoading(true)
      const summary = await checkoutAPI.getSummary()
      setCheckoutSummary(summary)
    } catch (error) {
      console.error('Error loading checkout summary:', error)
      alert('Failed to load checkout details. Please try again.')
      navigate('/cart')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Mobile number must be 10 digits'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) newErrors.emailAddress = 'Valid email is required'
    if (!formData.fullAddress.trim()) newErrors.fullAddress = 'Address is required'
    if (!formData.townOrCity.trim()) newErrors.townOrCity = 'City is required'
    if (!formData.country.trim()) newErrors.country = 'Country is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!/^\d{6}$/.test(formData.pinCode)) newErrors.pinCode = 'Pin code must be 6 digits'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      // Validate address first
      const addressValidation = await checkoutAPI.validateAddress(formData)
      if (!addressValidation.isValid) {
        alert('Please check your shipping address')
        return
      }

      // Create order
      const orderResult = await orderAPI.create(formData)
      const orderId = orderResult.order.id

      // Initiate payment
      await initiatePayuPayment(orderId)

    } catch (error) {
      console.error('Error processing order:', error)
      alert(error.message || 'Failed to process order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const initiatePayuPayment = async (orderId) => {
    try {
      setProcessingPayment(true)

      // Create PayU payment params
      const payuResponse = await paymentAPI.createPayuPayment(orderId)
      
      if (!payuResponse.paymentParams || !payuResponse.paymentUrl) {
        throw new Error('Failed to initialize payment gateway')
      }

      // Create a form and submit to PayU
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = payuResponse.paymentUrl
      form.style.display = 'none'

      // Add all payment parameters as hidden inputs
      Object.keys(payuResponse.paymentParams).forEach((key) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = payuResponse.paymentParams[key]
        form.appendChild(input)
      })

      // Append form to body and submit
      document.body.appendChild(form)
      form.submit()

      // Note: setProcessingPayment will be reset when user returns from PayU
      // PayU will redirect to success/failure callback URLs handled by backend

    } catch (error) {
      console.error('Error initiating payment:', error)
      alert(error.message || 'Failed to initiate payment. Please try again.')
      setProcessingPayment(false)
    }
  }

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`
  }

  if (loading && !checkoutSummary) {
    return (
      <div className="padding-large">
        <div className="container">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    navigate('/login')
    return null
  }

  if (cartItems.length === 0) {
    navigate('/cart')
    return null
  }

  const summary = checkoutSummary?.summary

  return (
    <div className="padding-large">
        <div className="container">
          <h1 className="h2 h-md-3 text-uppercase mb-4 fw-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Checkout</h1>

          <div className="row">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.1rem' }}>Shipping Information</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">First Name *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Last Name *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className={`form-control ${errors.emailAddress ? 'is-invalid' : ''}`}
                          name="emailAddress"
                          value={formData.emailAddress}
                          onChange={handleChange}
                          required
                        />
                        {errors.emailAddress && <div className="invalid-feedback">{errors.emailAddress}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Mobile Number *</label>
                        <input
                          type="tel"
                          className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          maxLength="10"
                          required
                        />
                        {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber}</div>}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Full Address *</label>
                      <textarea
                        className={`form-control ${errors.fullAddress ? 'is-invalid' : ''}`}
                        name="fullAddress"
                        value={formData.fullAddress}
                        onChange={handleChange}
                        rows="3"
                        required
                      />
                      {errors.fullAddress && <div className="invalid-feedback">{errors.fullAddress}</div>}
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.townOrCity ? 'is-invalid' : ''}`}
                          name="townOrCity"
                          value={formData.townOrCity}
                          onChange={handleChange}
                          required
                        />
                        {errors.townOrCity && <div className="invalid-feedback">{errors.townOrCity}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Pin Code *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.pinCode ? 'is-invalid' : ''}`}
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleChange}
                          maxLength="6"
                          required
                        />
                        {errors.pinCode && <div className="invalid-feedback">{errors.pinCode}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">State *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                        />
                        {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Country *</label>
                        <select
                          className={`form-select ${errors.country ? 'is-invalid' : ''}`}
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                        >
                          <option value="India">India</option>
                          <option value="USA">United States</option>
                          <option value="UK">United Kingdom</option>
                        </select>
                        {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-dark btn-lg w-100"
                      disabled={loading || processingPayment}
                    >
                      {processingPayment ? 'Processing Payment...' : loading ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.1rem' }}>Order Summary</h5>
                </div>
                <div className="card-body">
                  {cartItems.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between mb-3">
                      <div>
                        <strong>{item.title}</strong>
                        <br />
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                      <strong>{formatPrice((item.discountPrice || item.price) * item.quantity)}</strong>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <strong>{formatPrice(summary?.subtotal || getCartTotal())}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total</strong>
                    <strong className="h4 text-primary">{formatPrice(summary?.totalAmount || getCartTotal())}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   
  )
}

export default Checkout
