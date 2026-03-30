import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Config = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();

  // --- Récupération des produits ---
  useEffect(() => {
    const fetchProduits = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8081/api/produit/produits");
        setProduits(res.data);
      } catch (err) {
        console.error("Erreur récupération produits:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduits();
  }, []);

  // --- Debounce pour la recherche ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // --- Suppression d’un produit ---
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/produit/delete-produit/${id}`);
      setProduits(produits.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Erreur suppression produit:", err);
    }
  };

  // --- Navigation ---
  const handleCreateProduit = () => navigate("/menu-parametres/config-db/creer-produit");
  const handleCreateCategorie = () => navigate("/menu-parametres/config-db/creer-categorie");
  const handleEdit = (id) => navigate(`/menu-parametres/config-db/edit-produit/${id}`);

  // --- Comptage --- (exemple : produits disponibles et non disponibles)


  // --- Normalisation pour la recherche ---
  const normalize = (str) =>
    str
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  // Filtrage produits
  const filteredProduits = produits.filter((p) =>
    [p.nom, p.codeProduit, p.description, p.categorie?.nom].some((field) =>
      normalize(field).includes(normalize(debouncedSearch))
    )
  );

  // --- Tableau produits ---
  const Table = ({ produits }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="text-left px-4 py-2">Code Produit</th>
            <th className="text-left px-4 py-2">Produit/Service</th>
            <th className="text-left px-4 py-2">Prix Unitaire</th>
            <th className="text-left px-4 py-2">Catégorie</th>
            <th className="text-left px-4 py-2">Description</th>
            <th className="text-center px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">
                <div className="flex flex-col items-center justify-center gap-2 py-6 text-blue-500 italic">
                  <Loader className="h-5 w-5 animate-spin text-blue-500" />
                  <span>Chargement des produits...</span>
                </div>
              </td>
            </tr>
          ) : produits.length > 0 ? (
            produits.map((produit) => (
              <tr
                key={produit._id}
                onClick={() => handleEdit(produit._id)}
                className="border-t border-gray-300 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-2">{produit.codeProduit}</td>
                <td className="px-4 py-2 font-medium">{produit.nom}</td>
                <td className="px-4 py-2">{produit.prixUnitaire}</td>
                <td className="px-4 py-2">{produit.categorie?.nom || "-"}</td>
                <td className="px-4 py-2">{produit.description}</td>
                <td className="px-4 py-2 text-center flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(produit._id); }}
                    className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                  >
                    <Trash2 className="w-4 h-4 cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-gray-400 py-4 italic">
                Aucun produit trouvé
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
            placeholder="Rechercher un produit"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px] pl-10 pr-4 py-2 border border-gray-600 rounded-sm text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-gray-600 focus:outline-none transition bg-white shadow-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCreateProduit}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-sm shadow-sm hover:to-emerald-500 transition"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </button>
          <button
            onClick={handleCreateCategorie}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-sm shadow-sm hover:to-emerald-500 transition"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une Categorie
          </button>
        </div>
      </div>

      {/* Tableau produits */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table produits={filteredProduits} />
      </div>
    </div>
  );
};

export default Config;
