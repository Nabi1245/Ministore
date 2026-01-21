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

  const handleChange  = (e) =>{
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = (e) =>{
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

         },5000);
      return;
    }
        // ✅ Clear errors
        setError("")

        // 👉 Here you can call API / Email service

        console.log("Contact Form Data:", form);
        setSuccess("Thank you! We will contact you soon.");

         // ⏱️ Success message hide after 5 seconds

         setTimeout(()=>{
          setSuccess("");
         },5000)
         // Reset form

         setForm({
          name: "",
          email: "",
          phone: "",
          message: "",
         });
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow border-0">
              <div className="card-body p-4 m-5">
                <h3 className="fw-bold mb-3 text-center">Contact Us</h3>
                <p className="text-muted text-center mb-3 mt-3"></p>
                  Feel free to reach out to us. We’d love to hear from you.

                  {/* Alerts */}

                  {error && <div className='alert alert-danger'>{error}</div>}
                  {success && 
                    <div className='alert alert-success'>{success}</div> 
                  }
                  {/* FORM */}
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      {/* Name */}
                      <div className="col-md-6">
                        <label className="form-label">
                          Name <span className="text-danger">*</span>
                        </label>
                        <input 
                        type="text"
                        name='name'
                        className='form-control'
                        placeholder='Your name'
                        //required
                        value={form.name}
                        onChange={handleChange} 
                        />
                      </div>
                      {/* Email */}
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input 
                        type="email"
                        name='email'
                        className='form-control'
                        placeholder='you@example.com'
                        //required
                        value={form.email}
                        onChange={handleChange} 
                        />
                      </div>
                       {/* Phone */}
                       <div className="col-md-6">
                        <label className="form-label">
                          Phone <span className="text-danger">*</span>
                        </label>
                        <input 
                        type="tel"
                        name='phone'
                        className='form-control'
                        placeholder='Phone number'
                        //required
                        value={form.phone}
                        onChange={handleChange} 
                        />
                       </div>
                       {/* Message */}
                       <div className="col-12">
                        <label className="form-label">Message</label>
                          <textarea 
                          name="message"
                          className='form-control'
                          rows="4"
                          placeholder='Write your message...'
                          //required
                          value={form.message}
                          onChange={handleChange}
                          ></textarea>
                       </div>
                       {/* Submit */}
                       <div className="text-center mt-4">
                        <button type='submit' className="btn btn-primary px-5">
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