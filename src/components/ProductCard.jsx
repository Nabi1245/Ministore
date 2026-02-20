import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/api';
import { useCart } from '../contexts/CartContext';
import StarRating from './StarRating';

/**
 * Memoized Product Card Component
 * Prevents unnecessary re-renders when parent component updates
 */
const ProductCard = memo(({ product, onAddToCart, showAddToCart = true, showBuyNow = true }) => {
  const navigate = useNavigate();
  const { buyNow } = useCart();
  const {
    id,
    title,
    price,
    discountPrice,
    thumbnailImage,
    images,
    rating,
    reviewCount,
    inStock,
    category
  } = product;

  const imageUrl = getImageUrl(thumbnailImage || images?.[0]?.imageUrl);
  const finalPrice = discountPrice || price;
  const hasDiscount = discountPrice && discountPrice < price;
  
  // Calculate discount percentage
  const discountPercentage = hasDiscount 
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inStock) return;
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to proceed with Buy Now');
      localStorage.setItem('redirectAfterLogin', `/product/${product.id}`);
      navigate('/login');
      return;
    }

    const success = await buyNow(product, 1);
    if (success) {
      navigate('/checkout');
    }
  };

  return (
    <div className="card h-100 shadow-sm product-card">
      <Link to={`/product/${id}`} className="text-decoration-none">
        <div className="position-relative" style={{ height: '250px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
          <img
            src={imageUrl}
            alt={title}
            className="img-fluid w-100 h-100"
            style={{ objectFit: 'contain', padding: '10px' }}
            loading="lazy"
          />
          {hasDiscount && discountPercentage > 0 && (
            <span className="badge bg-danger position-absolute top-0 end-0 m-2" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
              -{discountPercentage}%
            </span>
          )}
          {!inStock && (
            <span className="badge bg-secondary position-absolute top-0 start-0 m-2">
              Out of Stock
            </span>
          )}
        </div>
      </Link>

      <div className="card-body d-flex flex-column">
        <Link to={`/product/${id}`} className="text-decoration-none text-dark">
          {category && (
            <small className="text-muted text-uppercase mb-1 d-block">{category.name || category}</small>
          )}
          <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '1rem' }}>
            {title}
          </h5>
        </Link>

        {rating !== undefined && (
          <div className="mb-2">
            <StarRating rating={rating} reviewCount={reviewCount} size="0.85rem" />
          </div>
        )}

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              {hasDiscount ? (
                <>
                  <span className="h5 text-primary mb-0">₹{finalPrice.toFixed(2)}</span>
                  <span className="text-muted text-decoration-line-through small ms-2">
                    ₹{price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="h5 text-primary mb-0">₹{price.toFixed(2)}</span>
              )}
            </div>
          </div>

          {showAddToCart && (
            <div className="d-flex flex-column gap-2">
              <button
                className="btn btn-primary w-100"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              {showBuyNow && inStock && (
                <button
                  className="btn btn-primary w-100 btn-buy-now"
                  onClick={handleBuyNow}
                >
                  {/* <i className="bi bi-lightning-fill me-2"></i> */}
                  Buy Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
