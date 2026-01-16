import React from 'react'

const Instagram = () => {
  const instaItems = [
    { id: 1, image: '/images/insta-item1.jpg' },
    { id: 2, image: '/images/insta-item2.jpg' },
    { id: 3, image: '/images/insta-item3.jpg' },
    { id: 4, image: '/images/insta-item4.jpg' },
    { id: 5, image: '/images/insta-item5.jpg' },
  ]

  return (
    <section id="instagram" className="padding-large overflow-hidden no-padding-top">
      <div className="container">
        <div className="row">
          <div className="display-header text-uppercase text-dark text-center pb-3">
            <h2 className="display-7">Shop Our Insta</h2>
          </div>
          <div className="d-flex flex-wrap">
            {instaItems.map((item) => (
              <figure key={item.id} className="instagram-item pe-2">
                <a href="https://templatesjungle.com/" className="image-link position-relative">
                  <img src={item.image} alt="instagram" className="insta-image" />
                  <div className="icon-overlay position-absolute d-flex justify-content-center">
                    <svg className="instagram">
                      <use xlinkHref="#instagram"></use>
                    </svg>
                  </div>
                </a>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Instagram

