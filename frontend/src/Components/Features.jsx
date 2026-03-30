import React from 'react'
import { employerFeatures, jobSeekerFeatures } from '../utils/db'


const Features = () => {
  return (
   <section className='py-20 bg-white relative overflow-hidden'>
    <div className='container mx-auto px-4 relative z-10'>
        <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-accent text-gray-900 mb-6'>
                Tous ce que tu veux savoir sur
                <span className='block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    les factures
                </span>
            </h2>
            <p className='tex-xl text-gray-600 max-w-3xl mx-auto'>
                Lors de la cration de vos factures vous pouvez avoir des souscriptions
                cela se fait avec abonnements que  nous vous offrons.
            </p>
        </div>

        <div className='grid md:grid-cols-2 gap-16 lg:gap-24'>
            <div>
                <div className='text-center mb-12'>
                    <h3 className='text-3xl font-bold text-gray-900 mb-4'>
                        Les factures
                    </h3>
                    <div className='w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full' />
                </div>

                <div className='space-y-8'>
                    {jobSeekerFeatures.map((feature, index) => (
                        <div 
                            key={index}
                            className='group flex items-start space-x-4 p-6 rounded-2xl hover:bg-blue-50 transition-all duration-300 cursor-pointer'
                        > 
                            <div className='flex-shrink-0 w-12  h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors'>
                                <feature.icon className='w-6 h-6 text-blue-600' />
                            </div>
                            <div>
                                <h4 className='text-xl font-semibold text-gray-900 mb-2 '>
                                    {feature.title}
                                </h4>
                                <p className='text-gray-600 leading-relaxed'>
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
        <div>
            <div className='text-center mb-12'>
                <h3 className='text-3xl font-bold text-gray-900 mb-4'>
                    Pour les devis
                </h3>
                <div className='w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-600 mx-auto rounded-full' />
            </div>
            <div className='space-y-8'>
                {employerFeatures.map((feature, index) => (
                    <div 
                    key={index}
                    className='group flex items-start space-x-4 p-6 rounded-2xl hover:bg-blue-50 transition-all duration-300 cursor-pointer'
                > 
                    <div className='flex-shrink-0 w-12  h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors'>
                        <feature.icon className='w-6 h-6 text-blue-600' />
                    </div>
                    <div>
                        <h4 className='text-xl font-semibold text-gray-900 mb-2 '>
                            {feature.title}
                        </h4>
                        <p className='text-gray-600 leading-relaxed'>
                            {feature.description}
                        </p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
    </div>
   </section>
  )
}

export default Features