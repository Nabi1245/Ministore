import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mobileBrandAPI, mobileModelAPI } from "../utils/api";

const BrandNavBar = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openBrandId, setOpenBrandId] = useState(null);
  const [modelsCache, setModelsCache] = useState({});
  const [loadingModels, setLoadingModels] = useState(false);
  const hideTimeoutRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await mobileBrandAPI.getAll({ limit: 100 });
        const list = data?.brands ?? (Array.isArray(data) ? data : []);
        if (!cancelled) setBrands(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!cancelled) setBrands([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const fetchModels = useCallback(async (brandId) => {
    if (modelsCache[brandId]) return;
    setLoadingModels(true);
    try {
      const data = await mobileModelAPI.getAll({ brandId, limit: 100 });
      const list = data?.models ?? (Array.isArray(data) ? data : []);
      setModelsCache((prev) => ({
        ...prev,
        [brandId]: Array.isArray(list) ? list : [],
      }));
    } catch (e) {
      setModelsCache((prev) => ({ ...prev, [brandId]: [] }));
    } finally {
      setLoadingModels(false);
    }
  }, [modelsCache]);

  const handleBrandMouseEnter = (brandId) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setOpenBrandId(brandId);
    fetchModels(brandId);
  };

  const handleBrandMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => setOpenBrandId(null), 150);
  };

  const handleDropdownMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => setOpenBrandId(null), 150);
  };

  const handleModelClick = (modelId) => {
    setOpenBrandId(null);
    navigate(`/shop?modelId=${modelId}`);
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <div ref={barRef} className="brand-nav-bar border-bottom bg-white">
      <div className="container-xxl">
        <nav className="brand-nav d-flex align-items-center flex-nowrap overflow-auto py-2 gap-1 gap-md-2">
          <Link
            className="brand-nav-link text-uppercase text-dark text-decoration-none px-2 px-md-3 py-1"
            to="/"
          >
            Home
          </Link>
          <Link
            className="brand-nav-link text-uppercase text-dark text-decoration-none px-2 px-md-3 py-1"
            to="/shop"
          >
            Shop
          </Link>
          {brands.map((brand) => {
            const brandId = brand.id ?? brand.brandId;
            const name = (brand.name || "").trim() || "Brand";
            const isOpen = openBrandId === brandId;
            const models = modelsCache[brandId] || [];
            return (
              <div
                key={brandId}
                className="brand-nav-item position-relative d-inline-block"
                onMouseEnter={() => handleBrandMouseEnter(brandId)}
                onMouseLeave={handleBrandMouseLeave}
              >
                <Link
                  className={`brand-nav-link text-uppercase text-dark text-decoration-none px-2 px-md-3 py-1 d-inline-block ${isOpen ? "brand-nav-link-active" : ""}`}
                  to={`/shop?brandId=${brandId}`}
                  onClick={() => setOpenBrandId(null)}
                >
                  {name}
                </Link>
                {isOpen && (
                  <div
                    className="brand-dropdown position-absolute start-0 top-100 mt-0 shadow bg-white border border-light rounded-0 py-2 min-w-200 z-3"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    {loadingModels && !models.length ? (
                      <div className="px-3 py-2 small text-muted">Loading...</div>
                    ) : models.length === 0 ? (
                      <div className="px-3 py-2 small text-muted">No models</div>
                    ) : (
                      <ul className="list-unstyled mb-0">
                        {models.map((model) => {
                          const modelId = model.id ?? model.modelId;
                          const modelName = (model.name || "").trim() || "Model";
                          return (
                            <li key={modelId}>
                              <button
                                type="button"
                                className="brand-dropdown-item w-100 text-start text-uppercase text-dark border-0 bg-transparent px-3 py-2 small"
                                onClick={() => handleModelClick(modelId)}
                              >
                                {modelName}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <Link
            className="brand-nav-link text-uppercase text-dark text-decoration-none px-2 px-md-3 py-1 ms-auto"
            to="/my-orders"
          >
            Track Order
          </Link>
        </nav>
      </div>
      <style>{`
        .brand-nav-bar { font-size: 0.8rem; }
        .brand-nav { min-height: 40px; scrollbar-width: thin; }
        .brand-nav::-webkit-scrollbar { height: 4px; }
        .brand-nav::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 2px; }
        .brand-nav-link { white-space: nowrap; transition: background 0.15s ease; }
        .brand-nav-link:hover, .brand-nav-link-active { background: #f0f0f0; }
        .brand-dropdown { max-height: 70vh; overflow-y: auto; }
        .brand-dropdown-item:hover { background: #f8f9fa; }
        .min-w-200 { min-width: 200px; }
        @media (min-width: 768px) {
          .brand-nav-bar { font-size: 0.85rem; }
        }
      `}</style>
    </div>
  );
};

export default BrandNavBar;
