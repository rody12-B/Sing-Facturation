import React, { useState } from 'react';
import { User, Upload, AlertCircle } from "lucide-react"; 
import { useNavigate, Link } from 'react-router-dom';
import { useFormContext } from '../mutliContext/FormContext';
import { validateAvatar } from '../utils/helper';
import Logo from '../assets/img/logo.jpg'; 


function PersonnelInfo() {
  const { formData, errors, updateFormData } = useFormContext();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarError, setAvatarError] = useState("");
  const navigate = useNavigate();
 

  const handleChange = (field, value) => {
    updateFormData('personnelInfo', {
      ...formData.personnelInfo,
      [field]: value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateAvatar(file);
      if (error) {
        setAvatarError(error);
        return;
      }
      setAvatarError("");
      handleChange("avatar", file);

      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className='mb-6 group text-center'>
          <img
            src={Logo}
            alt="Logo"
            className='w-14 h-14 mx-auto rounded-full border-1 shadow-md transition-transform duration-300 group-hover:scale-105'
            onClick={() => navigate('/')}
          />
          <h3 className='mt-2 text-gray-900 font-bold text-xl tracking-wide group-hover:text-indigo-600'>
            Profil Entreprise
          </h3>
      </div>
      {/* Formulaire */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Raison sociale */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Raison sociale</label>
          <input
            type="text"
            value={formData.personnelInfo.raisonSocial}
            onChange={(e) => handleChange("raisonSocial", e.target.value)}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500/20
            focus:border-blue-500 text-sm transition-all duration-200 bg-white/50 backdrop-blur-sm ${
              errors.raisonSocial
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
            placeholder="Entrer votre nom"
          />
          {errors.raisonSocial && (
            <div className="text-red-500 text-xs mt-0.5">{errors.raisonSocial}</div>
          )}
        </div>

        {/* NIF */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">NIF</label>
          <input
            type="text"
            value={formData.personnelInfo.nif}
            onChange={(e) => handleChange("nif", e.target.value)}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500/20
            focus:border-blue-500 text-sm transition-all duration-200 bg-white/50 backdrop-blur-sm ${
              errors.nif
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
            placeholder="Numéro d’Identification Fiscale"
          />
          {errors.nif && (
            <div className="text-red-500 text-xs mt-0.5">{errors.nif}</div>)}
        </div>

        {/* Date */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Date de création</label>
          <input
            type="date"
            value={formData.personnelInfo.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500/20
            focus:border-blue-500 text-sm transition-all duration-200 bg-white/50 backdrop-blur-sm ${
              errors.date
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
          />
          {errors.date && <div className="text-red-500 text-xs mt-0.5">{errors.date}</div>}
        </div>

        {/* Statut */}
        <div className="space-y-1">
  <label className="text-xs font-semibold text-gray-700">
    Statut Juridique
  </label>
  <select
    value={formData.personnelInfo.statut}
    onChange={(e) => handleChange("statut", e.target.value)}
    className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500/20
      focus:border-blue-500 text-sm transition-all duration-200 bg-white/50 backdrop-blur-sm
      ${
        errors.statut
          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
          : "border-gray-200 hover:border-gray-300"
      }`}
  >
    <option value="">Selectionner votre statut</option>
    <option value="EI">Entreprise individuelle (EI)</option>
    <option value="SARL">Société à Responsabilité Limitée (SARL)</option>
    <option value="SAS">Société par Actions Simplifiée (SAS)</option>
    <option value="aucun">Aucun</option>
  </select>

  {errors.statut && (
    <div className="text-red-500 text-xs mt-0.5">{errors.statut}</div>
  )}
</div>


      {/* Avatar */}
      <div className="space-y-1 col-span-1 md:col-span-2">
        <label className="text-xs font-semibold text-gray-700">Avatar / Logo</label>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-3">
          
          {/* Prévisualisation du logo */}
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Avatar Preview" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <User className="w-4 h-4 text-gray-400" />
            )}
          </div>

          {/* Upload bouton */}
          <div className="flex flex-col">
            <input 
              type="file" 
              id="avatar" 
              accept=".jpg,.jpeg,.png" 
              onChange={handleAvatarChange} 
              className="hidden" 
            />
            <label 
              htmlFor="avatar" 
              className="cursor-pointer bg-gray-50 border border-gray-300 rounded-lg px-3 py-1 text-xs font-medium hover:bg-gray-100 flex items-center space-x-1"
            >
              <Upload className="w-3 h-3" />
              <span>Importer un logo</span>
            </label>
            <p className="text-xs text-gray-500 mt-0.5">JPG, PNG max 5MB</p>

            {/* Erreurs */}
            {(avatarError || errors.avatar) && (
              <p className="text-red-500 text-xs mt-0.5 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {avatarError || errors.avatar}
              </p>
            )}
          </div>
        </div>
      </div>

      </div>
    </div>
  );
}

export default PersonnelInfo;
