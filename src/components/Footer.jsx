import React from 'react'
import mainLogo from '../assest/images/main-logo.png'
import dhlLogo from '../assest/images/dhl.png'
import shippingCard from '../assest/images/shippingcard.png'
import visaLogo from '../assest/images/visa.jpg'
import mastercardLogo from '../assest/images/mastercard.jpg'
import paypalLogo from '../assest/images/paypal.jpg'

const Footer = () => {
  return (
    <>
      <footer id="footer" className="overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="footer-top-area">
              <div className="row d-flex flex-wrap justify-content-between">
                <div className="col-lg-3 col-sm-6 pb-3">
                  <div className="footer-menu">
                    <img src={mainLogo} alt="logo" />
                    <p>Nisi, purus vitae, ultrices nunc. Sit ac sit suscipit hendrerit. Gravida massa volutpat aenean odio erat nullam fringilla.</p>
                    <div className="social-links">
                      <ul className="d-flex list-unstyled">
                        <li>
                          <a href="#">
                            <svg className="facebook">
                              <use xlinkHref="#facebook" />
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg className="instagram">
                              <use xlinkHref="#instagram" />
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg className="twitter">
                              <use xlinkHref="#twitter" />
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg className="linkedin">
                              <use xlinkHref="#linkedin" />
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg className="youtube">
                              <use xlinkHref="#youtube" />
                            </svg>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-sm-6 pb-3">
                  <div className="footer-menu text-uppercase">
                    <h5 className="widget-title pb-2">Quick Links</h5>
                    <ul className="menu-list list-unstyled text-uppercase">
                      <li className="menu-item pb-2">
                        <a href="#">Home</a>
                      </li>
                      <li className="menu-item pb-2">
                        <a href="#">About</a>
                      </li>
                      <li className="menu-item pb-2">
                        <a href="#">Shop</a>
                      </li>
                      <li className="menu-item pb-2">
                        <a href="#">Blogs</a>
                      </li>
                      <li className="menu-item pb-2">
                        <a href="#">Contact</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 pb-3">
                  <div className="footer-menu text-uppercase">
                    <h5 className="widget-title pb-2">Help & Info Help</h5>
                    <ul className="menu-list list-unstyled">
                      <li className="menu-item pb-2">
                        <a href="#">Track Your Order</a>
                      </li>
                      <li className="menu-item pb-2">
                        <a href="#">Returns Policies</a>
                      </li>
                      <li className="menu-item pb-2">
                        <a href="#">Shipping + Delivery</a>
                      </li>
                      <li className="menu-item pb-2">
                        <a href="#">Contact Us</a>
                      </li>
                      <li className="menu-item pb-2">
                        <a href="#">Faqs</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 pb-3">
                  <div className="footer-menu contact-item">
                    <h5 className="widget-title text-uppercase pb-2">Contact Us</h5>
                    <p>Do you have any queries or suggestions? <a href="mailto:">yourinfo@gmail.com</a>
                    </p>
                    <p>If you need support? Just give us a call. <a href="">+55 111 222 333 44</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </footer>
      <div id="footer-bottom">
        <div className="container">
          <div className="row d-flex flex-wrap justify-content-between">
            <div className="col-md-4 col-sm-6">
              <div className="Shipping d-flex">
                <p>We ship with:</p>
                <div className="card-wrap ps-2">
                  <img src={dhlLogo} alt="visa" />
                  <img src={shippingCard} alt="mastercard" />
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="payment-method d-flex">
                <p>Payment options:</p>
                <div className="card-wrap ps-2">
                  <img src={visaLogo} alt="visa" />
                  <img src={mastercardLogo} alt="mastercard" />
                  <img src={paypalLogo} alt="paypal" />
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="copyright">
                <p>© Copyright 2023 Foxecom. Design by <a href="https://ideatore./">inIDEATORE INTERACTIVE PVT LTD</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer

