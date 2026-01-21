import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const MobileBrandDetails = () => {
  const { id } = useParams(); // 👈 brand id from URL
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await fetch(
          `https://artiststation.co.in/foxecom/api/mobile-brands/${id}`
        );

        if (!res.ok) {
          throw new Error("Brand not found");
        }

        const data = await res.json();
        setBrand(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id]);

  if (loading) {
    return <div className="text-center py-4">Loading brand...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
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
               <div className="container-fluid">
      {/* Back */}
      <div className="mb-3">
        <Link to="/admin/mobile-brand" className="btn btn-light">
          ← Back to Brands
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="fw-bold mb-3">Brand Details</h4>

          <table className="table table-bordered">
            <tbody>
              <tr>
                <th style={{ width: "200px" }}>Brand ID</th>
                <td>{brand.id}</td>
              </tr>

              <tr>
                <th>Brand Name</th>
                <td>{brand.name}</td>
              </tr>

              <tr>
                <th>Created At</th>
                <td>
                  {new Date(brand.createdAt).toLocaleDateString()}
                </td>
              </tr>

              <tr>
                <th>Last Updated</th>
                <td>
                  {new Date(brand.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
          </div>
        </>
  )
}

export default MobileBrandDetails