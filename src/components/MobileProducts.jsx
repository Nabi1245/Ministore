import React from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import { getProductsByCategory } from '../data/products'
import { useCart } from '../contexts/CartContext'
import 'swiper/css'
import 'swiper/css/pagination'

const MobileProducts = () => {
  const { addToCart } = useCart()
  const products = getProductsByCategory('mobile')

  const handleAddToCart = (product, e) => {
    e.preventDefault()
    addToCart(product, 1)
    alert(`${product.name} added to cart!`)
  }

  return (
    <section id="mobile-products" className="product-store position-relative padding-large no-padding-top">
      <div className="container">
        <div className="row">
          <div className="display-header d-flex justify-content-between pb-3">
            <h2 className="display-7 text-dark text-uppercase">Mobile Products</h2>
            <div className="btn-right">
              <Link to="/shop" className="btn btn-medium btn-normal text-uppercase">Go to Shop</Link>
            </div>
          </div>
          <Swiper
            className="product-swiper"
            modules={[Pagination]}
            slidesPerView={4}
            spaceBetween={10}
            pagination={{
              el: '#mobile-products .swiper-pagination',
              clickable: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              980: {
                slidesPerView: 4,
                spaceBetween: 20,
              }
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="product-card position-relative">
                  <Link to={`/product/${product.id}`}>
                    <div className="image-holder">
                      <img src={product.image} alt="product-item" className="img-fluid" />
                    </div>
                  </Link>
                  <div className="cart-concern position-absolute">
                    <div className="cart-button d-flex">
                      <button
                        className="btn btn-medium btn-black"
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={!product.inStock}
                      >
                        Add to Cart
                        <svg className="cart-outline">
                          <use xlinkHref="#cart-outline"></use>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="card-detail d-flex justify-content-between align-items-baseline pt-3">
                    <h3 className="card-title text-uppercase">
                      <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                        {product.name}
                      </Link>
                    </h3>
                    <span className="item-price text-primary">${product.price}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="swiper-pagination position-absolute text-center"></div>
    </section>
  )
}

export default MobileProducts

