import { createContext, useState } from "react";

export const AppContext = createContext();

export const initialInvoiceData = {
  title: "Facture",
  company: { logo: "", name: "", email: "", number: "", address: "" },
  client: { raisonSocial: "", representative: "", phone: "", address: "", email: "" },
  service: { subject: "" },
  invoice: { number: "", date: "" },
  items: [{ reference: "", designation: "", price: "", qty: "", description: "", tva: 18, total: 0, totalTTC: 0 }],
  account: { method: "", number: "", rib: "" },
  tax: 0,
  subtotal: 0,
  netTotal: 0,
  notes: "",
  statut: "attente",
  payment: {
    advancePercent: "",
    advanceAmount: "",
    advanceDate: "",
    remainingPercent: "",
    remainingAmount: "",
    remainingDate: "",
  },
  chiffreAffaire: 0,   
  gesttionsCharges: 0, 
  caisse: 0,           
  banque: 0,  
};

export const AppContextProvider = ({ children }) => {
  const [invoiceTitle, setInvoiceTitle] = useState("Facture");
  const [invoiceData, setInvoiceData] = useState(initialInvoiceData);
  const [selectedTemplate, setSelectedTemplate] = useState("Temp1");
  

  return (
    <AppContext.Provider
      value={{ invoiceTitle, setInvoiceTitle, invoiceData, setInvoiceData, selectedTemplate, setSelectedTemplate, initialInvoiceData }}
    >
      {children}
    </AppContext.Provider>
  );
};
