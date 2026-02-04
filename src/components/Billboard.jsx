import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import banner1 from '../assest/banners/1.webp'
import banner2 from '../assest/banners/2.webp'
import banner3 from '../assest/banners/3.webp'
import banner4 from '../assest/banners/4.webp'
import banner5 from '../assest/banners/5.webp'
import banner6 from '../assest/banners/6.webp'
import banner7 from '../assest/banners/7.webp'
import banner8 from '../assest/banners/8.webp'

const BANNERS = [
  { src: banner1, alt: 'Banner 1' },
  { src: banner2, alt: 'Banner 2' },
  { src: banner3, alt: 'Banner 3' },
  { src: banner4, alt: 'Banner 4' },
  { src: banner5, alt: 'Banner 5' },
  { src: banner6, alt: 'Banner 6' },
  { src: banner7, alt: 'Banner 7' },
  { src: banner8, alt: 'Banner 8' },
]

const Billboard = () => {
  const swiperRef = useRef(null)

  return (
    <section id="billboard" className="billboard-section position-relative overflow-hidden">
      <div className="billboard-inner">
        <Swiper
          ref={swiperRef}
          className="billboard-swiper"
          modules={[Autoplay, Pagination]}
          speed={500}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'billboard-pagination-bullet',
            bulletActiveClass: 'billboard-pagination-bullet-active',
          }}
          grabCursor
          threshold={5}
          slidesPerView={1}
          spaceBetween={0}
        >
          {BANNERS.map((banner, index) => (
            <SwiperSlide key={index}>
              <Link to="/shop" className="billboard-slide-link d-block">
                <div className="billboard-slide-img-wrap">
                  <img
                    src={banner.src}
                    alt={banner.alt}
                    className="billboard-slide-img"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={index === 0 ? 'high' : 'low'}
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className="billboard-arrow billboard-arrow-prev"
          aria-label="Previous slide"
          onClick={() => swiperRef.current?.swiper?.slidePrev()}
        >
          <i className="bi bi-chevron-left" />
        </button>
        <button
          type="button"
          className="billboard-arrow billboard-arrow-next"
          aria-label="Next slide"
          onClick={() => swiperRef.current?.swiper?.slideNext()}
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>

      <style>{`
        .billboard-section {
          min-height: 0;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }
        .billboard-inner {
          position: relative;
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          padding: 10px 36px;
          box-sizing: border-box;
        }
        .billboard-swiper { width: 100%; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .billboard-slide-link { width: 100%; }
        .billboard-slide-img-wrap {
          width: 100%;
          aspect-ratio: 3000 / 700;
          height: auto;
          max-height: 90vh;
          min-height: 300px;
          background: #111;
          overflow: hidden;
          border-radius: 12px;
        }
        .billboard-slide-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }
        .billboard-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 48px;
          height: 48px;
          border: none;
          border-radius: 50%;
          background: rgba(255,255,255,0.95);
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s, box-shadow 0.2s;
          opacity: 0.9;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        }
        .billboard-arrow:hover { background: #fff; opacity: 1; box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
        .billboard-arrow-prev { left: 68px; }
        .billboard-arrow-next { right: 68px; }
        .billboard-arrow .bi { font-size: 1.5rem; }
        .billboard-swiper .swiper-pagination { bottom: 16px; }
        .billboard-pagination-bullet {
          width: 10px; height: 10px;
          background: transparent;
          border: 2px solid rgba(255,255,255,0.8);
          opacity: 1;
          transition: background 0.2s, transform 0.2s, border-color 0.2s;
        }
        .billboard-pagination-bullet-active {
          background: #fff;
          border-color: #fff;
          transform: scale(1.15);
        }
        /* Larger screens - more margin */
        @media (min-width: 1401px) {
          .billboard-section {
            margin-top: 3rem;
            margin-bottom: 3rem;
          }
        }
        /* Maintain 3000:700 aspect ratio across all screen sizes */
        @media (max-width: 1400px) {
          .billboard-section {
            margin-top: 2.5rem;
            margin-bottom: 2.5rem;
          }
          .billboard-slide-img-wrap {
            max-height: 85vh;
            min-height: 280px;
          }
        }
        @media (max-width: 1200px) {
          .billboard-section {
            margin-top: 3rem;
            margin-bottom: 3rem;
          }
          .billboard-slide-img-wrap {
            max-height: 80vh;
            min-height: 260px;
          }
        }
        @media (max-width: 992px) {
          .billboard-section {
            margin-top: 2rem;
            margin-bottom: 2rem;
          }
          .billboard-inner { padding: 20px 32px; }
          .billboard-arrow-prev { left: 44px; }
          .billboard-arrow-next { right: 44px; }
          .billboard-slide-img-wrap {
            max-height: 75vh;
            min-height: 240px;
          }
        }
        @media (max-width: 768px) {
          .billboard-section {
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
          }
          .billboard-inner { padding: 16px 20px; }
          .billboard-swiper { border-radius: 10px; }
          .billboard-slide-img-wrap {
            max-height: 70vh;
            min-height: 220px;
            border-radius: 10px;
          }
          .billboard-arrow { width: 40px; height: 40px; }
          .billboard-arrow-prev { left: 28px; }
          .billboard-arrow-next { right: 28px; }
          .billboard-arrow .bi { font-size: 1.15rem; }
          .billboard-swiper .swiper-pagination { bottom: 10px; }
          .billboard-pagination-bullet { width: 8px; height: 8px; border-width: 1.5px; }
        }
        @media (max-width: 576px) {
          .billboard-slide-img-wrap {
            max-height: 65vh;
            min-height: 200px;
          }
        }
        @media (max-width: 480px) {
          .billboard-section {
            margin-top: 1rem;
            margin-bottom: 1rem;
          }
          .billboard-inner { padding: 12px 14px; }
          .billboard-arrow-prev { left: 22px; }
          .billboard-arrow-next { right: 22px; }
          .billboard-arrow { width: 34px; height: 34px; }
          .billboard-arrow .bi { font-size: 1rem; }
          .billboard-slide-img-wrap {
            max-height: 60vh;
            min-height: 180px;
          }
        }
        @media (max-width: 360px) {
          .billboard-slide-img-wrap {
            max-height: 55vh;
            min-height: 160px;
          }
        }
      `}</style>
    </section>
  )
}

export default Billboard
