import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminAPI, getImageUrl } from "../../../utils/api";

const OrderView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminAPI.getOrderById(id);
      setOrder(data.data || data);
    } catch (err) {
      console.error(err);
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "warning",
      paid: "info",
      processing: "primary",
      shipped: "success",
      delivered: "success",
      cancelled: "danger",
    };
    return statusColors[status] || "secondary";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="alert alert-danger">
        {error || "Order not found"}
        <button
          className="btn btn-sm btn-outline-danger ms-2"
          onClick={() => navigate("/admin/orders")}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Order Details - #{order.id}</h4>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/orders")}
        >
          Back to Orders
        </button>
      </div>

      <div className="row g-4">
        {/* Order Information */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Information</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Order ID:</strong> #{order.id}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`badge bg-${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </p>
              <p>
                <strong>Total Amount:</strong> {formatCurrency(order.totalAmount)}
              </p>
              <p>
                <strong>Order Date:</strong> {formatDate(order.createdAt)}
              </p>
              {order.razorpayOrderId && (
                <p>
                  <strong>Razorpay Order ID:</strong> {order.razorpayOrderId}
                </p>
              )}
              {order.razorpayPaymentId && (
                <p>
                  <strong>Payment ID:</strong> {order.razorpayPaymentId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Customer Information</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>User Email:</strong> {order.user?.email || order.emailAddress}
              </p>
              <p>
                <strong>Name:</strong> {order.firstName} {order.lastName}
              </p>
              <p>
                <strong>Mobile:</strong> {order.mobileNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Shipping Address</h5>
            </div>
            <div className="card-body">
              <p>
                {order.fullAddress}, {order.townOrCity}
              </p>
              <p>
                {order.state}, {order.country} - {order.pinCode}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Items</h5>
            </div>
            <div className="card-body">
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
                    {order.orderItems?.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {item.product?.images?.[0] && (
                              <img
                                src={getImageUrl(item.product.images[0].imageUrl)}
                                alt={item.product.title}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  marginRight: "10px",
                                }}
                              />
                            )}
                            <div>
                              <strong>{item.product?.title || "Product"}</strong>
                            </div>
                          </div>
                        </td>
                        <td>{formatCurrency(item.priceAtPurchase)}</td>
                        <td>{item.quantity}</td>
                        <td>
                          {formatCurrency(
                            item.priceAtPurchase * item.quantity
                          )}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderView;
