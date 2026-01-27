// RefundPolicy.jsx
import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          {/* Header Section */}
          <div className="text-center mb-5">
            <h1 className="text-success mb-3">
              <i className="bi bi-arrow-counterclockwise me-3"></i>
              Refund and Cancellation Policy
            </h1>
            <p className="lead text-muted">Last Updated: {new Date().toLocaleDateString()}</p>
            <div className="border-top border-success pt-3 mx-auto" style={{maxWidth: '200px'}}></div>
          </div>

          {/* Main Policy Card */}
          <div className="card shadow-lg border-0 mb-5">
            <div className="card-header bg-success text-white py-4">
              <h2 className="h4 mb-0">
                <i className="bi bi-shop me-2"></i>
                FOXECOM Refund Policy
              </h2>
            </div>
            <div className="card-body p-4 p-md-5">
              
              {/* Introduction */}
              <div className="mb-5">
                <p className="fs-5">
                  FOXECOM.IN is into ecommerce, online sales and marketing of Mobile accessories 
                  and electronics related products promoted by REDECOM TECH LABS PVT LTD. 
                  Our focus is to enable our customers with utmost satisfaction.
                </p>
                <div className="alert alert-success mt-4">
                  <div className="d-flex">
                    <i className="bi bi-info-circle fs-4 me-3"></i>
                    <div>
                      In the event, if you are displeased with the goods or products provided, 
                      we will refund back the money, provided the reasons are genuine and proved 
                      after investigation.
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="alert alert-warning border-warning mb-5">
                <h5 className="alert-heading">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Important Notice
                </h5>
                <p className="mb-0">
                  Please read the fine prints of each deal before buying it, which provides all 
                  details about the product you purchase.
                </p>
              </div>

              {/* Cancellation Policy Section */}
              <div className="mb-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-success text-white rounded-circle p-3 me-3">
                    <i className="bi bi-x-circle-fill fs-3"></i>
                  </div>
                  <h2 className="h3 text-success mb-0">Cancellation Policy</h2>
                </div>

                <div className="ps-4 border-start border-success border-3">
                  <p className="mb-4">
                    For cancellation purpose, please contact us via <strong>"Contact us" link</strong>. 
                    Cancellation requests for orders will be considered only if the request is made 
                    <span className="badge bg-danger ms-2">within 24 hours</span> of placing an order.
                  </p>

                  {/* Timeline Section */}
                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <div className="border rounded p-3 h-100">
                        <div className="d-flex align-items-center mb-2">
                          <div className="bg-success text-white rounded-circle p-2 me-2">
                            <i className="bi bi-clock"></i>
                          </div>
                          <h5 className="mb-0 text-success">Order Processing</h5>
                        </div>
                        <p className="mb-0">
                          Cancellation requests will not be entertained if the same have been 
                          communicated to the vendors/merchants and they have initiated the 
                          process of shipping.
                        </p>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="border rounded p-3 h-100">
                        <div className="d-flex align-items-center mb-2">
                          <div className="bg-success text-white rounded-circle p-2 me-2">
                            <i className="bi bi-box-seam"></i>
                          </div>
                          <h5 className="mb-0 text-success">Defective Products</h5>
                        </div>
                        <p className="mb-0">
                          In case of receipt of damaged or defective items/products, please report 
                          the same to our Customer Service team within 
                          <span className="badge bg-warning text-dark ms-1">24 hours / 1 day</span> 
                          of receipt.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Product Issues */}
                  <div className="border rounded p-4 bg-light mb-4">
                    <h5 className="text-success mb-3">
                      <i className="bi bi-chat-left-text me-2"></i>
                      Product Not as Expected?
                    </h5>
                    <p className="mb-0">
                      In case you feel that the product received is not as shown on the site or 
                      as per your expectations, you must bring it to the notice of our customer 
                      service <strong>within 24 hours</strong> of receiving the product. 
                      The Customer Service Team after looking into your complaint will take 
                      an appropriate decision.
                    </p>
                  </div>
                </div>
              </div>

              {/* Refund Policy Section */}
              <div className="mb-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-success text-white rounded-circle p-3 me-3">
                    <i className="bi bi-currency-exchange fs-3"></i>
                  </div>
                  <h2 className="h3 text-success mb-0">Refund Policy</h2>
                </div>

                <div className="ps-4 border-start border-success border-3">
                  <div className="alert alert-danger">
                    <h5 className="alert-heading">
                      <i className="bi bi-exclamation-octagon-fill me-2"></i>
                      Important: Delivery Acceptance
                    </h5>
                    <p className="mb-0">
                      Orders once delivered and accepted by customer cannot be refunded.
                    </p>
                  </div>

                  <div className="border rounded p-4 bg-success bg-opacity-10">
                    <h5 className="text-success mb-3">
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Cancellation Refund Process
                    </h5>
                    <p className="mb-4">
                      If the order is cancelled before the same is processed, the amount paid 
                      will be refunded in due time as per standard cancellation policy followed 
                      by payment gateways and banking channels will be credited to customers.
                    </p>

                    {/* Refund Timeline */}
                    <div className="row text-center g-3">
                      <div className="col-md-4">
                        <div className="border rounded p-3 bg-white">
                          <div className="bg-success text-white rounded-circle p-3 mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                            <i className="bi bi-1-circle-fill fs-4"></i>
                          </div>
                          <h6 className="text-success">Request Cancellation</h6>
                          <p className="small mb-0">Within 24 hours of order</p>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="border rounded p-3 bg-white">
                          <div className="bg-success text-white rounded-circle p-3 mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                            <i className="bi bi-2-circle-fill fs-4"></i>
                          </div>
                          <h6 className="text-success">Verification</h6>
                          <p className="small mb-0">Team reviews request</p>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="border rounded p-3 bg-white">
                          <div className="bg-success text-white rounded-circle p-3 mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                            <i className="bi bi-3-circle-fill fs-4"></i>
                          </div>
                          <h6 className="text-success">Refund Processed</h6>
                          <p className="small mb-0">Through payment gateway</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border rounded p-4 bg-light">
                <h4 className="text-success mb-4">
                  <i className="bi bi-headset me-2"></i>
                  Need Help with Refund or Cancellation?
                </h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-telephone text-success fs-5 me-3 mt-1"></i>
                      <div>
                        <h5 className="h6 text-success mb-1">Phone Support</h5>
                        <p className="mb-0">+91 9625472793</p>
                        <small className="text-muted">Available during business hours</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-envelope text-success fs-5 me-3 mt-1"></i>
                      <div>
                        <h5 className="h6 text-success mb-1">Email Support</h5>
                        <p className="mb-0">foxecom99@gmail.com</p>
                        <small className="text-muted">24-48 hour response time</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-geo-alt text-success fs-5 me-3 mt-1"></i>
                      <div>
                        <h5 className="h6 text-success mb-1">Registered Office</h5>
                        <p className="mb-0 small">
                          FOXECOM.IN, C/O: REDECOM TECH LABS PVT LTD<br />
                          703, 7th floor, Ahinsa Knd 2, Charms, Solita, Indirapuram,<br />
                          Sahibabad, Ghaziabad- 201010, Uttar Pradesh
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <a href="/contact" className="btn btn-success me-3">
                    <i className="bi bi-chat-left-text me-2"></i>Contact Us
                  </a>
                  <a href="/faq" className="btn btn-outline-success">
                    <i className="bi bi-question-circle me-2"></i>Visit FAQ
                  </a>
                </div>
              </div>

            </div>
            
            {/* Card Footer */}
            <div className="card-footer bg-light py-3">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  <i className="bi bi-shield-check text-success me-1"></i>
                  Your satisfaction is our priority
                </small>
                <div>
                  <a href="/terms" className="btn btn-sm btn-outline-success me-2">
                    <i className="bi bi-file-text me-1"></i>Terms
                  </a>
                  <a href="/privacy-policy" className="btn btn-sm btn-success">
                    <i className="bi bi-shield me-1"></i>Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Important Points Summary */}
          <div className="row g-4 mb-5">
            <div className="col-md-6">
              <div className="border border-success border-2 rounded p-4 h-100">
                <h4 className="text-success mb-3">
                  <i className="bi bi-check-circle me-2"></i>
                  What You Can Do
                </h4>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check text-success me-2"></i>
                    Cancel within 24 hours of ordering
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check text-success me-2"></i>
                    Report damaged items within 24 hours
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check text-success me-2"></i>
                    Contact customer service for issues
                  </li>
                  <li>
                    <i className="bi bi-check text-success me-2"></i>
                    Get refund if cancelled before processing
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="border border-danger border-2 rounded p-4 h-100">
                <h4 className="text-danger mb-3">
                  <i className="bi bi-x-circle me-2"></i>
                  What You Cannot Do
                </h4>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-x text-danger me-2"></i>
                    Cancel after shipping starts
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-x text-danger me-2"></i>
                    Refund after accepting delivery
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-x text-danger me-2"></i>
                    Report issues after 24 hours
                  </li>
                  <li>
                    <i className="bi bi-x text-danger me-2"></i>
                    Cancel without contacting us
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="text-center">
            <div className="border-top pt-4">
              <h5 className="text-success mb-3">Need More Information?</h5>
              <p className="text-muted mb-4">
                For detailed information about our shipping, returns, and other policies, 
                please visit our FAQ section or contact our customer support team.
              </p>
              <div>
                <a href="/shipping-policy" className="btn btn-outline-secondary me-2">
                  Shipping Policy
                </a>
                <a href="/return-policy" className="btn btn-outline-secondary me-2">
                  Return Policy
                </a>
                <a href="/faq" className="btn btn-secondary">
                  FAQ Section
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;