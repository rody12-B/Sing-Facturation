import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/img/logo.jpg'; 

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [formState, setFormState] = useState({ loading: false, errors: {}, showPassword: false, success: false });

  const validatePassword = (password) => !password ? "Le mot de passe est obligatoire" : null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formState.errors[name]) setFormState(prev => ({ ...prev, errors: { ...prev.errors, [name]: '' } }));
  };

  const validateForm = () => {
    const errors = { email: validateEmail(formData.email), password: validatePassword(formData.password) };
    Object.keys(errors).forEach(key => !errors[key] && delete errors[key]);
    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, loading: true }));

    try {
      const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);
      const { token, user } = data;
      if (token) {
        login(user, token);
        setFormState(prev => ({ ...prev, loading: false, success: true, errors: {} }));
      }
    } catch (error) {
      setFormState(prev => ({ ...prev, loading: false, errors: { submit: error.response?.data.message || "Authentification échouée" } }));
    }
  };

  useEffect(() => {
    if (formState.success) {
      const timer = setTimeout(() => navigate('/menu-dash'), 2000);
      return () => clearTimeout(timer);
    }
  }, [formState.success, navigate]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center'
      >

        {formState.success ? (
          <div>
            <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Bienvenue dans votre espace</h2>
            <div className='animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto' />
            <p className='text-sm text-gray-500 mt-2'>Redirection vers votre espace de travail...</p>
          </div>
        ) : (
          <>
            {/* Logo  */}
            <div className='mb-6 space-x-3 group'>
              <img
                src={Logo}
                alt="Logo"
                className='w-14 h-14 mx-auto rounded-full border-1  shadow-md  transition-transform duration-300 group-hover:scale-105'
                onClick={() => navigate('/')}
              />
                  <h6 className='text-gray-900 font-accent text-2xl tracking-wide group-hover:text-indigo-600'>Ravis de vous revoir !</h6>
            </div>
            
            <form onSubmit={handleSubmit} className='space-y-6 text-left'>
              {/* Email */}
              <div>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 transition-colors`}
                    placeholder='Entrez votre Email'
                  />
                </div>
                {formState.errors.email && <p className='text-red-500 text-sm mt-1 flex items-center'><AlertCircle className="w-4 h-4 mr-1" />{formState.errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type={formState.showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border ${formState.errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 transition-colors`}
                    placeholder='Entrez votre mot de passe'
                  />
                  <button
                    type='button'
                    onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    {formState.showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                  </button>
                </div>
                {formState.errors.password && <p className='text-red-500 text-sm mt-1 flex items-center'><AlertCircle className="w-4 h-4 mr-1" />{formState.errors.password}</p>}
              </div>

              {/* Submit errors */}
              {formState.errors.submit && <div className='bg-red-50 border-red-200 rounded-lg p-3'>
                <p className='text-red-700 text-sm flex items-center'><AlertCircle className='w-4 h-4 mr-2' />{formState.errors.submit}</p>
              </div>}

              <button
                type="submit"
                disabled={formState.loading}
                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
              >
                {formState.loading ? <><Loader className='w-5 h-5 animate-spin' /><span>En cours ...</span></> : <span>Connexion</span>}
              </button>

              <div className='text-center mt-4'>
                <p><Link to='#' className='text-gray-600 hover:text-blue-700 font-medium '>Mot de passe oublié ? <span className='text-gray-400'>|</span> </Link> <Link to='/dash' className='text-blue-600 hover:text-blue-700 font-medium'>S'inscrire</Link></p>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
