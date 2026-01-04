import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Service from '../components/Service'
import Footer from './Footer'
import ChatBot from '../components/Chatbot.jsx'
import Loader from '../components/Loader'

const Accueil = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className=''>
      <Navbar />
      <div className="max-w-5xl mx-auto pt-10 px-6">
        <Hero />
      </div>

      <Service />
      <Footer />
      <ChatBot />
    </div>
  )
}

export default Accueil