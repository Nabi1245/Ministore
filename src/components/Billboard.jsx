import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const Billboard = () => {
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  return (
    <section id="billboard" className="position-relative overflow-hidden bg-light-blue">
      <Swiper
        className="main-swiper"
        modules={[Navigation]}
        speed={500}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current
          swiper.params.navigation.nextEl = nextRef.current
        }}
      >
        <SwiperSlide>
          <div className="container">
            <div className="row d-flex align-items-center">
              <div className="col-md-6">
                <div className="banner-content">
                  <h1 className="display-2 text-uppercase text-dark pb-5">Your Products Are Great.</h1>
                  <a href="shop.html" className="btn btn-medium btn-dark text-uppercase btn-rounded-none">Shop Product</a>
                </div>
              </div>
              <div className="col-md-5">
                <div className="image-holder">
                  <img src="/images/banner-image.png" alt="banner" />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="container">
            <div className="row d-flex flex-wrap align-items-center">
              <div className="col-md-6">
                <div className="banner-content">
                  <h1 className="display-2 text-uppercase text-dark pb-5">Technology Hack You Won't Get</h1>
                  <a href="shop.html" className="btn btn-medium btn-dark text-uppercase btn-rounded-none">Shop Product</a>
                </div>
              </div>
              <div className="col-md-5">
                <div className="image-holder">
                  <img src="/images/banner-image.png" alt="banner" />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div ref={prevRef} className="swiper-icon swiper-arrow swiper-arrow-prev">
        <svg className="chevron-left">
          <use xlinkHref="#chevron-left" />
        </svg>
      </div>
      <div ref={nextRef} className="swiper-icon swiper-arrow swiper-arrow-next">
        <svg className="chevron-right">
          <use xlinkHref="#chevron-right" />
        </svg>
      </div>
    </section>
  )
}

export default Billboard

