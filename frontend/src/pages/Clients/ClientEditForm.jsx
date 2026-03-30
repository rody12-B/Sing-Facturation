import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ClientEditForm = ({ onClose, onUpdate }) => {
  const { id } = useParams(); // récupère l'ID du client depuis l'URL
  const [codeClient, setCodeClient] = useState("");
  const [raisonSocial, setRaisonSocial] = useState("");
  const [type, setType] = useState("professionnel");
  const [tel, setTel] = useState("");
  const [adress, setAdress] = useState("");
  const [mail, setMail] = useState("");
  const [archived, setArchived] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  // --- Charger les données du client depuis l'API ---
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/client/${id}`);
        const client = res.data;
        setCodeClient(client.codeClient || "");
        setRaisonSocial(client.raisonSocial || "");
        setType(client.type || "professionnel");
        setTel(client.tel || "");
        setAdress(client.adress || "");
        setMail(client.mail || "");
        setArchived(client.archived || false); 
      } catch (err) {
        console.error("Erreur récupération client :", err);
        setMessage({
          text: "Impossible de récupérer les données du client",
          type: "error",
        });
      }
    };

    if (id) fetchClient();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!codeClient || !raisonSocial || !type || !adress || !mail) {
      setMessage({ text: "Veuillez remplir tous les champs obligatoires !", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await axios.patch(`http://localhost:8081/api/client/update/${id}`, {
        codeClient,
        raisonSocial,
        type,
        tel,
        mail,
        archived, 
      });

      setMessage({ text: "Client modifié avec succès !", type: "success" });
      if (onUpdate) onUpdate(res.data);

      setTimeout(() => {
        onClose?.();
        navigate("/menu-parametres/clients");
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage({
        text: err.response?.data?.message || "Erreur lors de la mise à jour du client",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate("/menu-parametres/clients");

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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Code Client & Raison Sociale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code Client </label>
            <input
              type="text"
              value={codeClient}
              onChange={(e) => setCodeClient(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raison Sociale ou Nom </label>
            <input
              type="text"
              value={raisonSocial}
              onChange={(e) => setRaisonSocial(e.target.value)}
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
              className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Adresse & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse </label>
          <input
            type="text"
            value={adress}
            onChange={(e) => setAdress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email </label>
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>
        </div>

        {/* Archiver */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="archiver"
            checked={archived}
            onChange={(e) => setArchived(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="archiver" className="text-sm  text-gray-700">
            Archiver le client
          </label>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 mt-4">
          
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-white font-medium transition ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Mise à jour..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientEditForm;
