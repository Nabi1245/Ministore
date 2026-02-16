import React, { useEffect, useState } from 'react'
import Billboard from '../components/Billboard'
import CompanyServices from '../components/CompanyServices'
import FeaturedProducts from '../components/FeaturedProducts'
import LatestProducts from '../components/LatestProducts'
import BestSellers from '../components/BestSellers'
import MobileProducts from '../components/MobileProducts'
import SmartWatches from '../components/SmartWatches'
import YearlySale from '../components/YearlySale'
import Testimonials from '../components/Testimonials'
import Subscribe from '../components/Subscribe'
import { categoryAPI } from '../utils/api'

const Home = () => {
  const [mobileCategoryId, setMobileCategoryId] = useState(null)

  useEffect(() => {
    // Find mobile/case category for featured products
    const loadCategory = async () => {
      try {
        const data = await categoryAPI.getAll()
        // Handle both new format (with categories property) and legacy format (direct array)
        const categories = Array.isArray(data) ? data : (data?.categories || [])
        
        const mobileCategory = categories.find(cat => 
          cat.name && (
            cat.name.toLowerCase().includes('mobile') || 
            cat.name.toLowerCase().includes('case') ||
            cat.name.toLowerCase().includes('phone')
          )
        )
        if (mobileCategory) {
          setMobileCategoryId(mobileCategory.id)
        }
      } catch (error) {
        console.error('Error loading category:', error)
        // Silently fail - featured products will show all products
      }
    }
    loadCategory()
  }, [])

  return (
    <>
      <Billboard />
      <CompanyServices />
      
      {/* Featured Products Section */}
      <FeaturedProducts 
        title="Featured Products" 
        limit={8}
        showViewAll={true}
      />
      
      {/* Mobile Products Carousel */}
      <MobileProducts />
      
      {/* Best Sellers Section */}
      <BestSellers limit={8} />
      
      {/* Latest Arrivals */}
      {/* <LatestProducts limit={8} /> */}
      
      {/* Smart Watches (if available) */}
      {/* <SmartWatches /> */}
      
      {/* Yearly Sale Banner */}
      {/* <YearlySale /> */}
      
      {/* Testimonials */}
      {/* <Testimonials /> */}
      
      {/* Newsletter Subscription */}
      {/* <Subscribe /> */}
      
      {/* Instagram Feed */}
      {/* <Instagram /> */}
    </>
  )
}

export default Home
