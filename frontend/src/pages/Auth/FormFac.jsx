import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { ChevronLeft , Pencil, Upload,Eye } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import FacForm from "../../Components/FacForm";
import TemplateGrid from "../../Components/TemplateGrid";
import InvoiceView from "../../Components/InvoiceView";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";



const FormFac = () => {
  
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const {invoiceTitle, setInvoiceTitle,
      invoiceData, setInvoiceData,
      setSelectedTemplate,
    } = useContext(AppContext)

    const handleTemplateClik = (templateId) => {
      const hasInvalidItem = invoiceData.items.some(
        (item) => !item.qty || !item.price
      );
    
      if (hasInvalidItem) {
        toast.error("Veuillez entrer les champs manquants");
        return;
      }
    
      setSelectedTemplate(templateId); 
      console.log(templateId);
      navigate(`/preview`);
    };
    

  const handleTitleChange = (e) => {
      const newTitle = e.target.value;
      setInvoiceTitle(newTitle);
      setInvoiceData((prev) => ({
        ...prev,
        title: newTitle,
      }));
  }

  const handleTitleEdit = () => {
      setIsEdit(true)
  }

  const handleTitleBlur = () => {
      setIsEdit(false);
  }

 
  
  const handleBack = () => {
    navigate("/menu-facture/creer-facture");
  };
  return (
        
    <div className=" w-full  min-h-screen py-4">
    <div className="max-w-7xl mx-auto px-4  space-y-6">
      {/* Bouton retour */}
      <button
        onClick={handleBack}
        className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded shadow-sm hover:to-emerald-500 transition"
      >
        <ChevronLeft className="w-4 h-4"   />
        Retour aux factures
      </button>
  
      {/* Titre ou champ d'édition */}
      <div className="bg-white border border-gray-300 rounded shadow-sm p-3 mb-4">
        <div className="flex  items-center text-center">
          {isEdit ? (
            <input
              type="text"
              className="border  rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
              onBlur={handleTitleBlur}
              onChange={handleTitleChange}
              value={invoiceTitle}
            />
          ) : (
            <>
              <h5 className="text-lg font-semibold mr-2">{invoiceTitle}</h5>
              <button className="p-1 text-blue-600 hover:text-blue-800 transition cursor-pointer"
                onClick={handleTitleEdit}
              >
                <Pencil className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
  
    {/* Conteneur principal avec 2 panneaux redimensionnables */}
    <PanelGroup direction="horizontal" className="gap-2 mt-4">
      {/* FacForm */}
      <Panel defaultSize={50} minSize={40} maxSize={70}>
        <div className="bg-white border border-gray-300 rounded shadow-sm p-4 h-full overflow-auto">
          <FacForm />
        </div>
      </Panel>

      {/* Barre de séparation draggable */}
      <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-400 cursor-col-resize rounded" />

      {/* InvoiceView */}
      <Panel defaultSize={50} minSize={40} maxSize={70}>
        <div className="bg-white border border-gray-300 rounded shadow-sm p-4 h-full overflow-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => handleTemplateClik(1)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded shadow-sm hover:to-emerald-500 transition"
            >
              <Eye className="w-4 h-4 mr-2" />
              Visualiser
            </button>
          </div>
          <InvoiceView />
        </div>
      </Panel>
    </PanelGroup>
    </div>
  </div> 
  );
};

export default FormFac;
