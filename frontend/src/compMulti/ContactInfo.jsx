import React from 'react';
import { Mail , Phone } from "lucide-react";
import { useFormContext } from '../mutliContext/FormContext';
import Logo from '../assets/img/logo.jpg'; 


function ContactInfo() {
  const { formData, errors, updateFormData } = useFormContext();


  const handleChange = (field, value) => {
    updateFormData('contactInfo', {
      ...formData.contactInfo,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className='mb-6 group text-center'>
          <img
            src={Logo}
            alt="Logo"
            className='w-14 h-14 mx-auto rounded-full border-1 shadow-md transition-transform duration-300 group-hover:scale-105'
          />
          <h3 className='mt-2 text-gray-900 font-bold text-xl tracking-wide group-hover:text-indigo-600'>
          Contacts & Localisation
          </h3>
      </div>

      {/* Formulaire */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Adresse E-mail</label>
          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input
            type="email"
            value={formData.contactInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full pl-10 py-2  px-3 py-2 border-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20
              focus:border-blue-500  transition-all duration-200 ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            placeholder="exemple@gmail.com"
          />
          </div>
          {errors.email && <div className="text-red-500 text-xs mt-0.5">{errors.email}</div>}
        </div>

        {/* Code postal */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Code Postal</label>
          <input
            type="text"
            value={formData.contactInfo.codePostal}
            onChange={(e) => handleChange("codePostal", e.target.value)}
            className={`w-full px-3 py-2 border-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20
              focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                errors.codePostal
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            placeholder="Code postal"
          />
          {errors.codePostal && <div className="text-red-500 text-xs mt-0.5">{errors.codePostal}</div>}
        </div>

        {/* Region */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Région</label>
          <select
            value={formData.contactInfo.region}
            onChange={(e) => handleChange("region", e.target.value)}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500/20
            focus:border-blue-500 text-sm transition-all duration-200 bg-white/50 backdrop-blur-sm
            ${
              errors.region
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <option>Indiquez votre région</option>
            <option value="Libreville">Libreville</option>
            <option value="Port-Gentil">Port-Gentil</option>
            <option value="Franceville">Franceville</option>
            <option value="Oyem">Oyem</option>
          </select>
          {errors.region && (
          <div className="text-red-500 text-xs mt-0.5">{errors.region}</div>
        )}
        </div>

        {/* Numéro de téléphone */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Numéro de téléphone</label>
          <div className='relative'>
            <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'  />
          <input
            type="tel"
            value={formData.contactInfo.num}
            onChange={(e) => handleChange("num", e.target.value)}
            className={`w-full pl-10 py-2  px-3 py-2 border-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20
              focus:border-blue-500  transition-all duration-200 ${
                errors.num
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            placeholder="Entrer votre numéro"
          />
          </div>
          {errors.num && <div className="text-red-500 text-xs mt-0.5">{errors.num}</div>}
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
