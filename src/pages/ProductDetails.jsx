import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MarkdownPreview from "@uiw/react-markdown-preview";
import "@uiw/react-markdown-preview/markdown.css";
import { productAPI, getImageUrl } from "../utils/api";
import { useCart } from "../contexts/CartContext";
import fallbackImage from "../assest/images/product-item1.jpg";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const mainImageRef = useRef(null);
  const [zoomState, setZoomState] = useState({
    isZoomed: false,
    mouseX: 0,
    mouseY: 0,
    bgX: 50,
    bgY: 50,
  });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await productAPI.getById(id);
      setProduct(productData);
      setSelectedImage(0);
    } catch (error) {
      console.error("Error loading product:", error);
      navigate("/shop");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      const success = await addToCart(product, quantity);
      if (success) {
        alert(`${product.title} added to cart!`);
      }
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < (product.stock || 999)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  const handleMouseEnter = () => {
    setZoomState((prev) => ({ ...prev, isZoomed: true }));
  };

  const handleMouseLeave = () => {
    setZoomState((prev) => ({ ...prev, isZoomed: false }));
  };

  const handleMouseMove = (e) => {
    const el = mainImageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setZoomState((prev) => ({
      ...prev,
      mouseX: e.clientX,
      mouseY: e.clientY,
      bgX: percentX,
      bgY: percentY,
    }));
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Build image array with thumbnail first, then all other images
  const imagePaths = [];

  // Add thumbnail image first if it exists
  if (product.thumbnailImage) {
    imagePaths.push(product.thumbnailImage);
  }

  // Add all other product images (excluding thumbnail if it's already in the array)
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      // Only add if it's different from thumbnail to avoid duplicates
      if (img.imageUrl && img.imageUrl !== product.thumbnailImage) {
        imagePaths.push(img.imageUrl);
      }
    });
  }

  // Fallback to default image if no images found
  if (imagePaths.length === 0) {
    imagePaths.push(fallbackImage);
  }

  const images = imagePaths.map((path) => getImageUrl(path));
  const price = parseFloat(product.discountPrice || product.price);
  const originalPrice = product.discountPrice
    ? parseFloat(product.price)
    : null;
  const inStock = product.stock && product.stock > 0;

  return (
    <div className="padding-large">
      <div className="container">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/shop">Shop</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.title}
            </li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-md-6">
            <div className="product-images">
              <div
                ref={mainImageRef}
                className="product-detail-main-image-wrap main-image mb-3 position-relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={images[selectedImage] || images[0]}
                  alt={product.title}
                  className="product-detail-main-image img-fluid w-100"
                  style={{
                    borderRadius: "8px",
                    maxHeight: "500px",
                    objectFit: "contain",
                    pointerEvents: "none",
                  }}
                  onError={(e) => {
                    e.target.src = fallbackImage;
                  }}
                />
              </div>
              {zoomState.isZoomed && (
                <div
                  className="magnifying-glass"
                  style={{
                    position: "fixed",
                    top: zoomState.mouseY,
                    left: zoomState.mouseX,
                    width: "240px",
                    height: "240px",
                    borderRadius: "50%",
                    border: "3px solid rgba(0,0,0,0.15)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    backgroundImage: `url(${images[selectedImage] || images[0]})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "250%",
                    backgroundPosition: `${zoomState.bgX}% ${zoomState.bgY}%`,
                    pointerEvents: "none",
                    zIndex: 1050,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
              {images.length > 1 && (
                <div className="thumbnail-images d-flex gap-2">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className={`product-detail-thumb img-thumbnail ${selectedImage === index ? "border-primary" : ""}`}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedImage(index)}
                      onError={(e) => {
                        e.target.src = fallbackImage;
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <style>{`
                .product-detail-main-image-wrap {
                  overflow: hidden;
                  border-radius: 8px;
                  cursor: crosshair;
                }
                .product-detail-main-image {
                  display: block;
                }
                .product-detail-thumb {
                  transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                .product-detail-thumb:hover {
                  transform: scale(1.1);
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
              `}</style>
          </div>

          <div className="col-md-6">
            <h1
              className="h2 h-md-3 text-uppercase mb-3 fw-bold"
              style={{ fontSize: "clamp(1.5rem, 4vw, 1.25rem)" }}
            >
              {product.title}
            </h1>

            <div className="price-section mb-4">
              <span
                className="h4 text-primary me-3 fw-bold"
                style={{ fontSize: "1.75rem" }}
              >
                {formatPrice(price)}
              </span>
              {originalPrice && (
                <>
                  <span className="text-muted text-decoration-line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="badge bg-danger ms-2">
                    {Math.round(
                      ((originalPrice - price) / originalPrice) * 100,
                    )}
                    % OFF
                  </span>
                  {/* <span> + Free Shipping</span> */}
                </>
              )}
            </div>

            <div className="product-badges mb-4">
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <div className="badge-box">
                    <i className="bi bi-truck badge-icon"></i>
                    <span>Free Shipping</span>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="badge-box">
                    <i className="bi bi-arrow-repeat badge-icon"></i>
                    <span>7-Day Easy Replacement</span>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="badge-box">
                    <i className="bi bi-shield-lock badge-icon"></i>
                    <span>Secure Payments</span>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="badge-box">
                    <i className="bi bi-phone badge-icon"></i>
                    <span>Perfect Fit for iPhone</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Case Details for Mobile Cases */}
            {product.caseDetails && (
              <div className="case-details mb-4">
                <h5 className="mb-3 fw-semibold" style={{ fontSize: "1.1rem" }}>
                  PRODUCT SPECIFICATIONS:
                </h5>
                <div className="card">
                  <div className="card-body">
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <th style={{ width: "150px" }}>Brand</th>
                          <td>{product.caseDetails.brand?.name || "N/A"}</td>
                        </tr>
                        <tr>
                          <th>Model</th>
                          <td>{product.caseDetails.model?.name || "N/A"}</td>
                        </tr>
                        {product.caseDetails.color && (
                          <tr>
                            <th>Color</th>
                            <td className="text-capitalize">
                              {product.caseDetails.color}
                            </td>
                          </tr>
                        )}
                        {product.caseDetails.material && (
                          <tr>
                            <th>Material</th>
                            <td className="text-capitalize">
                              {product.caseDetails.material}
                            </td>
                          </tr>
                        )}
                        {product.caseDetails.caseType && (
                          <tr>
                            <th>Case Type</th>
                            <td>
                              <div className="product-case-type-markdown">
                                <MarkdownPreview
                                  source={product.caseDetails.caseType}
                                  wrapperElement={{
                                    "data-color-mode": "light",
                                  }}
                                  style={{
                                    fontSize: "0.8rem",
                                    lineHeight: "0.8",
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* <div className="stock-info mb-4">
                {inStock ? (
                  <p className="text-success">
                    <strong>In Stock</strong> ({product.stock} available)
                  </p>
                ) : (
                  <p className="text-danger"><strong>Out of Stock</strong></p>
                )}
              </div> */}

            <div className="quantity-section mb-4">
              <label className="form-label">Quantity:</label>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-secondary"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control text-center mx-2"
                  style={{ width: "80px" }}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(
                      Math.min(Math.max(1, val), product.stock || 999),
                    );
                  }}
                  min="1"
                  max={product.stock || 999}
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={increaseQuantity}
                  disabled={!inStock || quantity >= (product.stock || 999)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-buttons d-flex gap-3">
              <button
                className="btn btn-dark btn-lg flex-grow-1"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                <svg className="cart-outline me-2" width="20" height="20">
                  <use xlinkHref="#cart-outline"></use>
                </svg>
                {isInCart(product.id) ? "Update Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <h3 className="mb-4 fw-semibold" style={{ fontSize: "1.5rem" }}>
              PRODUCT DESCRIPTION:
            </h3>

            {product.description && (
              <div className="description mb-4 product-description-markdown">
                <MarkdownPreview
                  source={product.description}
                  className="product-details-markdown"
                  style={{ fontSize: "0.9rem", lineHeight: "1" }}
                  wrapperElement={{ "data-color-mode": "light" }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <h3 className="mb-4 fw-semibold" style={{ fontSize: "1.5rem" }}>
              PRODUCT INFORMATION:
            </h3>
            <div className="card">
              <div className="card-body">
                <table className="table">
                  <tbody>
                    <tr>
                      <th style={{ width: "200px" }}>Category</th>
                      <td className="text-capitalize">
                        {product.category?.name || "N/A"}
                      </td>
                    </tr>
                    {product.sku && (
                      <tr>
                        <th>SKU</th>
                        <td>{product.sku}</td>
                      </tr>
                    )}
                    <tr>
                      <th>Availability</th>
                      <td>{inStock ? "In Stock" : "Out of Stock"}</td>
                    </tr>
                    <tr>
                      <th>Stock Quantity</th>
                      <td>{product.stock || 0} units</td>
                    </tr>
                    <tr>
                      <th>Price</th>
                      <td>{formatPrice(price)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
