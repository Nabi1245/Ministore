import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { orderAPI } from '../utils/api'

const TrackOrder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [trackingData, setTrackingData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadOrderAndTracking()
    }
  }, [id])

  const loadOrderAndTracking = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load order details
      const orderData = await orderAPI.getById(id)
      setOrder(orderData.order || orderData)

      // Try to load tracking if shipment exists
      const order = orderData.order || orderData
      if (order.shipmentId) {
        try {
          const tracking = await orderAPI.trackOrder(id)
          setTrackingData(tracking.tracking || tracking)
        } catch (trackError) {
          console.error('Tracking not available:', trackError)
          // Tracking might not be available yet, that's okay
        }
      }
    } catch (err) {
      console.error('Error loading order:', err)
      if (err.isTokenError) {
        navigate('/login')
      } else {
        setError('Failed to load order details')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
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
              <Link to="/my-orders" className="btn btn-primary">View My Orders</Link>
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
          <h1 className="h2 h-md-3 text-uppercase fw-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Track Order</h1>
          <Link to="/my-orders" className="btn btn-outline-secondary">
            Back to Orders
          </Link>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.1rem' }}>Order Information</h5>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Order ID:</strong> #{order.id}
                  </div>
                  <div className="col-md-6">
                    <strong>Status:</strong>{' '}
                    <span className={`badge bg-${getStatusBadge(order.status)}`}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <strong>Order Date:</strong> {formatDate(order.createdAt)}
                  </div>
                  {order.shipmentId && (
                    <div className="col-md-6">
                      <strong>Shipment ID:</strong> {order.shipmentId}
                    </div>
                  )}
                </div>
                {order.awbCode && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <strong>AWB Code:</strong> {order.awbCode}
                    </div>
                  </div>
                )}
                {order.courierName && (
                  <div className="row">
                    <div className="col-12">
                      <strong>Courier:</strong> {order.courierName}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!order.shipmentId ? (
              <div className="alert alert-info">
                <strong>Tracking Information:</strong> Shipment has not been created yet. 
                Please check back later or contact support.
              </div>
            ) : trackingData ? (
              <div className="card">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Tracking Details</h5>
                </div>
                <div className="card-body">
                  {/* Tracking timeline would go here */}
                  <p className="text-muted">Tracking information will be displayed here once available.</p>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning">
                <strong>Tracking Information:</strong> Tracking details are not available yet. 
                Please check back later.
              </div>
            )}
          </div>

          <div className="col-lg-4">
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
                <p className="mb-0">{order.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrder
