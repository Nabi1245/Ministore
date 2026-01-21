import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductsDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     FETCH PRODUCTS
  ========================== */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          "https://artiststation.co.in/foxecom/api/products"
        );

        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        const data = await res.json();

        // ✅ Ensure array
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h4 className="mb-2 mb-md-0 text-uppercase">PRODUCTS</h4>
        <Link to={"/admin/products/add"} className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      {/* Content Card */}
      <div className="card shadow-sm">
        <div className="card-body p-3 p-md-4">
          {/* Loading */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
              <p className="mt-3 mb-0 text-muted">Loading products...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="alert alert-danger mb-0">{error}</div>
          )}

          {/* Empty */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-5 text-muted">
              No products found
            </div>
          )}

          {/* Products Table */}
          {!loading && !error && products.length > 0 && (
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "60px" }}>#</th>
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Stock</th>
                    <th>Created</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>

                      <td>
                        <img
                          src={`https://artiststation.co.in/foxecom${product.thumbnailImage}`}
                          alt={product.title}
                          width="50"
                          height="50"
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                      </td>

                      <td className="fw-medium">{product.title}</td>

                      <td>{product.category?.name || "-"}</td>

                      <td>₹{product.price}</td>

                      <td>₹{product.discountPrice}</td>

                      <td>{product.stock}</td>

                      <td className="text-muted">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>

                      <td className="text-center">
                        <Link
                          to={`/admin/products/view/${product.id}`} 
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          View
                        </Link>

                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsDashboard;
