import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddMobileModel = () => {
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [brandId, setBrandId] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ==========================
     FETCH BRANDS
  ========================== */
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(
          "https://artiststation.co.in/foxecom/api/mobile-brands",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setBrands(data);
        } else {
          throw new Error("Failed to load brands");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load brands");
      }
    };

    fetchBrands();
  }, []);

  /* ==========================
     CREATE MODEL
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brandId || !name) {
      setError("Brand and Model name are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        "https://artiststation.co.in/foxecom/api/mobile-models",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            brandId,
            name,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create model");
      }

      setSuccess("Mobile model created successfully");

      setTimeout(() => {
        navigate("/admin/mobile-model");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add Mobile Model</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* BRAND DROPDOWN */}
        <div className="mb-3">
          <label className="form-label">Select Brand</label>
          <select
            className="form-select"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
          >
            <option value="">-- Select Brand --</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* MODEL NAME */}
        <div className="mb-3">
          <label className="form-label">Model Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter model name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Model"}
        </button>
      </form>
    </div>
  );
};

export default AddMobileModel;
