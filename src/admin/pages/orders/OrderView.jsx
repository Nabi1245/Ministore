import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminAPI, getImageUrl } from "../../../utils/api";

const OrderView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: "",
    shiprocketOrderId: "",
    shipmentId: "",
    awbCode: "",
    courierName: "",
    shipmentStatus: ""
  });

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (order) {
      setStatusForm({
        status: order.status || "",
        shiprocketOrderId: order.shiprocketOrderId || "",
        shipmentId: order.shipmentId || "",
        awbCode: order.awbCode || "",
        courierName: order.courierName || "",
        shipmentStatus: order.shipmentStatus || ""
      });
    }
  }, [order]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      const data = await adminAPI.getOrderById(id);
      setOrder(data.data || data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    
    if (!window.confirm("Are you sure you want to update the order status?")) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");
      setSuccessMessage("");
      
      const updateData = {};
      if (statusForm.status) updateData.status = statusForm.status;
      if (statusForm.shiprocketOrderId) updateData.shiprocketOrderId = statusForm.shiprocketOrderId;
      if (statusForm.shipmentId) updateData.shipmentId = statusForm.shipmentId;
      if (statusForm.awbCode) updateData.awbCode = statusForm.awbCode;
      if (statusForm.courierName) updateData.courierName = statusForm.courierName;
      if (statusForm.shipmentStatus) updateData.shipmentStatus = statusForm.shipmentStatus;

      const result = await adminAPI.updateOrderStatus(id, updateData);
      setSuccessMessage("Order status updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Refresh order data
      await fetchOrder();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update order status");
      setTimeout(() => setError(""), 5000);
    } finally {
      setUpdatingStatus(false);
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

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage("")}
          ></button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      <div className="row g-4">
        {/* Order Status Update Form */}
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Update Order Status</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleStatusUpdate}>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Order Status *</label>
                    <select
                      className="form-select"
                      value={statusForm.status}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Shiprocket Order ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={statusForm.shiprocketOrderId}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, shiprocketOrderId: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Shipment ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={statusForm.shipmentId}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, shipmentId: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">AWB Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={statusForm.awbCode}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, awbCode: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Courier Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={statusForm.courierName}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, courierName: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Shipment Status</label>
                    <input
                      type="text"
                      className="form-control"
                      value={statusForm.shipmentStatus}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, shipmentStatus: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="col-md-12">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updatingStatus || !statusForm.status}
                    >
                      {updatingStatus ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

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
                  {order.status?.toUpperCase()}
                </span>
              </p>
              <p>
                <strong>Total Amount:</strong> {formatCurrency(order.totalAmount)}
              </p>
              <p>
                <strong>Order Date:</strong> {formatDate(order.createdAt)}
              </p>
              {order.payuTxnId && (
                <p>
                  <strong>PayU Transaction ID:</strong> {order.payuTxnId}
                </p>
              )}
              {order.payuPaymentId && (
                <p>
                  <strong>Payment ID:</strong> {order.payuPaymentId}
                </p>
              )}
              {order.shiprocketOrderId && (
                <p>
                  <strong>Shiprocket Order ID:</strong> {order.shiprocketOrderId}
                </p>
              )}
              {order.shipmentId && (
                <p>
                  <strong>Shipment ID:</strong> {order.shipmentId}
                </p>
              )}
              {order.awbCode && (
                <p>
                  <strong>AWB Code:</strong> {order.awbCode}
                </p>
              )}
              {order.courierName && (
                <p>
                  <strong>Courier:</strong> {order.courierName}
                </p>
              )}
              {order.shipmentStatus && (
                <p>
                  <strong>Shipment Status:</strong>{" "}
                  <span className="badge bg-info">{order.shipmentStatus}</span>
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
