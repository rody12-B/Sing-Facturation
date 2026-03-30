import React, { forwardRef } from 'react'
import { formainvoiceData } from '../utils/formainvoiceData.js';
import  Temp1  from "../templates/Template1/Temp1.jsx";
import { templateComponent } from '../utils/invoiceTemplate.js';


const InvoicePreview =forwardRef(({invoiceData, template}, ref) => {

        const formatteData= formainvoiceData(invoiceData);

        const SelectedTemplate = templateComponent[template] || templateComponent["Temp1"];

  return (
    <div ref={ref} >
        <SelectedTemplate  data={formatteData} />
    </div>
  )
});

export default InvoicePreview;