import React from 'react'
import{ Briefcase } from 'lucide-react';
import { useNavigate ,Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import logo  from '../assets/img/logo.jpg';

const Header = () => {
   
    const  {user, isAuthenticated} = useAuth();
    const navigate = useNavigate ();
  return <motion.header
        initial={{opacity:0, y: -20 }}
        animate={{ opacity:1, y:0}}
        transition={{duration:0.6}}
        className='fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-gray-100'
    >
    <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
            {/*logo */}
            <div className='flex items-center space-x-3'>
            <Link to="/" className="flex items-center space-x-3 group">
              <img src={logo} alt="logo" className="h-18 w-18 object-contain transition-transform duration-300 group-hover:scale-105" />
              <span className="text-gray-900 font-bold text-xl tracking-wide group-hover:text-indigo-600">OD-Partners</span>
            </Link>
            </div>

            {/* liens de navigation */}
            <nav className='hidden md:flex items-center space-x-8'>
                <a 
                   href='/'
                    className='text-lg text-gray-900 hover:text-gray-600  transition-colors font-medium'
                >
                Fonctionalités 
                </a>
                <a 
                    href='/'
                    className='text-lg text-gray-900 hover:text-gray-600 transition-colors font-medium'
                >
                Resources
                </a>
                <a 
                    href='/'
                    className='text-lg text-gray-900 hover:text-gray-600 transition-colors font-medium '
                >
                    Solutions
                </a>
                <a 
                    href='/'
                    className='text-lg text-gray-900 hover:text-gray-600 transition-colors font-medium '
                >
                    Tarifs 
                </a>
            </nav>

            {/* bouton d'authentifaction */}
            <div className='flex items-center space-x-3'>
                <a
                    href='/login'
                    className='text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-lg '
                >
                    Se connecter
                </a>
                <a
                    href='/dash'
                    className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sn hover:shadow-md'
                >
                    Inscription
                </a>
            </div>
        </div>
    </div>
  </motion.header>;
};

export default Header;