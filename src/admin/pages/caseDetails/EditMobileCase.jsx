import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { caseDetailsAPI, productAPI, mobileBrandAPI, mobileModelAPI, adminAPI } from "../../../utils/api";

const EditMobileCase = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  const [productId, setProductId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [caseType, setCaseType] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (brandId) {
      fetchModels(brandId);
    } else {
      setModels([]);
    }
  }, [brandId]);

  const fetchData = async () => {
    try {
      setFetching(true);
      const [caseData, productsData, brandsData] = await Promise.all([
        caseDetailsAPI.getById(id),
        productAPI.getAll(),
        mobileBrandAPI.getAll(),
      ]);

      const caseDetail = caseData.caseDetail || caseData;
      setProductId(caseDetail.productId || "");
      setBrandId(caseDetail.brandId || "");
      setModelId(caseDetail.modelId || "");
      setColor(caseDetail.color || "");
      setMaterial(caseDetail.material || "");
      setCaseType(caseDetail.caseType || "");

      setProducts(Array.isArray(productsData) ? productsData : productsData.products || []);
      setBrands(Array.isArray(brandsData) ? brandsData : brandsData.data || []);

      if (caseDetail.brandId) {
        await fetchModels(caseDetail.brandId);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load case details");
    } finally {
      setFetching(false);
    }
  };

  const fetchModels = async (selectedBrandId) => {
    try {
      const modelsData = await mobileModelAPI.getAll();
      const allModels = Array.isArray(modelsData) ? modelsData : modelsData.data || [];
      const filteredModels = allModels.filter(model => model.brandId === parseInt(selectedBrandId));
      setModels(filteredModels);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !brandId || !modelId) {
      setError("Product, Brand, and Model are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await adminAPI.updateCaseDetail(id, {
        productId: parseInt(productId),
        brandId: parseInt(brandId),
        modelId: parseInt(modelId),
        color: color || null,
        material: material || null,
        caseType: caseType || null,
      });

      setSuccess("Case details updated successfully");
      setTimeout(() => {
        navigate("/admin/mobile-case");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update case details");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Edit Mobile Case Details</h4>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/mobile-case")}
        >
          Back to Mobile Cases
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="productId" className="form-label">
                Product *
              </label>
              <select
                className="form-select"
                id="productId"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="brandId" className="form-label">
                Brand *
              </label>
              <select
                className="form-select"
                id="brandId"
                value={brandId}
                onChange={(e) => {
                  setBrandId(e.target.value);
                  setModelId("");
                }}
                required
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="modelId" className="form-label">
                Model *
              </label>
              <select
                className="form-select"
                id="modelId"
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                required
                disabled={!brandId || models.length === 0}
              >
                <option value="">Select a model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="color" className="form-label">
                Color
              </label>
              <input
                type="text"
                className="form-control"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="material" className="form-label">
                Material
              </label>
              <input
                type="text"
                className="form-control"
                id="material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="caseType" className="form-label">
                Case Type
              </label>
              <div data-color-mode="light">
                <MDEditor
                  value={caseType}
                  onChange={(val) => setCaseType(val || "")}
                  preview="edit"
                  height={180}
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Case Details"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/admin/mobile-case")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMobileCase;
