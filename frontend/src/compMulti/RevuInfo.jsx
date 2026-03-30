import React from 'react';
import { MapPinHouse, Mail, User, ChartNoAxesCombined } from "lucide-react";
import { useFormContext } from '../mutliContext/FormContext';
import Logo from '../assets/img/logo.jpg'; 

function RevuInfo() {
  const { formData } = useFormContext();

  const renderField = (label, value) => (
    <div>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <p className="text-sm font-semibold text-gray-900">{value || 'Pas précisé'}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-3xl space-y-6 overflow-auto">
        {/* Header */}
        <div className='mb-6 group text-center'>
          <img
            src={Logo}
            alt="Logo"
            className='w-14 h-14 mx-auto rounded-full border-1 shadow-md transition-transform duration-300 group-hover:scale-105'
          />
          <h3 className='mt-2 text-gray-900 font-bold text-xl tracking-wide group-hover:text-indigo-600'>
            Résumé & Validation
          </h3>
      </div>

        {/* Informations personnelles */}
        <div className="bg-gradient-to-t from-white to-blue-50/20 backdrop-blur-sm border-2 border-blue-200/50 rounded-2xl p-4 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
              <User className="w-3 h-3 text-white" />
            </div>
            Informations personnelles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {renderField("Raison Sociale", formData.personnelInfo.raisonSocial)}
            {renderField("Date de création", formData.personnelInfo.date)}
            {renderField("NIF", formData.personnelInfo.nif)}
            {renderField("Statut Juridique", formData.personnelInfo.statut)}
          </div>
        </div>

        {/* Coordonnées */}
        <div className="bg-gradient-to-t from-white to-blue-50/20 backdrop-blur-sm border-2 border-blue-200/50 rounded-2xl p-4 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
              <MapPinHouse className="w-3 h-3 text-white" />
            </div>
            Coordonnées
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {renderField("Adresse E-mail", formData.contactInfo.email)}
            {renderField("Région", formData.contactInfo.region)}
            {renderField("Code Postal", formData.contactInfo.codePostal)}
            {renderField("Numéro Téléphone", formData.contactInfo.num)}
          </div>
        </div>

        {/* Activité */}
        <div className="bg-gradient-to-t from-white to-blue-50/20 backdrop-blur-sm border-2 border-blue-200/50 rounded-2xl p-4 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
              <ChartNoAxesCombined className="w-3 h-3 text-white" />
            </div>
            Activité
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {renderField("Votre service", formData.activiteInfo.typeActivite)}
            {renderField("Soumis à la TVA", formData.activiteInfo.tva ? "Oui" : "Non")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevuInfo;
