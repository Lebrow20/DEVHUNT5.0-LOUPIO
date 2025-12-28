import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Service from '../components/Service'
import Footer from './Footer'

const Guest = () => {
  return (

    <div className=''>
      <Navbar />
      <div className="max-w-5xl mx-auto pt-10 px-6">
        <Hero />
      </div>
      <Service />
     <Footer />
    </div>
  
  )
}

export default Guest