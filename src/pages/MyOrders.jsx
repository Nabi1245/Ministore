import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { orderAPI, getImageUrl } from '../utils/api'

const MyOrders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  })
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [pagination.page, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      }
      if (statusFilter) {
        params.status = statusFilter
      }
      const data = await orderAPI.getAll(params)
      setOrders(data.orders || [])
      setPagination((prev) => ({
        ...prev,
        totalPages: data.pagination?.totalPages || 1,
        total: data.pagination?.totalItems || 0,
      }))
    } catch (err) {
      console.error('Error fetching orders:', err)
      if (err.isTokenError) {
        navigate('/login')
      } else {
        setError('Failed to load orders')
      }
    } finally {
      setLoading(false)
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    try {
      await orderAPI.cancel(orderId)
      alert('Order cancelled successfully')
      fetchOrders()
    } catch (err) {
      console.error('Error cancelling order:', err)
      alert(err.message || 'Failed to cancel order')
    }
  }

  if (loading && orders.length === 0) {
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

  return (
    <div className="padding-large">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 h-md-3 text-uppercase fw-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>My Orders</h1>
          <Link to="/shop" className="btn btn-outline-primary">
            Continue Shopping
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Filter */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-6">
                <label className="form-label">Filter by Status:</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setPagination((prev) => ({ ...prev, page: 1 }))
                  }}
                >
                  <option value="">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="col-md-6 text-end">
                <p className="mb-0 text-muted">
                  Total Orders: <strong>{pagination.total}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <h5 className="text-muted fw-semibold" style={{ fontSize: '1.1rem' }}>No orders found</h5>
                <p className="text-muted" style={{ fontSize: '0.95rem' }}>You haven't placed any orders yet.</p>
              <Link to="/shop" className="btn btn-primary">
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <>
            {orders.map((order) => (
              <div key={order.id} className="card mb-4">
                <div className="card-header bg-light">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h5 className="mb-0">
                        Order #{order.id}
                        <span className={`badge bg-${getStatusBadge(order.status)} ms-2`}>
                          {order.status?.toUpperCase()}
                        </span>
                      </h5>
                    </div>
                    <div className="col-md-6 text-end">
                      <small className="text-muted">
                        Placed on {formatDate(order.createdAt)}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      {order.orderItems && order.orderItems.length > 0 && (
                        <div className="mb-3">
                          {order.orderItems.slice(0, 3).map((item) => (
                            <div key={item.id} className="d-flex align-items-center mb-2">
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
                                <br />
                                <small className="text-muted">
                                  Qty: {item.quantity} × {formatCurrency(item.priceAtPurchase)}
                                </small>
                              </div>
                            </div>
                          ))}
                          {order.orderItems.length > 3 && (
                            <p className="text-muted small mb-0">
                              +{order.orderItems.length - 3} more item(s)
                            </p>
                          )}
                        </div>
                      )}
                      <div>
                        <strong>Shipping Address:</strong>
                        <p className="mb-0 text-muted small">
                          {order.fullAddress}, {order.townOrCity}, {order.state} - {order.pinCode}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 text-end">
                      <div className="mb-3">
                        <h4 className="text-primary mb-0">
                          {formatCurrency(order.totalAmount)}
                        </h4>
                        <small className="text-muted">
                          {order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0} item(s)
                        </small>
                      </div>
                      <div className="d-grid gap-2">
                        <Link
                          to={`/order-success/${order.id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View Details
                        </Link>
                        {order.status === 'pending' && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancel Order
                          </button>
                        )}
                        {order.status === 'shipped' && order.shipmentId && (
                          <Link
                            to={`/order/${order.id}/track`}
                            className="btn btn-outline-info btn-sm"
                          >
                            Track Order
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {pagination.totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div>
                  Showing page {pagination.page} of {pagination.totalPages} (
                  {pagination.total} total orders)
                </div>
                <div className="btn-group">
                  <button
                    className="btn btn-outline-primary"
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MyOrders
