import React, { useState } from "react";
import { Plus, Search } from "lucide-react";

const Devis = () => {
  const [activeTab, setActiveTab] = useState("attente");

  const tabs = [
    { id: "brouillons", label: "Brouillons", count: 0 },
    { id: "attente", label: "Attente ", count: 0 },
    { id: "retard", label: "Validés", count: 0 },
    { id: "avance", label: "Annulés", count: 0 },
  ];

  // Données factices par statut
  const dataByTab = {
    brouillons: [],
    attente: [
      {
        date: "21 Août",
        ref: "RF-3G-7S",
        code: "2025-08-FAC3",
        client: "Test Client",
        montant: 3000,
        montantHT: 2500,
        statut: "En attente ",
      },
    ],
    retard: [],
    avance: [],
    payees: [],
  };

  const handleCreateInvoice = () => {
    console.log("Faire un devis");
  };

  // Composant tableau réutilisable
  const Table = ({ invoices }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="text-left px-4 py-2">Date</th>
            <th className="text-left px-4 py-2">Ref de la pièce</th>
            <th className="text-left px-4 py-2">Libellé</th>
            <th className="text-left px-4 py-2">Client</th>
            <th className="text-right px-4 py-2">Montant</th>
            <th className="text-center px-4 py-2">Statut</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((invoice, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">{invoice.date}</td>
                <td className="px-4 py-2">{invoice.ref}</td>
                <td className="px-4 py-2">{invoice.code}</td>
                <td className="px-4 py-2">{invoice.client}</td>
                <td className="px-4 py-2 text-right">
                  <div className="font-bold">{invoice.montant} FCFA</div>
                  <div className="text-xs text-gray-400">
                    {invoice.montantHT} FCFA HT
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
                    {invoice.statut}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="text-center text-gray-400 py-4 italic"
              >
                Aucune facture dans cette section
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Barre d'action */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un devis"
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white shadow-sm"
          />
        </div>
        <button
          onClick={handleCreateInvoice}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-lg shadow-sm hover:to-emerald-500 transition"
        >
          <Plus className="h-4 w-4 mr-2" />
          Faire un devis
        </button>
      </div>

      {/* Onglets */}
      <div className="border-b flex gap-6 text-sm text-gray-600">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-2 ${
              activeTab === tab.id
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "hover:text-blue-500"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1 text-xs bg-gray-200 rounded-full px-2 py-0.5">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tableau des factures */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table invoices={dataByTab[activeTab]} />
      </div>
    </div>
  );
};

export default Devis;
