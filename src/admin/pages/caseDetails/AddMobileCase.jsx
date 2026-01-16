import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddMobileCase = () => {
  const navigate = useNavigate();

  /* =========================
     DROPDOWN DATA
  ========================== */
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  /* =========================
     FORM STATES
  ========================== */
  const [productId, setProductId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");

  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [caseType, setCaseType] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================
     FETCH PRODUCTS (SAFE)
  ========================== */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://artiststation.co.in/foxecom/api/products"
        );
        const data = await res.json();
        console.log("Product Data : ",data);
        
        // ✅ Normalize to array
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
        setError("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  /* =========================
     FETCH BRANDS (SAFE)
  ========================== */
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(
          "https://artiststation.co.in/foxecom/api/mobile-brands"
        );
        const data = await res.json();

        setBrands(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setBrands([]);
        setError("Failed to load brands");
      }
    };

    fetchBrands();
  }, []);

  /* =========================
     FETCH MODELS (SAFE)
  ========================== */
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch(
          "https://artiststation.co.in/foxecom/api/mobile-models"
        );
        const data = await res.json();

        setModels(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setModels([]);
        setError("Failed to load models");
      }
    };

    fetchModels();
  }, []);

  /* =========================
     SUBMIT CASE DETAILS
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !productId ||
      !brandId ||
      !modelId ||
      !color ||
      !material ||
      !caseType
    ) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        "https://artiststation.co.in/foxecom/api/case-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            brandId,
            modelId,
            color,
            material,
            caseType,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create case details");
      }

      setSuccess("Case details created successfully");

      setTimeout(() => {
        navigate("/admin/mobile-case");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-xl-8 col-lg-9 col-md-10">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Add Case Details</h4>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && (
                <div className="alert alert-success">{success}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* PRODUCT */}
                  <div className="col-md-4">
                    <label className="form-label">Product</label>
                    <select
                      className="form-select"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                    >
                      <option value="">Select Product</option>
                      {Array.isArray(products) &&
                        products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* BRAND */}
                  <div className="col-md-4">
                    <label className="form-label">Brand</label>
                    <select
                      className="form-select"
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                    >
                      <option value="">Select Brand</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* MODEL */}
                  <div className="col-md-4">
                    <label className="form-label">Model</label>
                    <select
                      className="form-select"
                      value={modelId}
                      onChange={(e) => setModelId(e.target.value)}
                    >
                      <option value="">Select Model</option>
                      {models.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* COLOR */}
                  <div className="col-md-4">
                    <label className="form-label">Color</label>
                    <input
                      className="form-control"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </div>

                  {/* MATERIAL */}
                  <div className="col-md-4">
                    <label className="form-label">Material</label>
                    <input
                      className="form-control"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                    />
                  </div>

                  {/* CASE TYPE */}
                  <div className="col-md-4">
                    <label className="form-label">Case Type</label>
                    <input
                      className="form-control"
                      value={caseType}
                      onChange={(e) => setCaseType(e.target.value)}
                    />
                  </div>
                </div>

                <div className="text-end mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Create Case Details"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMobileCase;
