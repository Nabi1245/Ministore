import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MarkdownPreview from "@uiw/react-markdown-preview";
import "@uiw/react-markdown-preview/markdown.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import { productAPI, getImageUrl, reviewAPI } from "../utils/api";
import { useCart } from "../contexts/CartContext";
import SimilarProducts from "../components/SimilarProducts";
import fallbackImage from "../assest/images/product-item1.jpg";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, buyNow } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const mainImageRef = useRef(null);
  const scrollWrapRef = useRef(null);
  const accordionRef = useRef(null);
  const layoutRowRef = useRef(null);
  const [zoomState, setZoomState] = useState({
    isZoomed: false,
    mouseX: 0,
    mouseY: 0,
    bgX: 50,
    bgY: 50,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Review state
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (id) {
      loadReviews();
      if (isLoggedIn) checkCanReview();
    }
  }, [id, isLoggedIn]);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll accordion into view when opened
  useEffect(() => {
    const accordionElement = accordionRef.current;
    const scrollContainer = scrollWrapRef.current;
    
    if (!accordionElement || !scrollContainer) return;

    const handleAccordionOpen = (e) => {
      // Check if it's the description accordion (by checking the collapse element)
      const collapseElement = document.getElementById('collapseDescription');
      if (!collapseElement) return;

      // Wait for Bootstrap animation to complete
      setTimeout(() => {
        if (scrollContainer && accordionElement) {
          // Get the accordion section position relative to scroll container
          const accordionRect = accordionElement.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();
          
          // Calculate positions
          const accordionTop = accordionElement.offsetTop;
          const scrollTop = scrollContainer.scrollTop;
          const containerHeight = scrollContainer.clientHeight;
          
          // Check if accordion is visible in viewport
          const accordionVisibleTop = accordionTop - scrollTop;
          const accordionVisibleBottom = accordionVisibleTop + accordionElement.offsetHeight;
          
          // If accordion is not fully visible or partially hidden, scroll it into view
          if (accordionVisibleTop < 0 || accordionVisibleBottom > containerHeight - 20) {
            scrollContainer.scrollTo({
              top: Math.max(0, accordionTop - 30), // 30px padding from top
              behavior: 'smooth'
            });
          }
        }
      }, 150); // Delay to allow Bootstrap animation to start
    };

    // Listen for Bootstrap collapse shown event on the accordion container
    const collapseElement = document.getElementById('collapseDescription');
    if (collapseElement) {
      collapseElement.addEventListener('shown.bs.collapse', handleAccordionOpen);
      
      return () => {
        collapseElement.removeEventListener('shown.bs.collapse', handleAccordionOpen);
      };
    }
  }, [product]);

  // Scroll lock: right column must be fully scrolled before page scrolls below (laptop only)
  useEffect(() => {
    const scrollContainer = scrollWrapRef.current;
    const layoutRow = layoutRowRef.current;
    if (!scrollContainer || !layoutRow) return;

    // Higher scroll speed for laptop mouse - feels more natural
    const SCROLL_SPEED = 12;

    const handleWheel = (e) => {
      if (window.innerWidth < 768) return;

      // Check if product detail row is in viewport
      const rowRect = layoutRow.getBoundingClientRect();
      const rowInView = rowRect.top < window.innerHeight && rowRect.bottom > 0;
      if (!rowInView) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const canScrollDown = scrollTop + clientHeight < scrollHeight - 1;
      const canScrollUp = scrollTop > 1;
      const pageScrolledDown = window.scrollY > 5;

      // Calculate scroll delta with speed multiplier
      const delta = e.deltaY * SCROLL_SPEED;

      if (e.deltaY > 0) {
        // Scrolling down: scroll right column first (works from anywhere including left side)
        if (canScrollDown) {
          e.preventDefault();
          e.stopPropagation();
          const newScrollTop = Math.min(scrollTop + delta, scrollHeight - clientHeight);
          scrollContainer.scrollTop = newScrollTop;
        }
      } else if (e.deltaY < 0) {
        // Scrolling up: if page is scrolled, let page scroll first; else scroll right column
        if (pageScrolledDown) {
          // Page is scrolled down, let it scroll up naturally
          return;
        }
        if (canScrollUp) {
          e.preventDefault();
          e.stopPropagation();
          const newScrollTop = Math.max(scrollTop + delta, 0);
          scrollContainer.scrollTop = newScrollTop;
        }
      }
    };

    // Listen on window to catch scroll events from anywhere (including left side)
    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    
    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
    };
  }, [product]);

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

  const handleBuyNow = async () => {
    if (!product || !inStock) return;
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to proceed with Buy Now');
      localStorage.setItem('redirectAfterLogin', `/product/${product.id}`);
      navigate('/login');
      return;
    }

    const success = await buyNow(product, quantity);
    if (success) {
      navigate('/checkout');
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
    // Only enable zoom on desktop
    if (!isMobile) {
      setZoomState((prev) => ({ ...prev, isZoomed: true }));
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setZoomState((prev) => ({ ...prev, isZoomed: false }));
    }
  };

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const data = await reviewAPI.getByProduct(id);
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
    } catch (err) {
      console.error("Error loading reviews:", err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const checkCanReview = async () => {
    try {
      const data = await reviewAPI.canReview(id);
      setCanReview(data.canReview);
      if (data.existingReview) {
        setExistingReview(data.existingReview);
        setRating(data.existingReview.rating);
        setReviewText(data.existingReview.reviewText || "");
      }
    } catch (err) {
      setCanReview(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) return;
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      setSubmittingReview(true);
      const data = await reviewAPI.create(id, rating, reviewText);
      setExistingReview({ rating, reviewText });
      await loadReviews();
    } catch (err) {
      alert(err?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const maskEmail = (email) => {
    if (!email) return "Anonymous";
    const [local, domain] = email.split("@");
    if (!domain) return "***";
    const masked = local?.slice(0, 2) + "***";
    return `${masked}@${domain}`;
  };

  const handleMouseMove = (e) => {
    // Only enable zoom on desktop
    if (isMobile) return;
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
        <nav aria-label="breadcrumb" className="mb-4 d-none d-md-block">
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

        <div className="row product-detail-layout-row" ref={layoutRowRef}>
          <div className="col-md-6 product-images-col">
            <div className="product-images">
              {/* Mobile: Swiper Gallery with Touch/Swipe */}
              {isMobile ? (
                <div className="product-swiper-mobile">
                  <Swiper
                    key={`swiper-${product?.id}-${images.length}`}
                    modules={[Navigation, Pagination, Zoom]}
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation={images.length > 1}
                    pagination={{ clickable: true }}
                    zoom={{
                      maxRatio: 3,
                      minRatio: 1,
                    }}
                    className="product-detail-swiper"
                    onSlideChange={(swiper) => setSelectedImage(swiper.activeIndex)}
                    initialSlide={selectedImage}
                  >
                    {images.map((img, index) => (
                      <SwiperSlide key={index}>
                        <div className="swiper-zoom-container">
                          <img
                            src={img}
                            alt={`${product.title} ${index + 1}`}
                            className="img-fluid w-100"
                            style={{
                              borderRadius: "8px",
                              objectFit: "contain",
                              maxHeight: "500px",
                            }}
                            onError={(e) => {
                              e.target.src = fallbackImage;
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <>
                  {/* Desktop: Main Image with Zoom */}
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
                  {/* Desktop: Thumbnails */}
                  {images.length > 1 && (
                    <div className="thumbnail-images-scroll">
                      <div className="thumbnail-images d-flex gap-2">
                        {images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`${product.title} ${index + 1}`}
                            className={`product-detail-thumb img-thumbnail flex-shrink-0 ${selectedImage === index ? "border-primary" : ""}`}
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
                    </div>
                  )}
                </>
              )}
            </div>
            <style>{`
                .product-images-col {
                  min-width: 0;
                }
                .product-images {
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                  max-height: calc(100vh - 120px);
                }
                .product-detail-main-image-wrap {
                  overflow: hidden;
                  border-radius: 8px;
                  cursor: crosshair;
                  flex: 1;
                  min-height: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-bottom: 1rem;
                }
                .product-detail-main-image {
                  display: block;
                  max-height: calc(100vh - 250px);
                  width: 100%;
                  object-fit: contain;
                }
                .thumbnail-images-scroll {
                  overflow-x: auto;
                  overflow-y: hidden;
                  -webkit-overflow-scrolling: touch;
                  scrollbar-width: thin;
                  max-width: 100%;
                  flex-shrink: 0;
                  padding-bottom: 0.5rem;
                }
                .thumbnail-images-scroll::-webkit-scrollbar {
                  height: 6px;
                }
                .thumbnail-images-scroll::-webkit-scrollbar-track {
                  background: #f1f1f1;
                  border-radius: 3px;
                }
                .thumbnail-images-scroll::-webkit-scrollbar-thumb {
                  background: #c1c1c1;
                  border-radius: 3px;
                }
                .product-detail-thumb {
                  transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                .product-detail-thumb:hover {
                  transform: scale(1.1);
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .product-swiper-mobile {
                  width: 100%;
                  margin-bottom: 1rem;
                }
                .product-detail-swiper {
                  width: 100%;
                  height: auto;
                }
                .product-detail-swiper .swiper-slide {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: #f8f9fa;
                  border-radius: 8px;
                }
                .product-detail-swiper .swiper-zoom-container {
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .product-detail-swiper .swiper-button-next,
                .product-detail-swiper .swiper-button-prev {
                  color: var(--primary-color, #89bb56);
                  background: rgba(255, 255, 255, 0.9);
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }
                .product-detail-swiper .swiper-button-next:after,
                .product-detail-swiper .swiper-button-prev:after {
                  font-size: 18px;
                  font-weight: bold;
                }
                .product-detail-swiper .swiper-pagination-bullet {
                  background: var(--primary-color, #89bb56);
                  opacity: 0.5;
                }
                .product-detail-swiper .swiper-pagination-bullet-active {
                  opacity: 1;
                }
                @media (max-width: 767px) {
                  .product-images {
                    max-height: none;
                  }
                  .product-detail-main-image-wrap {
                    cursor: default !important;
                  }
                  .product-detail-main-image {
                    max-height: 500px;
                  }
                }
              `}</style>
          </div>

          <div className="col-md-6 product-details-col">
            <div className="product-details-scroll-wrap" ref={scrollWrapRef}>
            <h1
              className="h2 h-md-3 text-uppercase mb-3 fw-bold product-detail-title"
              style={{ fontSize: "clamp(1.1rem, 3.5vw + 0.5rem, 1.5rem)" }}
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

            {/* <div className="product-badges mb-4">
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
            </div> */}

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
                          <th style={{ width: "150px" }}>Case Brand</th>
                          <td> FOXECOM</td>
                        </tr>
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
                        {/* {product.caseDetails.caseType && (
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
                        )} */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          

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

            {/* Selling Points */}
            <div className="selling-points mb-4">
              <ul className="selling-points-list list-unstyled mb-0">
                <li className="selling-point-item">
                  <span className="selling-point-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </span>
                  <span className="selling-point-text">Free delivery across India</span>
                </li>
                <li className="selling-point-item">
                  <span className="selling-point-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </span>
                  <span className="selling-point-text">We deliver within 4-7 business days</span>
                </li>
                <li className="selling-point-item">
                  <span className="selling-point-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </span>
                  <span className="selling-point-text">
                    Rated <span className="stars">★★★★★</span> by 3M+ happy customers
                  </span>
                </li>
                <li className="selling-point-item">
                  <span className="selling-point-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </span>
                  <span className="selling-point-text">100% satisfaction guarantee</span>
                </li>
               
                <li className="selling-point-item">
                  <span className="selling-point-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </span>
                  <span className="selling-point-text">Pan-India delivery to 25,000+ pincodes</span>
                </li>
              </ul>
            </div>

            <div className="action-buttons d-flex flex-column gap-3">
              <button
                className="btn btn-lg w-100 btn-primary btn-add-to-cart btn-add-to-cart-product-detail"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                <svg className="cart-outline me-2" width="20" height="20">
                  <use xlinkHref="#cart-outline"></use>
                </svg>
                {isInCart(product.id) ? "Add to Cart" : "Add to Cart"}
              </button>
              <button
                className="btn btn-lg w-100 btn-buy-now"
                onClick={handleBuyNow}
                disabled={!inStock}
              >
                {/* <i className="bi bi-lightning-fill me-2"></i> */}
                Buy Now
              </button>
            </div>

            {/* Product Description Accordion - inside right column for laptop layout */}
            <div className="product-description-accordion-section mt-4 mt-md-5" ref={accordionRef}>
              <div className="accordion product-details-accordion" id="productDetailsAccordion">
                <div className="accordion-item product-accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button product-accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseDescription"
                      aria-expanded="false"
                      aria-controls="collapseDescription"
                    >
                      <span className="accordion-icon-wrapper me-3">
                        <i className="bi bi-file-text" aria-hidden="true" />
                      </span>
                      <span className="accordion-title-text">Product Description</span>
                    </button>
                  </h2>
                  <div
                    id="collapseDescription"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingDescription"
                    data-bs-parent="#productDetailsAccordion"
                  >
                    <div className="accordion-body product-accordion-body">
                      {product.description ? (
                        <div className="description product-description-markdown">
                          <MarkdownPreview
                            source={product.description}
                            className="product-details-markdown"
                            style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)", lineHeight: "1.6" }}
                            wrapperElement={{ "data-color-mode": "light" }}
                          />
                        </div>
                      ) : (
                        <p className="text-muted mb-0">No description available.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section - below product details */}
        <div className="row mt-4 mt-md-5 customer-reviews-section">
          <div className="col-12">
            <h3 className="mb-3 mb-md-4 fw-semibold" style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)" }}>
              CUSTOMER REVIEWS
            </h3>

            {/* Average rating summary */}
            {reviews.length > 0 && (
              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2 gap-sm-3 mb-3 mb-md-4 review-rating-summary">
                <div className="d-flex align-items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`bi bi-star-fill ${
                        star <= Math.round(averageRating) ? "text-warning" : "text-muted"
                      }`}
                      style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
                    />
                  ))}
                </div>
                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-1 gap-sm-2">
                  <span className="fw-semibold" style={{ fontSize: "clamp(0.95rem, 2vw, 1rem)" }}>
                    {averageRating.toFixed(1)} out of 5
                  </span>
                  <span className="text-muted" style={{ fontSize: "clamp(0.85rem, 1.8vw, 0.95rem)" }}>
                    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
              </div>
            )}

            {/* Review form - only for logged-in users who purchased */}
            {canReview && (
              <div className="card mb-3 mb-md-4 review-form-card">
                <div className="card-body p-3 p-md-4">
                  <h5 className="card-title mb-3" style={{ fontSize: "clamp(1rem, 2.5vw, 1.15rem)" }}>
                    {existingReview ? "Update your review" : "Write a review"}
                  </h5>
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>Rating</label>
                      <div className="d-flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="btn btn-link p-0 border-0"
                            onClick={() => setRating(star)}
                            style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)" }}
                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          >
                            <i
                              className={`bi ${
                                star <= rating ? "bi-star-fill text-warning" : "bi-star"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>Your review (optional)</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Share your experience with this product..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-10 w-sm-auto"
                      disabled={submittingReview || rating < 1}
                      style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)" }}
                    >
                      {submittingReview ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* {!canReview && isLoggedIn && reviews.length === 0 && !loadingReviews && (
              <p className="text-muted" style={{ fontSize: "clamp(0.85rem, 1.8vw, 0.95rem)" }}>
                Only customers who have purchased this product can leave a review.
              </p>
            )} */}

            {!isLoggedIn && (
              <p className="text-muted mb-3 mb-md-4" style={{ fontSize: "clamp(0.85rem, 1.8vw, 0.95rem)" }}>
                <Link to="/login">Sign in</Link> to leave a review. You must have purchased this product to review it.
              </p>
            )}

            {/* Reviews list */}
            {loadingReviews ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="list-group">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="list-group-item list-group-item-action p-3 p-md-4 review-list-item"
                  >
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start gap-2">
                      <div className="flex-grow-1 w-100">
                        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-1 gap-sm-2 mb-2">
                          <div className="d-flex align-items-center gap-1 review-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <i
                                key={star}
                                className={`bi ${star <= r.rating ? "bi-star-fill text-warning" : "bi-star text-muted"}`}
                                style={{ fontSize: "clamp(0.85rem, 2vw, 0.9rem)" }}
                              />
                            ))}
                          </div>
                          <span className="text-muted review-customer-name">
                            {r.user?.email ? maskEmail(r.user.email) : "Customer"}
                          </span>
                        </div>
                        {r.reviewText && (
                          <p className="mb-0 review-text">
                            {r.reviewText}
                          </p>
                        )}
                      </div>
                      {/* <small className="text-muted" style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)" }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </small> */}
                    </div>
                  </div>
                ))}
              </div>
            ) : !canReview && (
              <p className="text-muted" style={{ fontSize: "clamp(0.85rem, 1.8vw, 0.95rem)" }}>
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>

        {/* Similar Products Section */}
        {product && (
          <SimilarProducts product={product} limit={8} />
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
