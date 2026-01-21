import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productAPI, categoryAPI, getImageUrl } from '../utils/api'
import { useCart } from '../contexts/CartContext'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [selectedCategory, sortBy, page])

  const loadCategories = async () => {
    try {
      const data = await categoryAPI.getAll()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 12,
      }

      if (selectedCategory !== 'all') {
        const category = categories.find(c =>
          c.name.toLowerCase() === selectedCategory.toLowerCase() ||
          c.slug.toLowerCase() === selectedCategory.toLowerCase()
        )
        if (category) {
          params.categoryId = category.id
        }
      }

      if (sortBy === 'price-low') {
        params.priceOrder = 'asc'
      } else if (sortBy === 'price-high') {
        params.priceOrder = 'desc'
      }

      const data = await productAPI.getAll(params)
      setProducts(data.products || data || [])

      if (data.totalPages) {
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product, e) => {
    e.preventDefault()
    const success = await addToCart(product, 1)
    if (success) {
      alert(`${product.title} added to cart!`)
    }
  }

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`
  }

  if (loading && products.length === 0) {
    return (
      <div className="padding-large">
        <div className="container">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>

    )
  }

  return (
    <div className="padding-large">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-5 text-uppercase mb-4">Shop</h1>
          </div>
        </div>

        <div className="row">
          {products.map((product) => {
            const imagePath = product.thumbnailImage || '/images/product-item1.jpg'
            const imageUrl = getImageUrl(imagePath)
            const price = parseFloat(product.discountPrice || product.price)
            const originalPrice = product.discountPrice ? parseFloat(product.price) : null

            return (
              <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="product-card position-relative h-100">
                  <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <div className="image-holder position-relative">
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="img-fluid w-100"
                        style={{ height: '300px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.src = '/images/product-item1.jpg'
                        }}
                      />
                      {originalPrice && (
                        <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                          {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="cart-concern position-absolute" style={{ bottom: '80px', left: '50%', transform: 'translateX(-50%)', opacity: 0, transition: 'opacity 0.3s' }}>
                    <div className="cart-button d-flex">
                      <button
                        className="btn btn-medium btn-black"
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={!product.stock || product.stock <= 0}
                      >
                        Add to Cart
                        <svg className="cart-outline ms-2">
                          <use xlinkHref="#cart-outline"></use>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="card-detail d-flex justify-content-between align-items-baseline pt-3">
                    <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                      <h3 className="card-title text-uppercase mb-1">{product.title}</h3>
                    </Link>
                    <div className="text-end">
                      <span className="item-price text-primary d-block">{formatPrice(price)}</span>
                      {originalPrice && (
                        <span className="text-muted text-decoration-line-through small">{formatPrice(originalPrice)}</span>
                      )}
                    </div>
                  </div>

                  {/* Display case details if available */}
                  {product.caseDetails && (
                    <div className="mt-2">
                      <small className="text-muted">
                        {product.caseDetails.brand?.name} {product.caseDetails.model?.name}
                      </small>
                    </div>
                  )}

                  <style>{`
                      .product-card:hover .cart-concern {
                        opacity: 1 !important;
                      }
                    `}</style>
                </div>
              </div>
            )
          })}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-5">
            <p className="lead">No products found in this category.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i + 1} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  
  )
}

export default Shop
