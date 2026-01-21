import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MobileBrandDashboard = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     FETCH BRANDS
  ========================== */
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          "https://artiststation.co.in/foxecom/api/mobile-brands"
        );

        if (!res.ok) {
          throw new Error("Failed to load brands");
        }

        const data = await res.json();

        // ensure array
        setBrands(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Unable to load brands");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);
  return (
    <>
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h4 className="mb-2 mb-md-0 text-uppercase">Brands</h4>
        <Link to={"/admin/mobile-brand/add"} className="btn btn-primary">
          + Add Brand
        </Link>
      </div>

      {/* Content Card */}
      <div className="card shadow-sm">
        <div className="card-body p-3 p-md-4">
          {/* Loading */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
              <p className="mt-3 mb-0 text-muted">Loading brands...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="alert alert-danger mb-0">{error}</div>
          )}

          {/* Empty */}
          {!loading && !error && brands.length === 0 && (
            <div className="text-center py-5 text-muted">
              No brands found
            </div>
          )}

          {/* Table */}
          {!loading && !error && brands.length > 0 && (
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
                  {brands.map((brand, index) => (
                    <tr key={brand.id}>
                      <td>{index + 1}</td>
                      <td className="fw-medium">{brand.name}</td>
                      
                      <td className="text-muted">
                        {new Date(brand.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-center">
                        <Link 
                        to={`/admin/mobile-brand/details/${brand.id}`}
                        className="btn btn-sm btn-outline-primary me-2"
                        >
                          View
                        </Link>
                        <Link 
                        to={`/admin/mobile-brand/edit/${brand.id}`}
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

export default MobileBrandDashboard;
