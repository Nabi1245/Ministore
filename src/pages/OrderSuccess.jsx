import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { orderAPI, getImageUrl } from '../utils/api'

const OrderSuccess = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadOrder()
    }
  }, [id])

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await orderAPI.getById(id)
      setOrder(data.order || data)
    } catch (err) {
      console.error('Error loading order:', err)
      setError('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'warning',
      paid: 'success',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger',
    }
    return statusColors[status] || 'secondary'
  }

  if (loading) {
    return (
      <div className="padding-large">
        <div className="container">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="padding-large">
        <div className="container">
          <div className="alert alert-danger">
            {error || 'Order not found'}
            <div className="mt-3">
              <Link to="/shop" className="btn btn-primary me-2">Continue Shopping</Link>
              <Link to="/" className="btn btn-secondary">Go Home</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="padding-large">
      <div className="container">
        {/* Success Header */}
        <div className="text-center mb-5">
          <div className="mb-4">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-success"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <path
                d="M8 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="h2 h-md-3 text-success mb-3 fw-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Order Placed Successfully!</h1>
          <p className="text-muted mb-2" style={{ fontSize: '1rem' }}>
            Thank you for your order. We've received your order and will begin processing it right away.
          </p>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>
            Order ID: <strong>#{order.id}</strong>
          </p>
        </div>

        <div className="row g-4">
          {/* Order Summary */}
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Order Details</h5>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Order ID:</strong> #{order.id}
                  </div>
                  <div className="col-md-6">
                    <strong>Order Date:</strong> {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Status:</strong>{' '}
                    <span className={`badge bg-${getStatusBadge(order.status)}`}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <strong>Total Amount:</strong> {formatCurrency(order.totalAmount)}
                  </div>
                </div>
                {(order.payuPaymentId || order.payuTxnId) && (
                  <div className="row mb-3">
                    {order.payuPaymentId && (
                      <div className="col-md-6">
                        <strong>Payment ID:</strong> {order.payuPaymentId}
                      </div>
                    )}
                    {order.payuTxnId && (
                      <div className="col-md-6">
                        <strong>Transaction ID:</strong> {order.payuTxnId}
                      </div>
                    )}
                    {order.paymentMode && (
                      <div className="col-md-6">
                        <strong>Payment Mode:</strong> {order.paymentMode}
                      </div>
                    )}
                    {order.bankRefNo && (
                      <div className="col-md-6">
                        <strong>Bank Ref:</strong> {order.bankRefNo}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Order Items</h5>
              </div>
              <div className="card-body">
                {order.orderItems && order.orderItems.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderItems.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                {item.product?.images?.[0] && (
                                  <img
                                    src={getImageUrl(item.product.images[0].imageUrl)}
                                    alt={item.product.title}
                                    style={{
                                      width: '50px',
                                      height: '50px',
                                      objectFit: 'cover',
                                      marginRight: '10px',
                                    }}
                                    className="rounded"
                                  />
                                )}
                                <div>
                                  <strong>{item.product?.title || 'Product'}</strong>
                                </div>
                              </div>
                            </td>
                            <td>{formatCurrency(item.priceAtPurchase)}</td>
                            <td>{item.quantity}</td>
                            <td>
                              {formatCurrency(item.priceAtPurchase * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-end">
                            <strong>Total:</strong>
                          </td>
                          <td>
                            <strong>{formatCurrency(order.totalAmount)}</strong>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No items found</p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.1rem' }}>Shipping Address</h5>
              </div>
              <div className="card-body">
                <p className="mb-1">
                  <strong>{order.firstName} {order.lastName}</strong>
                </p>
                <p className="mb-1">{order.fullAddress}</p>
                <p className="mb-1">
                  {order.townOrCity}, {order.state} - {order.pinCode}
                </p>
                <p className="mb-1">{order.country}</p>
                <p className="mb-0">
                  <strong>Phone:</strong> {order.mobileNumber}
                </p>
                <p className="mb-0">
                  <strong>Email:</strong> {order.emailAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4 fw-semibold" style={{ fontSize: '1.1rem' }}>What's Next?</h5>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <strong>1. Order Confirmation</strong>
                    <p className="text-muted small mb-0">
                      You will receive an email confirmation shortly.
                    </p>
                  </li>
                  <li className="mb-3">
                    <strong>2. Processing</strong>
                    <p className="text-muted small mb-0">
                      We'll start processing your order right away.
                    </p>
                  </li>
                  <li className="mb-3">
                    <strong>3. Shipping</strong>
                    <p className="text-muted small mb-0">
                      You'll receive tracking information once your order ships.
                    </p>
                  </li>
                </ul>
                <hr />
                <div className="d-grid gap-2">
                  <Link to="/my-orders" className="btn btn-primary">
                    View All Orders
                  </Link>
                  <Link to="/shop" className="btn btn-outline-primary">
                    Continue Shopping
                  </Link>
                  <Link to="/" className="btn btn-outline-secondary">
                    Go to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
