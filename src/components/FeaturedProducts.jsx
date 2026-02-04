import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, getImageUrl } from '../utils/api';
import { useCart } from '../contexts/CartContext';
import { ProductListSkeleton } from './LoadingSkeleton';
import ProductCard from './ProductCard';
import StarRating from './StarRating';

const FeaturedProducts = ({ title = 'Featured Products', categoryId = null, limit = 8, showViewAll = true }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [categoryId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        limit,
        page: 1,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      };

      if (categoryId) {
        params.categoryId = categoryId;
      }

      const productsData = await productAPI.getAll(params);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error('Error loading featured products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    const success = await addToCart(product, 1);
    if (success) {
      // Optional: Show toast notification instead of alert
      // For now, we'll use a subtle visual feedback
    }
  };

  if (error && products.length === 0) {
    return null; // Don't show section if there's an error and no products
  }

  return (
    <section className="featured-products padding-large">
      <div className="container">
        <div className="row">
          <div className="display-header d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
            <h2 className="display-7 text-dark text-uppercase mb-0">{title}</h2>
            {showViewAll && (
              <Link 
                to={categoryId ? `/shop?categoryId=${categoryId}` : '/shop'} 
                className="btn text-uppercase"
                style={{
                  borderColor: '#89bb56',
                  color: '#89bb56',
                  backgroundColor: 'transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#89bb56';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = '#89bb56';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#89bb56';
                  e.currentTarget.style.borderColor = '#89bb56';
                }}
              >
                View All
              </Link>
            )}
          </div>
          
          {loading ? (
            <ProductListSkeleton count={limit} />
          ) : products.length === 0 ? (
            <div className="col-12 text-center py-5">
              <p className="text-muted">No products available at the moment.</p>
            </div>
          ) : (
            <div className="row">
              {products.map((product) => {
                const productData = {
                  id: product.id,
                  title: product.title || product.name,
                  price: parseFloat(product.price || 0),
                  discountPrice: product.discountPrice ? parseFloat(product.discountPrice) : null,
                  thumbnailImage: product.thumbnailImage,
                  images: product.images,
                  rating: product.rating || product.averageRating || 0,
                  reviewCount: product.reviewCount || product.reviewsCount || 0,
                  inStock: product.inStock !== false,
                  category: product.category,
                };

                return (
                  <div key={product.id} className="col-12 col-md-6 col-lg-3 mb-4">
                    <ProductCard
                      product={productData}
                      onAddToCart={handleAddToCart}
                      showAddToCart={true}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
