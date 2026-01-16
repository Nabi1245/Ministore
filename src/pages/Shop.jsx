import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllProducts, getProductsByCategory } from '../data/products'
import { useCart } from '../contexts/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SVGSymbols from '../components/SVGSymbols'

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const { addToCart } = useCart()

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'mobile', label: 'Mobile Phones' },
    { value: 'watch', label: 'Smart Watches' }
  ]

  let products = selectedCategory === 'all' 
    ? getAllProducts() 
    : getProductsByCategory(selectedCategory)

  // Sort products
  if (sortBy === 'price-low') {
    products = [...products].sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-high') {
    products = [...products].sort((a, b) => b.price - a.price)
  } else if (sortBy === 'name') {
    products = [...products].sort((a, b) => a.name.localeCompare(b.name))
  }

  const handleAddToCart = (product, e) => {
    e.preventDefault()
    addToCart(product, 1)
    alert(`${product.name} added to cart!`)
  }

  return (
    <>
      <SVGSymbols />
      <Header />
      <div className="padding-large">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="display-5 text-uppercase mb-4">Shop</h1>
              
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <div className="category-filter d-flex gap-2 flex-wrap">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      className={`btn ${selectedCategory === cat.value ? 'btn-dark' : 'btn-outline-dark'}`}
                      onClick={() => setSelectedCategory(cat.value)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="sort-filter">
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: '200px' }}
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="product-card position-relative h-100">
                  <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <div className="image-holder position-relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="img-fluid w-100"
                        style={{ height: '300px', objectFit: 'cover' }}
                      />
                      {product.originalPrice > product.price && (
                        <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </Link>
                  
                  <div className="cart-concern position-absolute" style={{ bottom: '80px', left: '50%', transform: 'translateX(-50%)', opacity: 0, transition: 'opacity 0.3s' }}>
                    <div className="cart-button d-flex">
                      <button
                        className="btn btn-medium btn-black"
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={!product.inStock}
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
                      <h3 className="card-title text-uppercase mb-1">{product.name}</h3>
                    </Link>
                    <div className="text-end">
                      <span className="item-price text-primary d-block">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-muted text-decoration-line-through small">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <style>{`
                    .product-card:hover .cart-concern {
                      opacity: 1 !important;
                    }
                  `}</style>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-5">
              <p className="lead">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Shop

