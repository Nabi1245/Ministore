import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProductById } from '../data/products'
import { useCart } from '../contexts/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SVGSymbols from '../components/SVGSymbols'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, isInCart } = useCart()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundProduct = getProductById(id)
    if (foundProduct) {
      setProduct(foundProduct)
      setSelectedImage(0)
    } else {
      navigate('/shop')
    }
    setLoading(false)
  }, [id, navigate])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      // Show success message (you can add a toast notification here)
      alert(`${product.name} added to cart!`)
    }
  }

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const renderStars = (rating, size = 'normal') => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const starSize = size === 'small' ? { width: '14px', height: '14px' } : {}

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="star star-fill" style={starSize}>
          <use xlinkHref="#star-fill"></use>
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="star star-half" style={starSize}>
          <use xlinkHref="#star-half"></use>
        </svg>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="star star-empty" style={starSize}>
          <use xlinkHref="#star-empty"></use>
        </svg>
      )
    }

    return stars
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <>
      <SVGSymbols />
      <Header />
      <div className="padding-large">
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/shop">Shop</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <div className="row">
            <div className="col-md-6">
              <div className="product-images">
                <div className="main-image mb-3">
                  <img 
                    src={product.images[selectedImage] || product.image} 
                    alt={product.name}
                    className="img-fluid w-100"
                    style={{ borderRadius: '8px', maxHeight: '500px', objectFit: 'cover' }}
                  />
                </div>
                <div className="thumbnail-images d-flex gap-2">
                  {product.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className={`img-thumbnail ${selectedImage === index ? 'border-primary' : ''}`}
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        objectFit: 'cover',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <h1 className="display-4 text-uppercase mb-3">{product.name}</h1>
              
              <div className="rating mb-3">
                {renderStars(product.rating)}
                <span className="ms-2">({product.reviews} reviews)</span>
              </div>

              <div className="price-section mb-4">
                <span className="h3 text-primary me-3">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-muted text-decoration-line-through">${product.originalPrice}</span>
                )}
                {product.originalPrice > product.price && (
                  <span className="badge bg-danger ms-2">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <div className="description mb-4">
                <p className="lead">{product.description}</p>
              </div>

              <div className="features mb-4">
                <h5 className="mb-3">Key Features:</h5>
                <ul className="list-unstyled">
                  {product.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="stock-info mb-4">
                {product.inStock ? (
                  <p className="text-success">
                    <strong>In Stock</strong> ({product.stock} available)
                  </p>
                ) : (
                  <p className="text-danger"><strong>Out of Stock</strong></p>
                )}
              </div>

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
                    style={{ width: '80px' }}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1
                      setQuantity(Math.min(Math.max(1, val), product.stock))
                    }}
                    min="1"
                    max={product.stock}
                  />
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons d-flex gap-3">
                <button
                  className="btn btn-dark btn-lg flex-grow-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <svg className="cart-outline me-2" width="20" height="20">
                    <use xlinkHref="#cart-outline"></use>
                  </svg>
                  {isInCart(product.id) ? 'Update Cart' : 'Add to Cart'}
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  disabled={!product.inStock}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-12">
              <h3 className="mb-4">Product Information</h3>
              <div className="card">
                <div className="card-body">
                  <table className="table">
                    <tbody>
                      <tr>
                        <th style={{ width: '200px' }}>Category</th>
                        <td className="text-capitalize">{product.category}</td>
                      </tr>
                      <tr>
                        <th>SKU</th>
                        <td>PROD-{product.id.toString().padStart(4, '0')}</td>
                      </tr>
                      <tr>
                        <th>Availability</th>
                        <td>{product.inStock ? 'In Stock' : 'Out of Stock'}</td>
                      </tr>
                      <tr>
                        <th>Stock Quantity</th>
                        <td>{product.stock} units</td>
                      </tr>
                      <tr>
                        <th>Rating</th>
                        <td>
                          <span className="d-inline-flex align-items-center gap-1">
                            {renderStars(product.rating, 'small')}
                            <span className="ms-1">({product.rating}/5)</span>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ProductDetails

