// TermsConditions.jsx
import React from 'react';
import './LegalPages.css';

const TermsConditions = () => {
  return (
    <div className="legal-container container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">
          <div className="legal-card card shadow-lg border-0">
            <div className="card-header bg-success text-white py-4">
              <h1 className="h2 mb-0"><i className="bi bi-journal-text me-3"></i>Terms & Conditions</h1>
              <p className="mb-0 opacity-75">Effective Date: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="card-body p-4 p-md-5">
              <div className="legal-content">
                <div className="mb-5">
                  <h2 className="h3 text-success">Welcome to FOXECOM</h2>
                  <p className="lead">
                    These Terms and Conditions govern your use of FOXECOM.IN website and services. By accessing or using our services, you agree to be bound by these Terms.
                  </p>
                </div>

                {/* General Terms */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <i className="bi bi-check-circle me-2"></i>General Terms
                  </h2>
                  <p>FOXECOM.IN is promoted by REDECOM TECH LABS PVT LTD, dealing in mobile accessories and electronics under the brand name "FOXECOM".</p>
                  <ul className="custom-list">
                    <li>By agreeing to these Terms, you represent that you are at least the age of majority in your state or province of residence.</li>
                    <li>You may not use our products for any illegal or unauthorized purpose.</li>
                    <li>You must not transmit any worms, viruses, or any code of a destructive nature.</li>
                  </ul>
                </section>

                {/* Products and Services */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <i className="bi bi-box-seam me-2"></i>Products and Services
                  </h2>
                  <ul className="custom-list">
                    <li>All products are subject to availability.</li>
                    <li>We reserve the right to discontinue any product at any time.</li>
                    <li>Prices for our products are subject to change without notice.</li>
                    <li>We reserve the right to refuse service to anyone for any reason at any time.</li>
                  </ul>
                </section>

                {/* Payments and Transactions */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <i className="bi bi-credit-card me-2"></i>Payments and Transactions
                  </h2>
                  <p>We accept payments through various gateways including:</p>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge bg-success">RuPay</span>
                    <span className="badge bg-success">VISA</span>
                    <span className="badge bg-success">MasterCard</span>
                    <span className="badge bg-success">American Express</span>
                    <span className="badge bg-success">Discover</span>
                  </div>
                  <div className="alert alert-light border">
                    <h6 className="text-success"><i className="bi bi-shield-check me-2"></i>Secure Payments</h6>
                    <p className="mb-0 small">All transactions are secured with PCI-DSS compliance, SSL encryption, and AES-256 encryption for data protection.</p>
                  </div>
                </section>

                {/* Returns and Refunds */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <i className="bi bi-arrow-return-left me-2"></i>Returns and Refunds
                  </h2>
                  <ul className="custom-list">
                    <li>Returns must be initiated within 7 days of delivery</li>
                    <li>Products must be in original condition with all accessories</li>
                    <li>Refunds will be processed within 7-10 business days</li>
                    <li>Shipping charges are non-refundable unless the return is due to our error</li>
                  </ul>
                </section>

                {/* Intellectual Property */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <i className="bi bi-c-circle me-2"></i>Intellectual Property
                  </h2>
                  <p>The FOXECOM brand and logo are registered trademarks of REDECOM TECH LABS PVT LTD. All content on this website, including images, text, and logos, is our property and protected by copyright laws.</p>
                </section>

                {/* Limitation of Liability */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <i className="bi bi-exclamation-triangle me-2"></i>Limitation of Liability
                  </h2>
                  <p>FOXECOM shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
                </section>

                {/* Governing Law */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <i className="bi bi-building me-2"></i>Governing Law
                  </h2>
                  <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Ghaziabad, Uttar Pradesh.</p>
                </section>

                {/* Changes to Terms */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <i className="bi bi-pencil-square me-2"></i>Changes to Terms
                  </h2>
                  <p>We reserve the right to update, change, or replace any part of these Terms by posting updates to our website. Your continued use constitutes acceptance of those changes.</p>
                </section>

                {/* Contact Information */}
                <section className="legal-section">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <i className="bi bi-headset me-2"></i>Contact Information
                  </h2>
                  <div className="contact-card card bg-light border-success">
                    <div className="card-body">
                      <h5 className="text-success mb-3">Questions about the Terms?</h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <p><strong><i className="bi bi-telephone me-2"></i>Customer Support:</strong><br />+91 9625472793</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <p><strong><i className="bi bi-envelope me-2"></i>Email:</strong><br />foxecom99@gmail.com</p>
                        </div>
                        <div className="col-12">
                          <p><strong><i className="bi bi-geo-alt me-2"></i>Registered Office:</strong><br />
                          FOXECOM.IN, C/O: REDECOM TECH LABS PVT LTD<br />
                          703, 7th floor, Ahinsa Knd 2, Charms, Solita, Indirapuram,<br />
                          Sahibabad, Ghaziabad- 201010, Uttar Pradesh</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="alert alert-success mt-5">
                  <div className="d-flex">
                    <i className="bi bi-check-circle fs-4 me-3"></i>
                    <div>
                      <h5 className="alert-heading">Acceptance of Terms</h5>
                      <p className="mb-0">By using FOXECOM services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-footer bg-light py-3">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">© {new Date().getFullYear()} FOXECOM. All rights reserved.</small>
                <a href="/privacy-policy" className="btn btn-success btn-sm">
                  <i className="bi bi-shield-check me-1"></i> Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;