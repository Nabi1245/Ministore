import React from 'react'

const PrivacyPolicy = () => {
  return (
     <div className="legal-container container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">
          <div className="legal-card card shadow-lg border-0">
            <div className="card-header bg-success text-white py-4">
              <h1 className="h2 mb-0"><i className="bi bi-shield-check me-3"></i>Privacy Policy</h1>
              <p className="mb-0 opacity-75">Last Updated: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="card-body p-4 p-md-5">
              <div className="legal-content">
                <div className="mb-5">
                  <p className="lead">
                    FOXECOM.IN is promoted by REDECOM TECH LABS PVT LTD registered under the Companies Act, 2013 (18 of 2013). We are committed to protecting your privacy. This Privacy Policy outlines how FOXECOM collects, uses, and safeguards your personal information.
                  </p>
                </div>

                {/* SECTION 1 */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <span className="badge bg-success me-2">1</span>
                    KYC (Know Your Customer): What Do We Do With Your Information?
                  </h2>
                  <p>When you purchase products from our store, as part of the buying and selling process, we collect the personal information you give us such as your:</p>
                  <ul className="custom-list">
                    <li>Name</li>
                    <li>Address</li>
                    <li>Contact details</li>
                    <li>Email address</li>
                  </ul>
                  <p>When you browse our store, we also automatically receive your computer's internet protocol (IP) address to provide us with information that helps us learn about your browser and operating system.</p>
                  <div className="alert alert-success mt-3">
                    <strong>Email Marketing:</strong> With your permission, we may send you emails, messages, texts over WhatsApp, etc about our store, new products, and other updates.
                  </div>
                </section>

                {/* SECTION 2 */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <span className="badge bg-success me-2">2</span>
                    Consent
                  </h2>
                  <h5 className="text-success mt-3">How do you get my consent?</h5>
                  <p>When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent us to collect data out of it and using it for that specific reason only.</p>
                  <p>If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your expressed consent, or provide you with an opportunity to say no.</p>
                  
                  <h5 className="text-success mt-4">How do I withdraw my consent?</h5>
                  <p>If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or disclosure of your information, at any time, by contacting us.</p>
                  
                  <div className="contact-info-card card border-success mt-3">
                    <div className="card-body">
                      <h6 className="card-title text-success"><i className="bi bi-telephone me-2"></i>Contact for Consent Withdrawal</h6>
                      <ul className="list-unstyled mb-0">
                        <li><strong>Phone:</strong> +91 9625472793</li>
                        <li><strong>Email:</strong> foxecom99@gmail.com</li>
                        <li className="mt-2">
                          <strong>Address:</strong><br />
                          FOXECOM.IN, C/O: REDECOM TECH LABS PVT LTD<br />
                          703, 7th floor, Ahinsa Knd 2, Charms, Solita, Indirapuram,<br />
                          Sahibabad, Ghaziabad- 201010, Uttar Pradesh
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* SECTION 3 */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <span className="badge bg-success me-2">3</span>
                    Disclosure
                  </h2>
                  <p>We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.</p>
                </section>

                {/* SECTION 4 */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <span className="badge bg-success me-2">4</span>
                    Payment
                  </h2>
                  <p>If you choose a direct payment gateway to complete your purchase, then FOXECOM will store your credit card data. It is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS).</p>
                  <div className="alert alert-light border">
                    <p className="mb-2"><strong>Payment Partners:</strong></p>
                    <div className="d-flex flex-wrap gap-3">
                      <span className="badge bg-secondary">RuPay</span>
                      <span className="badge bg-secondary">VISA</span>
                      <span className="badge bg-secondary">MasterCard</span>
                      <span className="badge bg-secondary">American Express</span>
                      <span className="badge bg-secondary">Discover</span>
                    </div>
                  </div>
                </section>

                {/* SECTION 5 */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <span className="badge bg-success me-2">5</span>
                    Third-Party Services
                  </h2>
                  <p>In general, the third-party providers used by us will only collect, use, and disclose your information to the extent necessary to allow them to perform the services they provide to us.</p>
                  <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Once you leave our store's website or are redirected to a third-party website or application, you are no longer governed by this Privacy Policy.
                  </div>
                </section>

                {/* SECTION 6 */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <span className="badge bg-success me-2">6</span>
                    Security
                  </h2>
                  <p>We implement multiple security measures to protect your information:</p>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="security-feature p-3 border rounded mb-3">
                        <h6 className="text-success"><i className="bi bi-shield-lock me-2"></i>SSL Encryption</h6>
                        <p className="small mb-0">Secure Socket Layer technology for data transmission</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="security-feature p-3 border rounded mb-3">
                        <h6 className="text-success"><i className="bi bi-key me-2"></i>AES-256 Encryption</h6>
                        <p className="small mb-0">Advanced encryption standard for data storage</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION 7 */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <span className="badge bg-success me-2">7</span>
                    Cookies
                  </h2>
                  <p>We use cookies to enhance your browsing experience. Here are the cookies we use:</p>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-success">
                        <tr>
                          <th>Cookie Name</th>
                          <th>Type</th>
                          <th>Purpose</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><code>_session_id</code></td>
                          <td>Sessional</td>
                          <td>Stores information about your session (referrer, landing page, etc.)</td>
                        </tr>
                        <tr>
                          <td><code>_secure_session_id</code></td>
                          <td>Sessional</td>
                          <td>Secure session identifier</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* SECTION 8-10 */}
                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <span className="badge bg-success me-2">8</span>
                    Age of Consent
                  </h2>
                  <p>By using this site, you represent that you have at least attained the age of majority in your state or province of residence.</p>
                </section>

                <section className="legal-section mb-5">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <span className="badge bg-success me-2">9</span>
                    Changes to This Privacy Policy
                  </h2>
                  <p>We reserve the right to modify this privacy policy at any time. Changes will take effect immediately upon their posting on the website.</p>
                </section>

                <section className="legal-section">
                  <h2 className="h4 text-success mb-4 border-bottom pb-2">
                    <span className="badge bg-success me-2">10</span>
                    Questions and Contact Information
                  </h2>
                  <p>If you would like to access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information:</p>
                  <div className="contact-card card bg-light border-success mt-3">
                    <div className="card-body">
                      <h5 className="text-success"><i className="bi bi-headset me-2"></i>Contact Our Privacy Compliance Officer</h5>
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <p><strong><i className="bi bi-telephone me-2"></i>Phone:</strong><br />+91 9625472793</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong><i className="bi bi-envelope me-2"></i>Email:</strong><br />foxecom99@gmail.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="alert alert-info mt-5">
                  <div className="d-flex">
                    <i className="bi bi-info-circle fs-4 me-3"></i>
                    <div>
                      <h5 className="alert-heading">Your Privacy Matters</h5>
                      <p className="mb-0">By accessing or using our services, you agree to the practices described in this policy.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-footer bg-light py-3">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">FOXECOM &copy; {new Date().getFullYear()}</small>
                <a href="/terms" className="btn btn-outline-success btn-sm">
                  View Terms & Conditions <i className="bi bi-arrow-right ms-1"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy