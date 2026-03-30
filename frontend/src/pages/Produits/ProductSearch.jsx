import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const ProductSearch = ({ index, invoiceData, setInvoiceData }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const typingTimeoutRef = useRef(null);
  const navigate = useNavigate(); 


  // Réinitialise le produit
  const resetProduct = () => {
    const items = [...invoiceData.items];
    items[index] = {
      ...items[index],
      designation: "",
      price: 0,
    };
    setInvoiceData(prev => ({ ...prev, items }));
    setSuggestions([]);
    setNotFound(false);
  };

  // Recherche des produits côté serveur
  const handleSearch = async (value) => {
    const items = [...invoiceData.items];
    items[index].designation = value;
    setInvoiceData(prev => ({ ...prev, items }));

    if (value.length === 0) return resetProduct();

    if (value.length > 2) {
      try {
        const res = await axios.get(`http://localhost:8081/api/produit/search?nom=${value}`);

        if (res.data.length > 0) {
          setSuggestions(res.data);
          setNotFound(false);
        } else {
          setSuggestions([]);
          setNotFound(true);
        }
      } catch (err) {
        console.error(err);
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

  // Lorsqu’un produit est sélectionné
  const selectProduct = (product) => {
    const items = [...invoiceData.items];
    items[index] = {
      ...items[index],
      designation: product.nom || "",
      price: product.prixUnitaire  || 0,
    };
    setInvoiceData(prev => ({ ...prev, items }));
    setSuggestions([]);
    setNotFound(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={invoiceData.items[index].designation || ""}
        onChange={e => debounceSearch(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          notFound ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
        placeholder="Entrez votre produit ou service..."
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded-md shadow-md mt-1 w-full max-h-40 overflow-y-auto z-10">
          {suggestions.map((p, i) => (
            <li
              key={i}
              onClick={() => selectProduct(p)}
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              {p.nom}  
            </li>
          ))}
        </ul>
      )}

        {notFound && (
        <p className="text-gray-400 text-sm mt-1">
          Ce produit n'existe pas,{" "}
          <span
            className="underline cursor-pointer text-blue-400"
            onClick={() => navigate("/menu-parametres/config-db/creer-produit")}
          >
            ajoutez-le
          </span>
          .
        </p>
      )}
    </div>
  );
};

export default ProductSearch;