import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminAPI } from "../../../utils/api";

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, [pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminAPI.getAllOrders({
        page: pagination.page,
        limit: pagination.limit,
      });
      setOrders(data.data || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      }));
    } catch (err) {
      console.error(err);
      setError("Unable to load orders");
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
    return new Date(dateString).toLocaleDateString();
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

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h4 className="mb-2 mb-md-0">Orders Management</h4>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          {orders.length === 0 ? (
            <p className="text-center text-muted">No orders found</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>User Email</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.user?.email || "N/A"}</td>
                        <td>{formatCurrency(order.totalAmount)}</td>
                        <td>
                          <span
                            className={`badge bg-${getStatusBadge(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>
                          <Link
                            to={`/admin/orders/view/${order.id}`}
                            className="btn btn-sm btn-primary"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
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
    </div>
  );
};

export default OrdersDashboard;
