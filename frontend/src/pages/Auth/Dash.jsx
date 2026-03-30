import React from 'react';
import MultiForm from '../../compMulti/MultiForm';
import { FormProvider } from '../../mutliContext/FormContext'; 

function Dash() {
  return (
    <FormProvider> 
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6'>
        <MultiForm />
      </div>
    </FormProvider>
  );
}

export default Dash;
