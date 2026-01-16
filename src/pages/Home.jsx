import React from 'react'
import Header from '../components/Header'
import SearchPopup from '../components/SearchPopup'
import Billboard from '../components/Billboard'
import CompanyServices from '../components/CompanyServices'
import MobileProducts from '../components/MobileProducts'
import SmartWatches from '../components/SmartWatches'
import YearlySale from '../components/YearlySale'
import LatestBlog from '../components/LatestBlog'
import Testimonials from '../components/Testimonials'
import Subscribe from '../components/Subscribe'
import Instagram from '../components/Instagram'
import Footer from '../components/Footer'
import SVGSymbols from '../components/SVGSymbols'

const Home = ({ isLoggedIn,setIsLoggedIn }) => {
  return (
    <>
      <SVGSymbols />
      <SearchPopup />
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      <Billboard />
      <CompanyServices />
      <MobileProducts />
      <SmartWatches />
      <YearlySale />
      <LatestBlog />
      <Testimonials />
      <Subscribe />
      <Instagram />
      <Footer />
    </>
  )
}

export default Home

