import React from 'react'
import Header from './Header'
import Hero from './Hero'
import Features from './Features'
import Footer from './Footer'


function Home() {
  return (
    <div className='min-h-screen '>      

        <Header/>
        <Hero/>
        <Features />
        <Footer/>
    </div>
  )
}

export default Home

