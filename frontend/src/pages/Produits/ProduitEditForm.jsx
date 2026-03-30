import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const ProduitEditForm = () => {
  const { id } = useParams(); // ID du produit à éditer
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    codeProduit: "",
    nom: "",
    prixUnitaire: "",
    description: "",
    categorie: ""
  });
  const [message, setMessage] = useState("");

  // --- Récupérer les catégories ---
  useEffect(() => {
    axios.get("http://localhost:8081/api/categorie/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  // --- Récupérer le produit à éditer ---
  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:8081/api/produit/get-produit/${id}`)
      .then(res => {
        const product = res.data;
        setFormData({
          codeProduit: product.codeProduit,
          nom: product.nom,
          prixUnitaire: product.prixUnitaire,
          description: product.description,
          categorie: product.categorie?._id || ""
        });
      })
      .catch(err => console.error(err));
  }, [id]);

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
      await axios.put(`http://localhost:8081/api/produit/update-produit/${id}`, formData);
      setMessage("Produit mis à jour avec succès !");
      
      navigate("/menu-parametres/config-db");
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour du produit");
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
      <h2 className="text-xl font-bold mb-4">Modifier le produit</h2>

      {message && <p className="mb-2 text-red-500">{message}</p>}

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
        <select
          name="categorie"
          value={formData.categorie}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        >
          <option value="">-- Sélectionner une catégorie --</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.nom}</option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Mettre à jour le produit
        </button>
      </form>
    </div>
  );
};

export default ProduitEditForm;
