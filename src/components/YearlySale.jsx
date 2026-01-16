import React from 'react'

const YearlySale = () => {
  return (
    <section 
      id="yearly-sale" 
      className="bg-light-blue overflow-hidden mt-5 padding-xlarge" 
      style={{
        backgroundImage: "url('/images/single-image1.png')",
        backgroundPosition: 'right',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="row d-flex flex-wrap align-items-center">
        <div className="col-md-6 col-sm-12">
          <div className="text-content offset-4 padding-medium">
            <h3>10% off</h3>
            <h2 className="display-2 pb-5 text-uppercase text-dark">New year sale</h2>
            <a href="shop.html" className="btn btn-medium btn-dark text-uppercase btn-rounded-none">Shop Sale</a>
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          
        </div>
      </div>
    </section>
  )
}

export default YearlySale

