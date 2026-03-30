import { useState, useEffect } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const ProduitForm = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    codeProduit: "",
    nom: "",
    prixUnitaire: "",
    description: "",
    categorie: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Modal pour ajouter une catégorie
  const [showModal, setShowModal] = useState(false);
  const [newCategorie, setNewCategorie] = useState({ nom: "", description: "" });

  // Récupérer les catégories
  const fetchCategories = () => {
    axios.get("http://localhost:8081/api/categorie/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categorie) {
      setMessage("Veuillez sélectionner une catégorie !");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8081/api/produit/create-produit", formData);
      setMessage(`Produit créé avec succès : ${res.data.nom}`);
      setFormData({
        codeProduit: "",
        nom: "",
        prixUnitaire: "",
        description: "",
        categorie: ""
      });
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la création du produit");
    }
  };

  // Gestion du modal
  const handleCategorieChange = (e) => {
    setNewCategorie({ ...newCategorie, [e.target.name]: e.target.value });
  };

  const handleAddCategorie = async () => {
    if (!newCategorie.nom) return;
    try {
      await axios.post("http://localhost:8081/api/categorie/creer-categorie", newCategorie);
      fetchCategories(); // rafraîchir la liste
      setShowModal(false);
      setNewCategorie({ nom: "", description: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
       <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded shadow hover:to-emerald-500"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour
        </button> 
      <h2 className="text-xl font-bold mb-4">Créer un produit</h2>

      {message && <p className="mb-2 text-green-500">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="codeProduit"
          placeholder="Code produit"
          value={formData.codeProduit}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="nom"
          placeholder="Nom du produit"
          value={formData.nom}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          name="prixUnitaire"
          placeholder="Prix unitaire"
          value={formData.prixUnitaire}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        <div className="flex gap-2 items-center">
          <select
            name="categorie"
            value={formData.categorie}
            onChange={handleChange}
            className="border px-3 py-2 rounded flex-1"
            required
          >
            <option value="">-- Sélectionner une catégorie --</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.nom}</option>
            ))}
          </select>
          <button
            type="button"
            className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Créer le produit
        </button>
      </form>

      {/* Modal pour ajouter une catégorie */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded w-80">
            <h3 className="text-lg font-bold mb-2">Ajouter une catégorie</h3>
            <input
              type="text"
              name="nom"
              placeholder="Nom de la catégorie"
              value={newCategorie.nom}
              onChange={handleCategorieChange}
              className="border px-3 py-2 rounded w-full mb-2"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newCategorie.description}
              onChange={handleCategorieChange}
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-3 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button
                className="bg-green-500 text-white px-3 py-2 rounded"
                onClick={handleAddCategorie}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProduitForm;
