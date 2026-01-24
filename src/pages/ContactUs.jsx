import React, { useState } from 'react'

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
     
    // ✅ Basic validation
    if(
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.message.trim()
    ){
      setError("All fields are required");
      setSuccess("");

       // ⏱️ Error message hide after 5 seconds
         setTimeout(() => {
          setError("");
         }, 5000);
      return;
    }
        // ✅ Clear errors
        setError("")

        // 👉 Here you can call API / Email service

        console.log("Contact Form Data:", form);
        setSuccess("Thank you! We will contact you soon.");

         // ⏱️ Success message hide after 5 seconds

         setTimeout(() => {
          setSuccess("");
         }, 5000)
         // Reset form

         setForm({
          name: "",
          email: "",
          phone: "",
          message: "",
         });
  };

  return (
    <div className="padding-large">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-7 col-xl-6">
            <div className="card shadow-sm border-0">
              <div className="card-body p-3 p-md-4 p-lg-5">
                {/* Header */}
                <div className="text-center mb-4 mb-md-5">
                  <h2 className="h3 h-md-2 fw-bold mb-3" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                    Contact Us
                  </h2>
                 
                </div>

                {/* Alerts */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show mb-3 mb-md-4" role="alert">
                    <small>{error}</small>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError("")}
                      aria-label="Close"
                    ></button>
                  </div>
                )}
                {success && (
                  <div className="alert alert-success alert-dismissible fade show mb-3 mb-md-4" role="alert">
                    <small>{success}</small>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setSuccess("")}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="row g-3 g-md-4">
                    {/* Name */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold mb-2" style={{ fontSize: 'clamp(0.9rem, 2vw, 0.95rem)' }}>
                        Name <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text"
                        name="name"
                        className="form-control form-control-lg"
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                      />
                    </div>

                    {/* Email */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold mb-2" style={{ fontSize: 'clamp(0.9rem, 2vw, 0.95rem)' }}>
                        Email <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="email"
                        name="email"
                        className="form-control form-control-lg"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                      />
                    </div>

                    {/* Phone */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold mb-2" style={{ fontSize: 'clamp(0.9rem, 2vw, 0.95rem)' }}>
                        Phone <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="tel"
                        name="phone"
                        className="form-control form-control-lg"
                        placeholder="Phone number"
                        value={form.phone}
                        onChange={handleChange}
                        style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                      />
                    </div>

                    {/* Message */}
                    <div className="col-12">
                      <label className="form-label fw-semibold mb-2" style={{ fontSize: 'clamp(0.9rem, 2vw, 0.95rem)' }}>
                        Message <span className="text-danger">*</span>
                      </label>
                      <textarea 
                        name="message"
                        className="form-control form-control-lg"
                        rows="5"
                        placeholder="Write your message..."
                        value={form.message}
                        onChange={handleChange}
                        style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="col-12 text-center mt-3 mt-md-4">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg px-4 px-md-5 py-2 py-md-3"
                        style={{ 
                          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                          minWidth: '150px',
                          fontWeight: '600'
                        }}
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
