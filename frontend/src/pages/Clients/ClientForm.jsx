import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axios from "axios";

const ClientForm = () => {
  const [codeClient, setCodeClient] = useState("");
  const [raisonSocial, setRaisonSocial] = useState("");
  const [type, setType] = useState("professionnel");
  const [tel, setTel] = useState("");
  const [adress, setAdress] = useState(""); 
  const [mail, setMail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!codeClient || !raisonSocial || !type || !mail || !adress) { 
      setMessage({ text: "Veuillez remplir tous les champs obligatoires !", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await axios.post("http://localhost:8081/api/client/create", {
        codeClient,
        raisonSocial,
        type,
        tel,
        adress, 
        mail,
      });

      setMessage({ text: "Client créé avec succès !", type: "success" });

      // Faire disparaître le message après 3 secondes
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);

      // Réinitialiser le formulaire
      setCodeClient("");
      setRaisonSocial("");
      setType("professionnel");
      setTel("");
      setAdress(""); 
      setMail("");
    } catch (err) {
      console.error(err);
      setMessage({ text: err.response?.data?.message || "Erreur lors de l'opération", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/menu-parametres/clients");
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-2xl mx-auto">
      {/* Bouton retour */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded shadow-sm hover:to-emerald-500 transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Retour aux clients
        </button>
      </div>

      {/* Titre */}
      <h2 className="text-2xl text-center font-semibold text-gray-800 mb-4">
        Ajouter un client
      </h2>

      {/* Message succès / erreur */}
      {message.text && (
        <div
          className={`p-3 mb-4 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Code Client & Raison Sociale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code Client </label>
            <input
              type="text"
              value={codeClient}
              onChange={(e) => setCodeClient(e.target.value)}
              placeholder="Ex: C001"
              className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raison Sociale ou nom </label>
            <input
              type="text"
              value={raisonSocial}
              onChange={(e) => setRaisonSocial(e.target.value)}
              placeholder="Ex: Entreprise XYZ"
              className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Type & Téléphone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            >
              <option value="professionnel">Professionnel</option>
              <option value="particulier">Particulier</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="text"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              placeholder="Ex: 0612345678"
              className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Adresse  et mail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse </label>
          <input
            type="text"
            value={adress}
            onChange={(e) => setAdress(e.target.value)}
            placeholder="Ex: Libreville, Oyem..."
            className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email </label>
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            placeholder="exemple@domaine.com"
            className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>
        </div>

        {/* Bouton Ajouter */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-white font-medium transition ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
