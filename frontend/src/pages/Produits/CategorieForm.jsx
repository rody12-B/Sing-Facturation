import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const CategorieForm = () => {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8081/api/categorie/creer-categorie", { nom, description });
      alert("Catégorie créée avec succès !");
      navigate("/menu-parametres/config-db/creer-categorie"); // revenir à la liste des produits ou catégories
    } catch (err) {
      console.error("Erreur création catégorie :", err);
      alert("Erreur lors de la création de la catégorie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded">
      <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded shadow hover:to-emerald-500"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour
        </button>
      <h2 className="text-xl font-semibold mb-4">Créer une catégorie</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nom de la catégorie"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Description (optionnelle)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {loading ? "Création..." : "Créer la catégorie"}
        </button>
      </form>
    </div>
  );
};

export default CategorieForm;
