// UpdateInvoiceForm.jsx
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const UpdateInvoiceForm = ({ invoiceId, onBack }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/invoice/get-facture/${invoiceId}`)
      .then((res) => {
        setInvoiceData(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [invoiceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8081/api/invoice/update-facture/${invoiceId}`,
        invoiceData
      );
      alert("Facture mise à jour avec succès !");
      onBack(); // Retour à la liste
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour !");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!invoiceData) return <p>Facture introuvable.</p>;

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à la liste
      </button>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Référence de la pièce
          </label>
          <input
            type="text"
            name="invoiceNumber"
            value={invoiceData.invoice.number}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="invoiceDate"
            value={invoiceData.invoice.date.split("T")[0]}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Client
          </label>
          <input
            type="text"
            name="clientName"
            value={invoiceData.client.name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 text-sm"
          />
        </div>

        {/* Tu peux ajouter ici les champs pour items, montant, statut, etc. */}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Mettre à jour la facture
        </button>
      </form>
    </div>
  );
};

export default UpdateInvoiceForm;
