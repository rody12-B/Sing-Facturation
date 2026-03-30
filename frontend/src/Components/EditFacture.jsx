import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, Loader, Save } from "lucide-react";
import writtenNumber from "written-number";

writtenNumber.defaults.lang = "fr";

const EditFacture = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Charger la facture
  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/invoice/facture/${id}`)
      .then((res) => setInvoice(res.data))
      .catch((err) => {
        console.error("Erreur récupération facture:", err);
        setError("Impossible de charger la facture.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Fonction de modification générique
  const handleChange = (path, value) => {
    setInvoice((prev) => {
      const newData = { ...prev };
      const keys = path.split(".");
      let ref = newData;
      keys.slice(0, -1).forEach((k) => {
        if (!ref[k]) ref[k] = {};
        ref = ref[k];
      });
      ref[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Recalcul des totaux
  useEffect(() => {
    if (!invoice || !invoice.items) return;

    const subtotal = invoice.items.reduce((sum, item) => {
      const qty = Number(item.qty) || 0;
      const price = Number(item.price) || 0;
      return sum + qty * price;
    }, 0);

    const totalRemise = Number(invoice.totals?.totalRemise) || 0;
    const totalTVA = Number(invoice.totals?.totalTVA) || 0;
    const css = Number(invoice.totals?.css) || 0;
    const total = subtotal - totalRemise + totalTVA + css;

    setInvoice((prev) => ({
      ...prev,
      totals: {
        ...prev.totals,
        subtotal,
        total,
      },
    }));
  }, [invoice?.items, invoice?.totals?.totalRemise, invoice?.totals?.totalTVA, invoice?.totals?.css]);

  // Sauvegarder la facture
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`http://localhost:8081/api/invoice/modifier-facture/${id}`, invoice);
      alert("Facture mise à jour avec succès !");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour !");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-3">
        <Loader className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-600 text-lg font-accent">Chargement de la facture ...</p>
      </div>
    );

  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;
  if (!invoice) return null;

  const { company = {}, client = {}, service = {}, invoice: inv = {}, totals = {}, payment = {}, account = {} } = invoice;

  const formatFCFA = (v) => (isNaN(v) ? "0 FCFA" : `${Math.round(v).toLocaleString("fr-FR")} FCFA`);
  const montantEnLettres = writtenNumber(Math.round(totals.total || 0));

  return (
    <form onSubmit={handleSubmit} className="bg-white font-sans p-8 max-w-5xl mx-auto shadow-lg rounded-lg space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Mise à jour..." : "Enregistrer"}
        </button>
      </div>

      {/* === INFOS ENTREPRISE === */}
      <section className="border rounded-lg p-4">
        <h3 className="text-blue-600 font-semibold mb-2">Informations Entreprise</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            className="border p-2 rounded"
            value={company.name || ""}
            onChange={(e) => handleChange("company.name", e.target.value)}
            placeholder="Nom de l'entreprise"
          />
          <input
            type="email"
            className="border p-2 rounded"
            value={company.email || ""}
            onChange={(e) => handleChange("company.email", e.target.value)}
            placeholder="Email"
          />
        </div>
      </section>

      {/* === CLIENT === */}
      <section className="border rounded-lg p-4">
        <h3 className="text-blue-600 font-semibold mb-2">Informations Client</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            className="border p-2 rounded"
            value={client.raisonSocial || ""}
            onChange={(e) => handleChange("client.raisonSocial", e.target.value)}
            placeholder="Raison sociale"
          />
          <input
            type="text"
            className="border p-2 rounded"
            value={client.phone || ""}
            onChange={(e) => handleChange("client.phone", e.target.value)}
            placeholder="Téléphone"
          />
        </div>
      </section>

      {/* === TABLEAU DES ARTICLES === */}
      <section className="border rounded-lg p-4">
        <h3 className="text-blue-600 font-semibold mb-3">Articles</h3>
        <table className="min-w-full text-sm border">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 text-left">Désignation</th>
              <th className="p-2 text-right">Prix</th>
              <th className="p-2 text-right">Quantité</th>
              <th className="p-2 text-right">TVA</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2">
                  <input
                    type="text"
                    value={item.designation || ""}
                    onChange={(e) => {
                      const updated = [...invoice.items];
                      updated[idx].designation = e.target.value;
                      setInvoice({ ...invoice, items: updated });
                    }}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="p-2 text-right">
                  <input
                    type="number"
                    value={item.price || 0}
                    onChange={(e) => {
                      const updated = [...invoice.items];
                      updated[idx].price = Number(e.target.value);
                      setInvoice({ ...invoice, items: updated });
                    }}
                    className="border p-1 rounded w-24 text-right"
                  />
                </td>
                <td className="p-2 text-right">
                  <input
                    type="number"
                    value={item.qty || 0}
                    onChange={(e) => {
                      const updated = [...invoice.items];
                      updated[idx].qty = Number(e.target.value);
                      setInvoice({ ...invoice, items: updated });
                    }}
                    className="border p-1 rounded w-24 text-right"
                  />
                </td>
                <td className="p-2 text-right">
                  <input
                    type="number"
                    value={item.tva || 0}
                    onChange={(e) => {
                      const updated = [...invoice.items];
                      updated[idx].tva = Number(e.target.value);
                      setInvoice({ ...invoice, items: updated });
                    }}
                    className="border p-1 rounded w-20 text-right"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* === TOTAUX === */}
      <section className="border rounded-lg p-4 text-right">
        <h3 className="text-blue-600 font-semibold mb-3 text-left">Totaux</h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Sous-total :</strong> {formatFCFA(totals.subtotal)}
          </div>
          <div>
            <label>Remise :</label>
            <input
              type="number"
              value={totals.totalRemise || 0}
              onChange={(e) => handleChange("totals.totalRemise", Number(e.target.value))}
              className="border p-1 rounded w-24 text-right ml-2"
            />
          </div>
          <div>
            <label>TVA totale :</label>
            <input
              type="number"
              value={totals.totalTVA || 0}
              onChange={(e) => handleChange("totals.totalTVA", Number(e.target.value))}
              className="border p-1 rounded w-24 text-right ml-2"
            />
          </div>
          <div className="font-bold text-blue-600 text-lg">
            Montant TTC : {formatFCFA(totals.total)}
          </div>
          <div className="italic text-gray-600 text-sm">
            Arrêté à : <span className="font-semibold">{montantEnLettres}</span>
          </div>
        </div>
      </section>
    </form>
  );
};

export default EditFacture;
