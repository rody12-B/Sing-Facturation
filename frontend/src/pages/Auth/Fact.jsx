import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  ArrowLeft,
  Loader,
  EllipsisVertical,
  Download,
  X,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import axios from "axios";
import FormFac from "./FormFac";

// Fonction utilitaire pour formater le mois/année
const formatMonthYear = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("fr-FR", { month: "long", year: "numeric" });
};

// Grouper les factures par mois/année
const groupByMonth = (invoices) => {
  return invoices.reduce((groups, invoice) => {
    const key = formatMonthYear(invoice.invoice.date);
    if (!groups[key]) groups[key] = [];
    groups[key].push(invoice);
    return groups;
  }, {});
};

const Fact = () => {
  const [activeTab, setActiveTab] = useState("attente");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({}); 
  
  




  const menuRefs = useRef([]);
  const navigate = useNavigate();

  // --- Récupération des factures ---
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8081/api/invoice/get-facture")
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);


  // --- Fermer menu contextuel au clic à l'extérieur ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuId !== null &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId].contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  // --- Debounce recherche ---
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  // --- Organisation par statut ---
  const dataByTab = {
    attente: invoices.filter(
      (inv) => inv.statut === "attente" || inv.statut === "avance"
    ),
    retard: invoices.filter((inv) => inv.statut === "retard"),
    avance: invoices.filter((inv) => {
      const adv = inv.payment?.advanceAmount || 0;
      const tot = inv.totals?.total || 0;
      return adv > 0 && adv < tot;
    }),
    payees: invoices.filter((inv) => inv.statut === "payee"),
  };

  // --- Fonctions de calcul ---
  const sumAttente = (invoices) =>
    invoices.reduce((sum, inv) => {
      const total = inv.totals?.total || 0;
      const adv = inv.payment?.advanceAmount || 0;
      if (inv.statut === "payee") return sum;
      if (inv.statut === "avance") return sum + Math.max(total - adv, 0);
      return sum + total;
    }, 0);

  const sumPaid = (invoices) =>
    invoices.reduce((sum, inv) => {
      const total = inv.totals?.total || 0;
      const adv = inv.payment?.advanceAmount || 0;
      if (inv.statut === "payee") return sum + total;
      if (inv.statut === "avance") return sum + adv;
      return sum;
    }, 0);

  const sumAvance = (invoices) =>
    invoices.reduce((sum, inv) => {
      const adv = inv.payment?.advanceAmount || 0;
      const tot = inv.totals?.total || 0;
      return sum + (adv > 0 && adv < tot ? adv : 0);
    }, 0);

  // --- Navigation ---
  const handleCreateInvoice = () =>
    navigate("/menu-facture/creer-facture/facturation");
  const handleBackToList = () => setShowCreateForm(false);
  const handleView = (id) => navigate(`/menu-facture/creer-facture/details/${id}`);
  /*const handleEdit = (id) => navigate(`/menu-facture/creer-facture/edit/${id}`); */
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette facture ?")) return;
    try {
      await axios.delete(
        `http://localhost:8081/api/invoice/supprimer-facture/${id}`
      );
      setInvoices(invoices.filter((inv) => inv._id !== id));
    } catch (err) {
      console.error("Erreur suppression facture:", err);
    }
  };


  const handleMarkAsPaid = async (id) => {
    try {
      await axios.put(`http://localhost:8081/api/invoice/update-status/${id}`, {
        statut: "payee",
      });
      // Recharger la liste
      const res = await axios.get("http://localhost:8081/api/invoice/get-facture");
      setInvoices(res.data);
    } catch (err) {
      console.error("Erreur mise à jour statut :", err);
    }
  };
  // --- Filtrage selon recherche ---
  const filterInvoices = (list) =>
    list.filter((inv) =>
      [
        inv.invoice?.number,
        inv.invoice?.date?.split("T")[0],
        inv.service?.subject,
        inv.client?.raisonSocial,
      ].some((f) => f?.toLowerCase().includes(debouncedSearch.toLowerCase()))
    );

  // --- TABLEAU grouper par mois ---
  const Table = ({ invoices }) => {
    const groupedInvoices = groupByMonth(invoices);

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Ref</th>
              <th className="text-left px-4 py-2">Opération</th>
              <th className="text-left px-4 py-2">Client</th>
              <th className="text-right px-4 py-2">Montant</th>
              <th className="text-center px-4 py-2">Statut</th>
              <th className="text-center px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-blue-500 italic">
                  <Loader className="h-5 w-5 animate-spin inline mr-2" />
                  Chargement...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400 italic">
                  Aucune facture trouvée
                </td>
              </tr>
            ) : (
              Object.entries(groupedInvoices).map(([month, monthInvoices]) => (
                <React.Fragment key={month}>
                  <tr className="bg-blue-100 text-blue-800 font-semibold">
                    <td colSpan="7" className="px-4 py-2 uppercase">
                      {month}
                    </td>
                  </tr>
                  {monthInvoices.map((invoice, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-200 hover:bg-blue-50 transition cursor-pointer"
                      onClick={(e) => {
                        if (
                          e.target.tagName !== "BUTTON" &&
                          e.target.tagName !== "svg" &&
                          e.target.tagName !== "path"
                        )
                          handleView(invoice._id);
                      }}
                    >
                      <td className="px-4 py-2">{invoice.invoice.date.split("T")[0]}</td>
                      <td className="px-4 py-2">{invoice.invoice.number}</td>
                      <td className="px-4 py-2">{invoice.service.subject}</td>
                      <td className="px-4 py-2">{invoice.client.raisonSocial}</td>
                      <td className="px-4 py-2 text-right font-bold">
                        <span className="text-gray-800">
                          Total : {(invoice.totals?.total || 0).toFixed(2)} FCFA
                        </span>
                        {activeTab === "attente" && invoice.payment?.advanceAmount > 0 && (
                          <span className="block text-blue-600 text-sm">
                            Reste à payer : {((invoice.totals?.total || 0) - invoice.payment.advanceAmount).toFixed(2)} FCFA
                          </span>
                        )}
                        {activeTab === "avance" && invoice.payment?.advanceAmount > 0 && (
                          <span className="block text-yellow-600 text-sm">
                            Avance reçue : {invoice.payment.advanceAmount.toFixed(2)} FCFA
                          </span>
                        )}
                        {activeTab === "payees" && (
                          <span className="block text-green-600 text-sm">
                             Payée intégralement
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-2 text-center">
                        {invoice.statut === "attente" && (
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
                            En attente
                          </span>
                        )}
                        {invoice.statut === "retard" && (
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                            En retard
                          </span>
                        )}
                        {invoice.statut === "avance" && (
                          <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs font-semibold">
                            Avance
                          </span>
                        )}
                        {invoice.statut === "payee" && (
                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                            Payée
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-2 text-center">
                        <div
                          className="relative"
                          ref={(el) => (menuRefs.current[invoice._id] = el)}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const viewportHeight = window.innerHeight;
                              const direction = viewportHeight - rect.bottom < 150 ? "up" : "down";
                              setMenuPosition((prev) => ({ ...prev, [invoice._id]: direction }));
                              setOpenMenuId(openMenuId === invoice._id ? null : invoice._id);
                            }}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded"
                          >
                            <EllipsisVertical size={18} />
                          </button>

                          {openMenuId === invoice._id && (
                            <div
                              className={`absolute right-0 w-40 bg-white border border-gray-200 shadow-md z-20 transition-all duration-150 ease-out ${
                                menuPosition[invoice._id] === "up" ? "bottom-10 origin-bottom" : "top-10 origin-top"
                              }`}
                            >
                             <button
                                onClick={() => {
                                  window.open(`http://localhost:8081/api/invoice/download/${invoice._id}`, "_blank");
                                  setOpenMenuId(null);
                                }}
                                className="flex items-center   px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                              >
                                <Download className="w-3 h-3 mr-2" />
                                Télécharger PDF
                              </button>
                              {invoice.statut !== "payee" && (
                                <button
                                  onClick={() => {
                                    handleMarkAsPaid(invoice._id);
                                    setOpenMenuId(null);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                                >
                                  <Check className="w-3 h-3 mr-2" />
                                   Marquer  payée
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  handleDelete(invoice._id);
                                  setOpenMenuId(null);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-red-600 "
                              > <X className="w-3 h-3 mr-2" />
                                Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // --- Rendu final ---
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {showCreateForm ? (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> 
            Retour à la liste
          </button>
          <FormFac />
        </div>
      ) : (
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-xl font-bold text-blue-400">
                <CountUp end={sumAttente(dataByTab.attente)} decimals={2} /> FCFA
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">En retard</p>
              <p className="text-xl font-bold text-red-400">
                <CountUp end={sumAttente(dataByTab.retard)} decimals={2} /> FCFA
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Paiement par avance</p>
              <p className="text-xl font-bold text-yellow-400">
                <CountUp end={sumAvance(invoices)} decimals={2} /> FCFA
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Total payé</p>
              <p className="text-xl font-bold text-green-400">
                <CountUp end={sumPaid(invoices)} decimals={2} /> FCFA
              </p>
            </div>
          </div>

          {/* Recherche + Bouton création */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher une facture"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-sm text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleCreateInvoice}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-sm shadow-sm hover:to-emerald-500"
            >
              <Plus className="h-4 w-4 mr-2" /> Créer une facture
            </button>
          </div>

          {/* Onglets */}
          <div className="border-b flex gap-6 text-sm text-gray-600">
            {["attente", "retard", "avance", "payees"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-2 ${
                  activeTab === tab
                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                    : "hover:text-blue-500"
                }`}
              >
                {tab === "attente"
                  ? "Attente de paiement"
                  : tab === "retard"
                  ? "Retard de paiement"
                  : tab === "avance"
                  ? "Paiement par avance"
                  : "Payées"}
                <span className="ml-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full px-2">
                  {dataByTab[tab]?.length || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Tableau */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Table invoices={filterInvoices(dataByTab[activeTab])} />
          </div>
        </>
      )}
    </div>
  );
};

export default Fact;
