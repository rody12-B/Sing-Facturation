import { useContext, useRef } from "react";
import { templates } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import InvoicePreview from "./InvoicePreview";
import { ChevronLeft, Save  } from "lucide-react";



const Preview = () => {
  const previewRef = useRef();
  const navigate = useNavigate();
  const { selectedTemplate, invoiceData ,setSelectedTemplate} = useContext(AppContext);

  // --- Fonction pour enregistrer une facture ---
  const handleSaveInvoice = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/invoice/creer-facture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        const savedInvoice = await response.json();
        alert("✅ Facture enregistrée avec succès !");
        console.log("Facture sauvegardée :", savedInvoice);
      } else {
        alert("❌ Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Erreur API:", error);
      alert("⚠️ Impossible de contacter le serveur");
    }
  };

  return (
    <div className="previewpage flex flex-col p-3 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ">
      
      {/* Boutons d'action */}
      <div className="flex flex-col items-center mb-6 gap-4">

        {/* Liste des templates */}
        <div className="flex flex-wrap justify-center gap-2">
          {templates.map(({ id, label }) => (
            <button
              key={id}
              style={{ minWidth: "100px", height: "38px" }}
              onClick={() => setSelectedTemplate(id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedTemplate === id 
                  ? "bg-blue-400 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
          
      </div>

      {/* Affichage du template */}
      <div className="flex-1 overflow-auto flex justify-center items-start  p-3 rounded">
      
        <div ref={previewRef} >
        <div className="flex w-full justify-between items-center  ">
          <button
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded shadow-sm hover:to-emerald-500 transition"
          >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Retour
          </button>
          <button
              onClick={handleSaveInvoice}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded shadow-sm hover:to-emerald-500 transition"
          >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
          </button>
      </div>
        <InvoicePreview invoiceData={invoiceData} template={selectedTemplate} />
      </div>
      </div>
    </div>
  );
};

export default Preview;
