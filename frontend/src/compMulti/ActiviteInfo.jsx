import React, { useState } from "react";
import {  Lock ,EyeOff, Eye } from "lucide-react";
import { useFormContext } from "../mutliContext/FormContext";
import Logo from '../assets/img/logo.jpg'; 


function ActiviteInfo() {
  const { formData, errors, updateFormData } = useFormContext();
  const activiteInfo = formData?.activiteInfo ?? {};

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    updateFormData("activiteInfo", {
      ...activiteInfo,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className='mb-6 group text-center'>
          <img
            src={Logo}
            alt="Logo"
            className='w-14 h-14 mx-auto rounded-full border-1 shadow-md transition-transform duration-300 group-hover:scale-105'
          />
          <h3 className='mt-2 text-gray-900 font-bold text-xl tracking-wide group-hover:text-indigo-600'>
            Paramètres  de l'Activité
          </h3>
      </div>

      {/* Type d'activité et TVA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type Activité */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">
            Votre service
          </label>
          <select
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-gray-300"
            value={activiteInfo.typeActivite ?? ""}
            onChange={(e) => handleChange("typeActivite", e.target.value)}
          >
            <option value="">Quelle est votre activité</option>
            <option value="Production & Vente">Production et Vente</option>
            <option value="Achat & Revente">Achat et Revente</option>
            <option value="Prestation & Service">Prestation de services</option>
            <option value="BTP">BTP</option>
            <option value="autre">Autre</option>
          </select>
          {errors?.typeActivite && (
            <p className="text-red-500 text-xs mt-0.5">{errors.typeActivite}</p>
          )}
        </div>

        {/* TVA Oui / Non */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">
            Êtes-vous assujetti à la TVA  ?
          </label>
          <div className="flex gap-4">
            {/* Oui */}
            <label className="inline-flex items-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-lg bg-white/50 hover:border-gray-300 text-sm cursor-pointer">
              <input
                type="radio"
                name="tva"
                checked={activiteInfo.tva === true}
                onChange={() => handleChange("tva", true)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Oui</span>
            </label>

            {/* Non */}
            <label className="inline-flex items-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-lg bg-white/50 hover:border-gray-300 text-sm cursor-pointer">
              <input
                type="radio"
                name="tva"
                checked={activiteInfo.tva === false}
                onChange={() => handleChange("tva", false)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Non</span>
            </label>
          </div>
          {errors?.tva && <p className="text-red-500 text-xs mt-0.5">{errors.tva}</p>}
        </div>
      </div>

      {/* Mot de passe + Confirmation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Mot de passe</label>
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ' />
          <input
              type={showPassword ? "text" : "password"}
              value={activiteInfo.password ?? ""}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`w-full pl-10 py-2  px-3 py-2 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200  ${
              errors?.password ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 hover:border-gray-300"
            }`}
            placeholder="Entrer votre mot de passe"
          />
          <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
            </button>
          </div>
          {errors?.password && <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Confirmation</label>
          <div className='relative'>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={activiteInfo.confirmPassword ?? ""}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className={`w-full   px-3 py-2 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
              errors?.confirmPassword ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 hover:border-gray-300"
            }`}
            placeholder="Confirmer votre mot de passe"
          />
          <button
              type='button'
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              {showConfirmPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
            </button>
          </div>
          {errors?.confirmPassword && <p className="text-red-500 text-xs mt-0.5">{errors.confirmPassword}</p>}
        </div>
      </div>
    </div>
  );
}

export default ActiviteInfo;
