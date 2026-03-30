import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Clients = () => {
  const [activeTab, setActiveTab] = useState("professionnels");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();

  // --- Récupération des clients ---
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8081/api/client/get-all");
        setClients(res.data);
      } catch (err) {
        console.error("Erreur récupération clients:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // --- Debounce pour la recherche ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // --- Suppression d’un client ---
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce client ?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/client/delete/${id}`);
      setClients(clients.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Erreur suppression client:", err);
    }
  };

  // --- Archivage / Désarchivage ---
  const handleArchiveToggle = async (client) => {
    try {
      await axios.patch(
        `http://localhost:8081/api/client/${client.archived ? "unarchive" : "archive"}/${client._id}`
      );
      setClients(
        clients.map((c) =>
          c._id === client._id ? { ...c, archived: !c.archived } : c
        )
      );
    } catch (err) {
      console.error("Erreur modification état archive:", err);
    }
  };

  // --- Navigation ---
  const handleCreateClients = () => navigate("/menu-parametres/clients/creer-client");
  const handleEdit = (id) => navigate(`/menu-parametres/clients/edit-client/${id}`);

  // --- Comptages ---
  const countProfessionnels = clients.filter(c => c.type === "professionnel" && !c.archived).length;
  const countParticuliers = clients.filter(c => c.type === "particulier" && !c.archived).length;
  const countArchives = clients.filter(c => c.archived).length;

  // Fonction utilitaire pour normaliser une chaîne (minuscules, sans accents, trim)
const normalize = (str) => {
  return str
    ?.normalize("NFD")             // Décompose les accents
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .toLowerCase()                 // Tout en minuscules
    .trim();                       // Supprime les espaces autour
};

// Filtrage clients
const filteredClients = clients
  .filter(c => {
    if (activeTab === "professionnels") return c.type === "professionnel" && !c.archived;
    if (activeTab === "particuliers") return c.type === "particulier" && !c.archived;
    if (activeTab === "archives") return c.archived;
    return true;
  })
  .filter(c =>
    [c.raisonSocial, c.codeClient, c.tel, c.mail].some(
      field => normalize(field).includes(normalize(debouncedSearch))
    )
  );

  // --- Tableau clients ---
  const Table = ({ clients }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="text-left px-4 py-2">Code Client</th>
            <th className="text-left px-4 py-2">Raison Sociale</th>
            <th className="text-left px-4 py-2">Téléphone</th>
            <th className="text-left px-4 py-2">Email</th>
            <th className="text-center px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">
                <div className="flex flex-col items-center justify-center gap-2 py-6 text-blue-500 italic">
                  <Loader className="h-5 w-5 animate-spin text-blue-500" />
                  <span>Chargement des clients...</span>
                </div>
              </td>
            </tr>
          ) : clients.length > 0 ? (
            clients.map((client) => (
              <tr
                key={client._id}
                onClick={() => handleEdit(client._id)}
                className="border-t border-gray-300 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-2">{client.codeClient}</td>
                <td className="px-4 py-2 font-medium">{client.raisonSocial}</td>
                <td className="px-4 py-2">{client.tel}</td>
                <td className="px-4 py-2">{client.mail}</td>
                <td className="px-4 py-2 text-center flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleArchiveToggle(client); }}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded  cursor-pointer text-xs"
                  >
                    {client.archived ? "Désarchiver" : "Archiver"}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(client._id); }}
                    className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                  >
                    <Trash2 className="w-4 h-4 cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-gray-400 py-4 italic">
                Aucun client trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Barre de recherche et ajout */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un client"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px] pl-10 pr-4 py-2 border border-gray-600 rounded-sm text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-gray-600 focus:outline-none transition bg-white shadow-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCreateClients}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-lg shadow-sm hover:to-emerald-500 transition"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un client
          </button>
        </div>
      </div>

      {/* Onglets avec compteurs */}
      <div className="border-b flex gap-6 text-sm text-gray-600">
        {[
          { id: "professionnels", label: "Professionnels", count: countProfessionnels },
          { id: "particuliers", label: "Particuliers", count: countParticuliers },
          { id: "archives", label: "Archivés", count: countArchives }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-2 flex items-center gap-2 ${activeTab === tab.id
              ? "text-blue-600 font-semibold border-b-2 border-blue-600"
              : "hover:text-blue-500"
            }`}
          >
            {tab.label}
            <span className="inline-flex items-center justify-center w-5 h-5 bg-white text-gray-600 text-xs font-semibold rounded-full shadow">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tableau clients */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table clients={filteredClients} />
      </div>
    </div>
  );
};

export default Clients;
