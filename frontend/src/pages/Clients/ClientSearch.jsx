import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ClientSearch = ({ invoiceData, setInvoiceData }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const typingTimeoutRef = useRef(null);
  const navigate = useNavigate(); 

  // Réinitialise le client à vide
  const resetClient = () => {
    setInvoiceData((prev) => ({
      ...prev,
      client: {
        raisonSocial: "",
        codeClient: "",
        representative: "", 
        phone: "",
        address: "",
        email: "",
      },
    }));
    setSuggestions([]);
    setNotFound(false);
  };

  // Recherche des clients côté serveur
  const handleSearch = async (value) => {
    setInvoiceData(prev => ({
      ...prev,
      client: { ...prev.client, raisonSocial: value }
    }));

    if (value.length === 0) return resetClient();

    if (value.length > 2) {
      try {
        const res = await axios.get(
          `http://localhost:8081/api/client/search?raisonSocial=${value}`
        );

        if (res.data.length > 0) {
          setSuggestions(res.data);
          setNotFound(false);
        } else {
          setSuggestions([]);
          setNotFound(true);
        }
      } catch {
        setSuggestions([]);
        setNotFound(true);
      }
    } else {
      setSuggestions([]);
      setNotFound(false);
    }
  };

  // Débounce pour limiter les requêtes
  const debounceSearch = (value) => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => handleSearch(value), 100);
  };

  // Lorsqu’un client est sélectionné
  const selectClient = (client) => {
    setInvoiceData(prev => ({
      ...prev,
      client: {
        raisonSocial: client.raisonSocial || "",
        codeClient: client.codeClient || "",
        representative: "", 
        phone: client.tel || "",       
        address: client.adress || "",  
        email: client.mail || ""      
      }
    }));
    setSuggestions([]);
    setNotFound(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={invoiceData.client.raisonSocial || ""}
        onChange={e => debounceSearch(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          notFound ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {/* Liste de suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded-md shadow-md mt-1 w-full max-h-40 overflow-y-auto z-10">
          {suggestions.map((c, i) => (
            <li
              key={i}
              onClick={() => selectClient(c)}
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              {c.raisonSocial} 
            </li>
          ))}
        </ul>
      )}

      {notFound && (
        <p className="text-gray-400 text-sm mt-1">
          Ce client n'existe pas,{" "}
          <span
            className="underline cursor-pointer text-blue-400"
            onClick={() => navigate("/menu-parametres/clients/creer-client")}
          >
            ajoutez-le
          </span>
          .
        </p>
      )}

    </div>
  );
};

export default ClientSearch;
