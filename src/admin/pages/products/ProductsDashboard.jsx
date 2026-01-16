import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const ProductsDashboard = () => {

      const [categories, setCategories] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState("");
    
      useEffect(() => {
        fetchCategories();
      }, []);
    
      const fetchCategories = async () => {
        try {
          setLoading(true);
          setError("");
    
          const res = await fetch(
            "https://artiststation.co.in/foxecom/api/products",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (!res.ok) throw new Error("Failed to fetch categories");
    
          const data = await res.json();
          setCategories(data || []);
        } catch (err) {
          console.error(err);
          setError("Unable to load categories");
        } finally {
          setLoading(false);
        }
      };


  return (
     <>
          {/* Page Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
            <h4 className="mb-2 mb-md-0 text-uppercase">PRODUCTS</h4>
            <Link to={"/admin/products/add"} className="btn btn-primary">
              + Add PRODUCT
            </Link>
          </div>
    
          {/* Content Card */}
          <div className="card shadow-sm">
            <div className="card-body p-3 p-md-4">
              {/* Loading */}
              {loading && (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" />
                  <p className="mt-3 mb-0 text-muted">Loading categories...</p>
                </div>
              )}
    
              {/* Error */}
              {!loading && error && (
                <div className="alert alert-danger mb-0">{error}</div>
              )}
    
              {/* Empty */}
              {!loading && !error && categories.length === 0 && (
                <div className="text-center py-5 text-muted">
                  No categories found
                </div>
              )}
    
              {/* Table */}
              {!loading && !error && categories.length > 0 && (
                <div className="table-responsive">
                  <table className="table align-middle table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "60px" }}>#</th>
                        <th>Brand Name</th>
                        <th>Creation Date</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
    
                    <tbody>
                      {categories.map((cat, index) => (
                        <tr key={cat.id}>
                          <td>{index + 1}</td>
                          <td className="fw-medium">{cat.name}</td>
                          
                          <td className="text-muted">
                            {new Date(cat.createdAt).toLocaleDateString()}
                          </td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-primary me-2">
                              View
                            </button>
                            <button className="btn btn-sm btn-outline-secondary">
                              Edit
                            </button>
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
  )
}

export default ProductsDashboard;