import React from 'react'
import Billboard from '../components/Billboard'
import CompanyServices from '../components/CompanyServices'
import MobileProducts from '../components/MobileProducts'
import SmartWatches from '../components/SmartWatches'
import YearlySale from '../components/YearlySale'
import LatestBlog from '../components/LatestBlog'
import Testimonials from '../components/Testimonials'
import Subscribe from '../components/Subscribe'
import Instagram from '../components/Instagram'

const Home = () => {
  return (
    <>
      <Billboard />
      <CompanyServices />
      <MobileProducts />
      <SmartWatches />
      <YearlySale />
      <LatestBlog />
      <Testimonials />
      <Subscribe />
      <Instagram />
    </>
  )
}

export default Home
