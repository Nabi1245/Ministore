import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MobileCase = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = "https://artiststation.co.in/foxecom";

  /* =========================
         FETCH CASE DETAILS
      ========================== */
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch(
          "https://artiststation.co.in/foxecom/api/case-details",
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error("Failed to load case details");
        }

        // API already returns array
        setCases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch case details");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h4 className="mb-2 mb-md-0 text-uppercase">MOBILE CASES</h4>
        <Link to={"/admin/mobile-case/add"} className="btn btn-primary">
          + Add CASES
        </Link>
      </div>

      <div className="container-fluid py-4">
        <h4 className="fw-bold mb-3">Mobile Case Details</h4>

        <div className="row g-3">
          {cases.map((item) => (
            <div key={item.id} className="col-xl-4 col-lg-6">
              <div className="card h-100 shadow-sm border-0">
                {/* PRODUCT THUMBNAIL */}
                {item.product?.thumbnailImage && (
                  <img
                    src={`${BASE_URL}${item.product.thumbnailImage}`}
                    alt={item.product.title}
                    className="card-img-top"
                    style={{ height: 200, objectFit: "cover" }}
                  />
                )}

                <div className="card-body">
                  <h6 className="fw-bold mb-2">{item.product?.title}</h6>

                  <p className="mb-1">
                    <strong>Brand:</strong> {item.brand?.name}
                  </p>

                  <p className="mb-1">
                    <strong>Model:</strong> {item.model?.name}
                  </p>

                  <p className="mb-1">
                    <strong>Color:</strong> {item.color}
                  </p>

                  <p className="mb-1">
                    <strong>Material:</strong> {item.material}
                  </p>

                  <p className="mb-0">
                    <strong>Case Type:</strong> {item.caseType}
                  </p>
                </div>

                <div className="card-footer bg-light small text-muted">
                  Price: ₹{item.product?.price} &nbsp;|&nbsp; Stock:{" "}
                  {item.product?.stock}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileCase;
