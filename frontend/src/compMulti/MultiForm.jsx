// MultiForm.jsx
import { Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFormContext } from '../mutliContext/FormContext';
import { stepIcons } from '../utils/Icon';
import PersonnelInfo from './PersonnelInfo';
import ContactInfo from './ContactInfo';
import ActiviteInfo from './ActiviteInfo';
import RevuInfo from './RevuInfo';

function MultiForm() {
  const { steps, currentStep, nextStep, prevStep, handleSubmit, isSubmited } = useFormContext();
  

  const renderStepContent = () => {
    switch(currentStep){
      case 1: return <PersonnelInfo />;
      case 2: return <ContactInfo />;
      case 3: return <ActiviteInfo />;
      case 4: return <RevuInfo />;
      default: return null;
    }
  };

  if (isSubmited) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='min-h-screen flex items-center justify-center  px-4'
      >
        <div className='max-w-2xl mx-auto p-6 text-center bg-white  rounded-xl shadow-lg'>
          <div className='relative mb-6'>
            <div className='w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl'>
              <Check className='w-10 h-10 text-white' />
            </div>
            
          </div>
          <h2 className='text-2xl  font-accent text-gray-900 mb-2'>
            Compte créé avec succès
          </h2>
          <p className='text-sm text-gray-600 font-accent mb-6 max-w-md mx-auto leading-relaxed'>
            Vous êtes maintenant prêt à vous connecter et à explorer toutes nos offres.
          </p>
          <button className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-semibold'>
            <a href='/login'>Connectez-vous</a>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='max-w-3xl mx-auto p-4'
    >
      {/* Etapes */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          {steps.map((step, index) => {
            const Icon = stepIcons[step.id];
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div className='flex items-center' key={step.id}>
                <div className='flex flex-col items-center'>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                    isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}>
                    {isCompleted ? <Check className='w-5 h-5' /> : <Icon className='w-5 h-5' />}
                  </div>
                  <p className={`text-xs font-bold mt-1 ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-500' : 'text-gray-500'}`}>
                    Étape {step.id}: {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-12 h-1 mx-2 rounded-full transition-all duration-500 ${
                    currentStep > step.id ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile */}
        <div className='sm:hidden'>
          <div className='flex justify-between items-center mb-2 text-xs font-semibold'>
            <span>Étape {currentStep}/{steps.length}</span>
            <span>{steps[currentStep-1].title}</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
            <div
              className='bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-700'
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contenu formulaire */}
      <div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6'>
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className='flex justify-between items-center'>
        <button
          className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            currentStep === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-50 shadow border border-gray-200 transform hover:-translate-y-0.5"
          }`}
          onClick={prevStep}
        >
          <ChevronLeft className='w-4 h-4 mr-1' /> Retour
        </button>
        {currentStep < steps.length ? (
          <button
            className='flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200'
            onClick={nextStep}
          >
            Suivant <ChevronRight className='w-4 h-4 ml-1' />
          </button>
        ) : (
          <button
            className='px-6 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200'
            onClick={handleSubmit}
          >
            Enregistrer
          </button>
        )}
      </div>
      
      <div className='text-center'>
        <div className='text-center mt-4'>
          <p className='text-gray-600 '>J’ai déjà un compte, <Link to='/login' className='text-blue-600 hover:text-blue-700 font-medium'>je me connecte</Link></p>
        </div>
      </div>
    </motion.div>
  );
}

export default MultiForm;
