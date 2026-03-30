import React, { useState } from 'react'
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Upload,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { validateEmail, validatePassword, validateAvatar } from '../../utils/helper';
import uploadImage from '../../utils/uploadImage';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { API_PATHS } from '../../utils/apiPaths';

const SignUp = () => {
  const  {login} = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    avatar: null,
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    avatarPreview: null, 
    success: false,
  });

  const handleInputChange = (e) => { 
    const { name, value}=e.target;
    setFormData(prev => ({
      ...prev,
      [name]:value
    }));

    if (formState.errors[name]){
      setFormState(prev =>({
        ...prev,
        errors: { ...prev.errors, [name]: ''}
      }));
    }
  };
  const handleRoleChange = (role) =>{
    setFormData((prev) => ({ ...prev, role}));
    if (formState.errors.role) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, role:""},
      }));
    }
  };


  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateAvatar(file);
      if (error) {
        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, avatar: error },
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, avatar: file }));
  
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormState((prev) => ({
          ...prev,
          avatarPreview: e.target.result,
          errors: { ...prev.errors, avatar: "" },
        }));
      };
      reader.readAsDataURL(file);
    }
  }; 
  
  

  const validateForm = () => {
    const errors = {
      fullName : !formData.fullName ? " Veuillez entrer votre nom" : "",
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      role: !formData.role ? "Veuillez selectionner votre role" : "",
      avatar: "",
    };

    // suppression des erreurs vide
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });
    setFormState((prev) => ({ ...prev, errors}));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    
    setFormState((prev) => ({ ...prev, loading: true }));

    try {
       let avatarUrl = "";
       //charger l'avatar si present
       if (formData.avatar) {
        const imgUploadRes = await uploadImage(formData.avatar);
        avatarUrl = imgUploadRes.imageUrl || "";
       }

       const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          avatar: avatarUrl || "",
       });

       //inscription reussi avec succes
       setFormState((prev) => ( {
          ...prev,
          loading: false,
          success: true,
          errors: {},

       }));

       const { token } = response.data ;

       if (token) {
        login(response.data, token);

        //redirection selon le role
        setTimeout(() => {
          window.location.href = 
          formData.role === "joueur"
           ? "/dash" 
           : "/dash";
          
            }, 2000);
          }
       
    }  catch (error) {
        console.log("erreur", error);
        setFormState((prev)  => ( {
          ...prev,
          loading: false,
          errors: {
            submit: 
              error.response?.data?.message || "Echec d'inscription. Veuillez recommencer !"
          },
        }));
    }
  };

  if (formState.success) {

    return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <motion.div 
        initial={{opacity: 0, scale :0.9}}
        animate={{opacity: 1, scale :1}}
        className='bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center'
      >
        <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4 '/>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Creation du compte reussi </h2>
        <p className='text-gray-600 mb-4'>
        Bienvenue parmi nous .. </p>
        <div className='animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto' />
        <p className='text-sm text-gray-500 mt-2'>Pret(e) à éffectuer vos factures</p>
      
        </motion.div>  
    </div>
    );
  }


  return <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8'>
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      className='bg-white p-8 rounded-xl shadow-lg max-w-md w-full'
    >
      <div className='text-center mb-8'>
        <h2 className='text-xl font-bold text-gray-900 mb-2'>
          Création de compte
        </h2>
        <p className='text-sm text-gray-600'>
          Créé(e) votre compte en quelques clics.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Nom
          </label>
          <div className='relative'>
            <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input 
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus-transparent transition-colors`}
              placeholder='Entrer votre nom'
            />
          </div>
          {formState.errors.fullName && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.fullName}
              </p>
            )}
        </div>
        
        <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
            Email
          </label>
          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus-transparent transition-colors`}
              placeholder='Entrer votre email'
            />
        </div>
        {formState.errors.email && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.email}
              </p>
          )}
        </div>

        <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
            Mot de passe
          </label>
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input 
              type={formState.showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus-transparent transition-colors`}
              placeholder='Veuillez créer un mot de passe robuste'
            />
            <button
                type='button'
                onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {formState.showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
        </div>
        {formState.errors.password && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.password}
              </p>
          )}
        </div>
        <div >
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Importez votre Logo (Optionnel)
          </label>
          <div className='flex items-center space-x-4'>
            <div className='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden'>
              {formState.avatarPreview ?(
                <img 
                  src={formState.avatarPreview}
                  alt='Avatar '
                  className='w-full h-full object-cover'
                />
              ) : ( 
                <User className='w-8 h-8 text-gray-400'  />
              )}
            </div>
            <div className='flex-1' >
              <input 
                type="file"
                id="avatar"
                accept='.jpg,.jpeg,.png'
                onChange={handleAvatarChange}
                className='hidden' 
                />
                <label 
                htmlFor='avatar'
                className='cursor-pointer bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2' 
                >
                  <Upload className='w-4 h-4' />
                  <span >Importez votre logo</span>
                </label>
                <p className='text-xs text-gray-500 mt-1'>JPG,PNG max 5MB</p>
            </div>
          </div>
          {formState.errors.avatar && (
            <p className='text-red-500 text-sm mt-l flex items-center'>
              <AlertCircle className='w-4 h-4 mr-1' />
              {formState.errors.avatar}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
             Je suis un ...
          </label>
          <div className='grid grid-cols-2 gap-4'>
            <button
              type="button"
              onClick={() => handleRoleChange("livreur")}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.role ==="livreur"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
              }`}
              >
                <UserCheck className='w-8 h-8 mx-auto mb-2' />
                <div className='font-medium'>Devis</div>
                <div className='text-xs text-gray-500'>
                  Marcelo umbro
                </div>
              </button>
              <button
              type="button"
              onClick={() => handleRoleChange("joueur")}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.role ==="joueur"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
              }`}
              >
                <Building2 className='w-8 h-8 mx-auto mb-2' />
                <div className='font-medium'>Joueur</div>
                <div className='text-xs text-gray-500'>
                  Marcelo umbro
                </div>
              </button>
          </div>
          {formState.errors.role && (
            <p className='text-red-500 text-sm mt-2 flex items-center'>
              <AlertCircle className='w-4 h-4 mr-1' />
              {formState.errors.role}
            </p>
          )}
        </div>

        {formState.errors.submit && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-3' >
            <p className='text-red-700 text-sm flex items-center'>
              <AlertCircle className='w-4 h-4 mr-2' />
              {formState.errors.submit}
            </p>
          </div>
        )}
        {/* submit button */}

        <button 
          type="submit"
          disabled={formState.loading}
          className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
          >
            {formState.loading ? ( 
              <>
                <Loader className='w-5 h-5 animate-spin' />
                <span>Creation du compte en cours...</span>
              </>
            ) : ( 
              <span > S'inscrire</span>
            )}
          </button>

          {/* lien de login */}
          <div className='text-center'>
            <p className='text-gray-600'>
              J'ai deja un compte?{" "}
              <a 
                href='/login'
                className='text-blue-600 hover:text-blue-700 font-medium'
              >
                Connectez-vous
              </a>
            </p>
          </div>
      </form>
      </motion.div>
  </div>
}

export default SignUp ;