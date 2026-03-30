import { Plus, Trash2, EllipsisVertical, Loader, X } from 'lucide-react';
import axios from "axios";
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../context/AppContext';
import ClientSearch from '../pages/Clients/ClientSearch';
import ProductSearch from '../pages/Produits/ProductSearch';

const FacForm = () => {
  const { invoiceData, setInvoiceData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  // Génère une référence en fonction de l'index
  const generateReference = (index) => {
    const num = (index + 1).toString().padStart(3, "0");
    return `P${num}`;
  };

  // Initialiser la première ligne si aucun item n'existe
  useEffect(() => {
    if (!invoiceData.items || invoiceData.items.length === 0) {
      setInvoiceData((prev) => ({
        ...prev,
        items: [{
          reference: generateReference(0), // P001
          designation: "",
          price: 0,
          qty: 0,
          tva: 18,
          description: "",
          total: 0,
          totalTTC: 0,
        }],
      }));
    } else {
      // Vérifie si la première référence est vide
      setInvoiceData((prev) => {
        const items = [...prev.items];
        if (!items[0].reference) {
          items[0].reference = generateReference(0);
        }
        return { ...prev, items };
      });
    }
  }, []);
  
  // Ajout d'un article
  const addItem = () => {
    setInvoiceData((prev) => {
      const newItems = [
        ...prev.items,
        {
          reference: generateReference(prev.items.length), 
          designation: "",
          price: 0,
          qty: 0,
          tva: 18,
          remiseValue: 0,
          remiseType: null,
          showRemise: false,
          description: "",
          total: 0,
          totalTTC: 0,
        },
      ];
      return { ...prev, items: newItems };
    });
  };

  
  // Récupération des données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:8081/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const user = res.data;

        setInvoiceData(prev => ({
          ...prev,
          company: {
            logo: user.personnelInfo?.avatar || "",
            name: user.personnelInfo?.raisonSocial || "",
            email: user.contactInfo?.email || "",
            number: user.contactInfo?.num || "",
            address: user.contactInfo?.codePostal || "",
          },
          invoice: {
            ...prev.invoice,
            date: new Date().toISOString().split("T")[0],
          },
        }));
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setInvoiceData]);

  // Suppression d'un article
  const deleteItem = (index) => {
    setInvoiceData((prev) => {
      const newItems = prev.items.filter((_, i) => i !== index);
      const updatedItems = newItems.map((item, i) => ({
        ...item,
        reference: generateReference(i),
      }));
      return { ...prev, items: updatedItems };
    });
  };

  // Modification des champs simples
  const handleChange = (section, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // Modification des items
  const handleItemChange = (index, field, value) => {
    const items = [...invoiceData.items];
    items[index][field] = value;
  
    const qty = Number(items[index].qty) || 0;
    const price = Number(items[index].price) || 0;
    const tva = Number(items[index].tva) || 0;
  
    // Total avant remise
    const totalBeforeRemise = qty * price;
  
    // Calcul de la remise
    let remiseAmount = 0;
    if (items[index].showRemise && items[index].remiseValue > 0) {
      if (items[index].remiseType === "percent") {
        remiseAmount = (totalBeforeRemise * items[index].remiseValue) / 100;
      } else if (items[index].remiseType === "fixed") {
        remiseAmount = items[index].remiseValue;
      }
    }
  
    // Total après remise (ne jamais négatif)
    const totalHT = Math.max(totalBeforeRemise - remiseAmount, 0);
  
    // Total TTC
    const tvaAmount = (totalHT * tva) / 100;
    const totalTTC = totalHT + tvaAmount;
  
    items[index].totalBeforeRemise = totalBeforeRemise;
    items[index].remiseAmount = remiseAmount;
    items[index].total = totalHT;
    items[index].totalTTC = totalTTC;
  
    setInvoiceData(prev => ({ ...prev, items }));
  };
  
  

  // Calcul des totaux globaux
  const calculateTotals = () => {
    let subtotal = 0;
    let totalTVA = 0;
    let totalRemise = 0;
  
    invoiceData.items.forEach(item => {
      const tva = Number(item.tva) || 0;
  
      subtotal += item.total || 0;
      totalTVA += ((item.total || 0) * tva) / 100;
      totalRemise += item.remiseAmount || 0;
    });
    
    let css = subtotal * 0.01 ;
      const netAmount =  subtotal + css + totalTVA ;

      return { subtotal, totalTVA, netAmount, totalRemise, css };
    };
  

  const { subtotal, totalTVA, netAmount, totalRemise, css } = calculateTotals();

  useEffect(() => {
    const { subtotal, totalTVA, netAmount, totalRemise, css } = calculateTotals();
    setInvoiceData(prev => ({
      ...prev,
      totals: {
        subtotal,
        totalRemise,
        totalTVA,
        css,
        total: netAmount
      }
    }));
  }, [invoiceData.items]);
  
  
  

  // --- Ref pour stocker les refs de chaque menu
  const menuRefs = useRef([]);

  // Gestion du clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openIndex !== null &&
        menuRefs.current[openIndex] &&
        !menuRefs.current[openIndex].contains(event.target)
      ) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openIndex]);

  // Fonction utilitaire pour formater en FCFA sans virgule
  const formatFCFA = (value) => {
    if (isNaN(value)) return "0 FCFA";
    return `${Math.round(value).toLocaleString("fr-FR")} FCFA`;
  };

  // Upload du logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData((prev) => ({
          ...prev,
          company: {
            ...prev.company,
            logo: reader.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Fonction loader pour les champs ---
  const renderInput = (value, onChange, placeholder = "", type = "text") => {
    return loading ? (
      <div className="flex items-center justify-center h-10 border border-gray-300 rounded-md">
        <Loader className="animate-spin text-blue-500" size={20} />
      </div>  
    ) : (
      <input
        type={type}
        value={value || ""}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  };

  // Génération automatique du numéro de facture
  useEffect(() => {
    if (!invoiceData.invoice.number) {
      const randomNumber = `FACT-${Math.floor(
        100000 + Math.random() * 900000
      )}`;
      setInvoiceData(prev => ({
        ...prev,
        invoice: { ...prev.invoice, number: randomNumber },
      }));
    }
  }, []);

  // ---- Gestion avance / reste ----
  const handleAdvanceChange = (value) => {
    const total = invoiceData.totals?.total || 0;
    const advanceAmount = Number(value) || 0;
    const remainingAmount = total - advanceAmount;
    const advancePercent = total > 0 ? (advanceAmount / total) * 100 : 0;
    const remainingPercent = total > 0 ? (remainingAmount / total) * 100 : 0;
  
    setInvoiceData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        advanceAmount,
        advancePercent: Number(advancePercent.toFixed(2)),
        remainingAmount: Number(remainingAmount.toFixed(2)),
        remainingPercent: Number(remainingPercent.toFixed(2)),
      },
    }));
  };
  
  const handleAdvancePercentChange = (value) => {
    const total = invoiceData.totals?.total || 0;
    const advancePercent = Number(value) || 0;
    const advanceAmount = (advancePercent / 100) * total;
    const remainingAmount = total - advanceAmount;
    const remainingPercent = 100 - advancePercent;
  
    setInvoiceData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        advanceAmount: Number(advanceAmount.toFixed(2)),
        advancePercent: Number(advancePercent.toFixed(2)),
        remainingAmount: Number(remainingAmount.toFixed(2)),
        remainingPercent: Number(remainingPercent.toFixed(2)),
      },
    }));
  };
  

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-6 bg-white shadow rounded-lg">

      {/* Logo */}
      <div className="mb-4">
        <h5 className="text-base text-blue-400 font-accent font-semibold mb-2">Logo</h5>
        <div className="flex items-center gap-3">
          <label htmlFor="image" className="cursor-pointer">
            {loading ? (
              <Loader className="animate-spin text-blue-500" size={40} />
            ) : (
              <img
                src={invoiceData.company.logo}
                alt="upload"
                className="w-20 h-20 object-cover border-gray-300 hover:opacity-90 transition"
              />
            )}
          </label>
          <input
            type="file"
            id="image"
            name="logo"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </div>
      </div>

      {/* Informations de la compagnie */}
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col">
            <label className="text-sm text-blue-400 font-accent mb-1">Compagnie</label>
            {renderInput(invoiceData.company.name, (e) => handleChange("company", "name", e.target.value))}
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-blue-400 font-accent mb-1">E-mail</label>
            {renderInput(invoiceData.company.email, (e) => handleChange("company", "email", e.target.value), "", "email")}
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-blue-400 font-accent mb-1">Téléphone</label>
            {renderInput(invoiceData.company.number, (e) => handleChange("company", "number", e.target.value), "", "tel")}
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-blue-400 font-accent mb-1">Adresse</label>
            {renderInput(invoiceData.company.address, (e) => handleChange("company", "address", e.target.value))}
          </div>
        </div>
      </div>

      {/* Référence client */}
      <div className="mb-4">
        <h5 className="text-sm text-gray-700 font-accent font-semibold mb-2">Référence client</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col">
            <label className="text-sm font-accent text-blue-400 mb-1">Raison sociale</label>
            <ClientSearch invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
          </div>

          {/* Représentant (saisie libre) */}
          <div className="flex flex-col">
            <label className="text-sm text-blue-400 font-accent mb-1">Représentant</label>
            <input
              type="text"
              value={invoiceData.client.representative}
              onChange={e => handleChange('client', 'representative', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-blue-400 font-accent mb-1">Téléphone</label>
            <input
              type="tel"
              value={invoiceData.client.phone}
              onChange={e => handleChange('client', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-blue-400 font-accent mb-1">Adresse</label>
            <input
              type="text"
              value={invoiceData.client.address}
              onChange={e => handleChange('client', 'address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm text-blue-400 font-accent mb-1">E-mail</label>
            <input
              type="email"
              value={invoiceData.client.email}
              onChange={e => handleChange('client', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Infos facture */}
      <div className="mb-4">
        <h5 className="text-base text-gray-700 font-accent font-semibold mb-2">Détails de la facture</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Numéro de facture */}
          <div className="flex flex-col">
            <label className="text-sm text-blue-400 font-accent mb-1">Numéro de facture</label>
            <input
              type="text"
              placeholder="Numéro de facture"
              value={invoiceData.invoice.number}
              onChange={e => handleChange('invoice', 'number', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date de la facture */}
          <div className="flex flex-col">
            <label className="text-sm font-accent text-blue-400 mb-1">Date facture</label>
            <input
              type="date"
              placeholder="Date facture"
              value={invoiceData.invoice.date}
              onChange={e => handleChange('invoice', 'date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Statut de la facture */}
          <div className="flex flex-col">
            <label className="text-sm font-accent text-blue-400 mb-1">Statut de la facture</label>
            <select
              value={invoiceData.statut || "attente"}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, statut: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="attente" className="text-base font-accent">En Attente</option>
              <option value="retard" className="text-base font-accent">Retard de paiement</option>
              <option value="avance" className="text-base font-accent">Paiement par avance</option>
              <option value="payee" className="text-base font-accent">Payée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Objet */}
      <div className="mb-4">
        <h5 className="text-base text-gray-700 font-accent font-semibold mb-2">Objet de la facture</h5>
        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            value={invoiceData.service.subject}
            onChange={e => handleChange('service', 'subject', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Articles */}
      <div className="mb-4">
        <h5 className="text-base text-gray-700 font-accent font-semibold mb-2">Détails de l'article / service</h5>

        {invoiceData.items.map((item, index) => (
          <div key={index} className="bg-white border border-gray-300 rounded-md p-4 mb-4 shadow-sm">
            {/* Désignation large en haut */}
            <div className="mb-3">
              <label className="text-sm text-blue-400 font-accent mb-1 block">Désignation</label>
              <ProductSearch index={index} invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
            </div>

            {/* Champs principaux alignés en flex pour gérer les largeurs */}
            <div className="flex gap-3 mb-3 items-end">
              {/* Référence - petite largeur */}
              <div className="flex flex-col w-24">
                <label className="text-sm text-blue-400 font-accent mb-1">Réf.</label>
                <input
                  type="text"
                  value={item.reference}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
                />
              </div>

              {/* PUHT - plus large */}
              <div className="flex flex-col flex-grow">
                <label className="text-sm font-accent text-blue-400 mb-1">PUHT</label>
                <input
                  type="number"
                  value={item.price}
                  onChange={e => handleItemChange(index, 'price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Quantité - largeur moyenne */}
              <div className="flex flex-col w-20">
                <label className="text-sm font-accent text-blue-400 mb-1">Qté/jr/hrs</label>
                <input
                  type="number"
                  value={item.qty}
                  onChange={e => handleItemChange(index, 'qty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* TVA - plus petit */}
              <div className="flex flex-col w-16">
                <label className="text-sm font-accent text-blue-400 mb-1">TVA %</label>
                <input
                  type="number"
                  value={item.tva}
                  onChange={e => handleItemChange(index, 'tva', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div
                className="relative"
                ref={(el) => (menuRefs.current[index] = el)}
              >
                {/* Bouton menu */}
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded cursor-pointer"
                >
                  <EllipsisVertical size={18} />
                </button>

                {/* Menu style "popup" */}
                {openIndex === index && (
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 shadow-md z-20">
                    <button
                      onClick={() => {
                        const items = [...invoiceData.items];
                        items[index].showRemise = true;   
                        items[index].remiseType = "percent"; 
                        setInvoiceData(prev => ({ ...prev, items }));
                        setOpenIndex(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    >
                      Ajouter une remise
                    </button>
                    <button
                      onClick={() => {
                        deleteItem(index);
                        setOpenIndex(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>

            {item.showRemise && (
              <div className="flex items-center mt-2 justify-between">
                <label className="text-sm font-accent text-blue-400">Remise</label>
                <input
                  type="number"
                  value={item.remiseValue}
                  onChange={(e) =>
                    handleItemChange(index, "remiseValue", Number(e.target.value))
                  }
                  className="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <select
                  value={item.remiseType}
                  onChange={(e) =>
                    handleItemChange(index, "remiseType", e.target.value)
                  }
                  className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="percent">%</option>
                  <option value="fixed">FCFA</option>
                </select>

                {/* Bouton X pour supprimer la remise */}
                <button
                  onClick={() => {
                    const items = [...invoiceData.items];
                    items[index].showRemise = false;
                    items[index].remiseValue = 0;
                    items[index].remiseType = null;
                    handleItemChange(index, 'price', items[index].price);
                    setInvoiceData(prev => ({ ...prev, items }));
                  }}
                  className="ml-2 text-red-600 hover:text-red-800 font-bold text-lg"
                  title="Supprimer la remise"
                >
                  <X />
                </button>
              </div>
            )}

            {/* Totaux par article */}
            <div className="text-right font-semibold text-gray-700">
            <div className='font-accent'>Total HT: {formatFCFA(item.totalBeforeRemise)}</div>
              {item.showRemise && item.remiseAmount > 0 && (
                <div className="font-accent">
                  Remise: {item.remiseType === "percent"
                    ? `${item.remiseValue}% (${formatFCFA(item.remiseAmount)})`
                    : formatFCFA(item.remiseAmount)}
                </div>
              )}
              <div className='font-accent'>Total TTC: {formatFCFA(item.totalTTC)}</div>
            </div>
          </div>
        ))}

        {/* Bouton ajouter une ligne */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 font-accent bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-lg shadow-sm hover:to-emerald-500 transition cursor-pointer"
          >
            <Plus size={16} />
            Ligne
          </button>

          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 font-accent bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-lg shadow-sm hover:to-emerald-500 transition cursor-pointer"
          >
            <Plus size={16} />
            Débours
          </button>
        </div>
      </div>

      {/* Totaux */}
      <div className="mb-4">
        <h5 className="text-base text-gray-700 font-accent font-semibold">Total</h5>
        <div className="flex justify-end">
          <div className="w-full md:w-1/2">
          {totalRemise > 0 && (
              <div className="flex justify-between">
                <span className='font-accent mb-1'>Remises</span>
                <span className='font-accent'>- {formatFCFA(totalRemise)}</span>
              </div>  
            )}
            <div className="flex justify-between">
              <span className='font-accent mb-1'>Sous total</span>
              <span className='font-accent'>{formatFCFA(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className='font-accent mb-1'>CSS 1%</span>
              <span className='font-accent'>{formatFCFA(css)} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span className='font-accent mb-1'>Montant TVA</span>
              <span className='font-accent'>{formatFCFA(totalTVA)} FCFA</span>
            </div>
            <div className="flex justify-between font-bold mt-2">
              <span className='font-accent mb-1'>Montant TTC</span>
              <span className='font-accent'>{formatFCFA(netAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modalités de paiement */}
      <div className="mb-4">
        <h5 className="text-sm text-gray-700 font-accent font-semibold mb-2">Modalités de paiement</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            value={invoiceData.account.method}
            onChange={e => handleChange('account', 'method', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner le mode de paiement</option>
            <option value="virement">Virement bancaire</option>
            <option value="espèces">Espèces</option>
            <option value="chèque">Chèque</option>
            <option value="mobile">Mobile Money</option>
          </select>
          <input
            type="text"
            placeholder="Numéro de compte / référence"
            value={invoiceData.account.number}
            onChange={e => handleChange('account', 'number', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="RIB"
            value={invoiceData.account.rib}
            onChange={e => handleChange('account', 'rib', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
          />
        </div>
      </div>

      {/* Conditions de règlement */}
      <div className="mb-4">
        <h5 className="text-base text-gray-700 font-accent font-semibold mb-2">Conditions de règlement</h5>

        {/* Montant avancé et date */}
        <div className="mb-3 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-sm text-blue-400 font-accent mb-1 block">Avance %</label>
            <input
              type="number"
              value={invoiceData.payment.advancePercent}
              onChange={e => handleAdvancePercentChange(e.target.value)}
              placeholder="%"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-blue-400 font-accent mb-1 block">Montant avancé</label>
            <input
              type="number"
              value={invoiceData.payment.advanceAmount}
              onChange={e => handleAdvanceChange(e.target.value)}
              placeholder="FCFA"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-blue-400 font-accent mb-1 block">Date avance</label>
            <input
              type="date"
              value={invoiceData.payment.advanceDate || ''}
              onChange={e => handleChange('payment', 'advanceDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Reste à verser et date échéance */}
        <div className="mb-3 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-sm text-blue-400 font-accent mb-1 block">Reste %</label>
            <input
              type="number"
              value={invoiceData.payment.remainingPercent}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-sm text-blue-400 font-accent mb-1 block">Montant restant</label>
            <input
              type="number"
              value={invoiceData.payment.remainingAmount}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-sm text-blue-400 font-accent mb-1 block">Date échéance</label>
            <input
              type="date"
              value={invoiceData.payment.remainingDate || ''}
              onChange={e => handleChange('payment', 'remainingDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacForm;
