import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  Phone,
  Mail,
  MapPin,
  Loader,
  SendHorizontal,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import writtenNumber from "written-number";
import { AppContext } from "../context/AppContext";

writtenNumber.defaults.lang = "fr";

const FactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [showModal, setShowModal] = useState(null);
  const { invoiceData } = useContext(AppContext);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/invoice/facture/${id}`)
      .then((res) => setInvoice(res.data))
      .catch((err) => console.error("Erreur récupération facture:", err));
  }, [id]);

  if (!invoice)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-3">
        <Loader className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-600 text-lg font-accent">
          Chargement de la facture ...
        </p>
      </div>
    );

  // ✅ Déstructuration avant la fonction handleSendEmail
  const {
    totals = {},
    company = {},
    client = {},
    invoice: inv = {},
    service = {},
    payment = {},
    account = {},
  } = invoice;

  const subtotal = totals.subtotal || 0;
  const totalRemise = totals.totalRemise || 0;
  const totalTVA = totals.totalTVA || 0;
  const css = totals.css || 0;
  const totalTTC = totals.total || 0;

  const montantEnLettres = writtenNumber(Math.round(totalTTC || 0));
  const formatFCFA = (value) =>
    isNaN(value) ? "0 FCFA" : `${Math.round(value).toLocaleString("fr-FR")} FCFA`;

  // 📧 Fonction d'envoi avec loader + modal
  const handleSendEmail = async () => {
    setLoadingEmail(true);
    try {
      await axios.post(`http://localhost:8081/api/invoice/send-email/${invoice._id}`, {
        email: client.email,
      });
      setShowModal("success");
    } catch (err) {
      console.error(err);
      setShowModal("error");
    } finally {
      setLoadingEmail(false);
      setTimeout(() => setShowModal(null), 3000);
    }
  };

  return (
    <div className="bg-white font-sans p-8 max-w-4xl mx-auto shadow-lg">
      {/* ✅ MODAL DE CONFIRMATION */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div
            className={`flex flex-col items-center justify-center rounded-xl shadow-lg px-6 py-4 text-white text-center transition-all ${
              showModal === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {showModal === "success" ? (
              <>
                <CheckCircle2 className="w-10 h-10 mb-2" />
                <p className="font-semibold text-lg">
                  Facture envoyée avec succès 
                </p>
              </>
            ) : (
              <>
                <XCircle className="w-10 h-10 mb-2" />
                <p className="font-semibold text-lg">
                  Échec de l'envoi de la facture ❌
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded shadow hover:to-emerald-500"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour
        </button>

        <button
          onClick={handleSendEmail}
          disabled={loadingEmail}
          className={`flex items-center px-4 py-2  bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded shadow hover:to-emerald-500 ${
            loadingEmail ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loadingEmail ? (
            <>
              <Loader className="w-4 h-4 animate-spin mr-2" />
              Envoi en cours...
            </>
          ) : (
            "Envoyer par email"
            
          )}
        </button>
      </div>

      {/* COMPANY & CLIENT */}
      <div className="flex justify-between border-b pb-6 mb-6 border-gray-300">
        <div className="flex flex-col items-center space-y-2">
          {company.logo && <img src={company.logo} alt="Logo" className="h-20 w-20 object-cover" />}
          <h1 className="text-lg font-extrabold text-blue-600">{company.name}</h1>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-extrabold text-blue-600 uppercase">FACTURE</h2>
          <p className="text-gray-700 text-sm mt-1"><strong>N° :</strong> {inv.number}</p>
          <p className="text-gray-700 text-sm"><strong>Date :</strong> {inv.date?.split("T")[0]}</p>
        </div>
      </div>
      <div className="flex justify-between mb-6 p-4 bg-gray-50 rounded">
        <div>
          {company.address && <p className="text-gray-600 text-sm"><strong>Adresse :</strong> {company.address}</p>}
          {company.number && <p className="text-gray-600 text-sm"><strong>Téléphone :</strong> {company.number}</p>}
          {company.email && <p className="text-gray-600 text-sm"><strong>Email :</strong> {company.email}</p>}
        </div>
        <div>
          {client && (
            <>
              <p className="text-gray-700"><strong>Raison sociale :</strong> {client.raisonSocial}</p>
              {client.representative && <p className="text-sm text-gray-700"><strong>Représentant :</strong> {client.representative}</p>}
              {client.address && <p className="text-sm text-gray-700"><strong>Adresse :</strong> {client.address}</p>}
              {client.phone && <p className="text-sm text-gray-700"><strong>Téléphone :</strong> {client.phone}</p>}
              {client.email && <p className="text-sm text-gray-700"><strong>Email :</strong> {client.email}</p>}
            </>
          )}
        </div>
      </div>

      {/* SERVICE / OBJET */}
      {service.subject && (
        <div className="mb-4 p-2 border-l-4 border-blue-600 bg-blue-50 ">
          <p className="text-gray-800"><span className="font-semibold">Objet :</span> {service.subject}</p>
        </div>
      )}

      {/* TABLEAU DES ARTICLES */}
      <div className="overflow-x-auto mb-6  border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Réf</th>
              <th className="p-3 text-left">Désignation</th>
              <th className="p-3 text-right">PUHT</th>
              <th className="p-3 text-right">Quantité</th>
              <th className="p-3 text-right">TVA (%)</th>
              <th className="p-3 text-right">Total HT</th>
              <th className="p-3 text-right">Total TTC</th>
            </tr>
          </thead>
          <tbody>
          {invoiceData.items?.map((item, idx) => {
              const qty = Number(item.qty) || 0;
              const price = Number(item.price) || 0;
              const tva = Number(item.tva) || 0;

              const totalHT = qty * price; 
              const totalTTC = totalHT + (totalHT * tva) / 100; 
              return (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                  <td className="p-3">{item.reference}</td>
                  <td className="p-3">{item.designation}</td>
                  <td className="p-3 text-right">{formatFCFA(price)}</td>
                  <td className="p-3 text-right">{qty}</td>
                  <td className="p-3 text-right">{tva}</td>
                  <td className="p-3 text-right">{formatFCFA(totalHT)}</td>
                  <td className="p-3 text-right">{formatFCFA(totalTTC)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* TOTAUX */}
      <div className="flex flex-col items-end mb-8 space-y-3">
        <div className="w-80 text-sm">
          {totalRemise > 0 && (
            <>
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold">Sous Total 1 :</span>
                <span>{formatFCFA(subtotal + totalRemise)}</span>
              </div>
              <div className="flex justify-between py-2 border-b text-red-600">
                <span className="font-semibold">Remise :</span>
                <span>- {formatFCFA(totalRemise)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between py-2 border-b">
            <span className="font-semibold">Sous Total :</span>
            <span>{formatFCFA(subtotal)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-semibold">CSS 1% :</span>
            <span>{formatFCFA(css)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-semibold">Total TVA :</span>
            <span>{formatFCFA(totalTVA)}</span>
          </div>
          <div className="flex justify-between py-3 bg-blue-600 text-white font-bold  mt-2 shadow">
            <span className="pl-3">MONTANT TTC :</span>
            <span className="pr-3">{formatFCFA(totalTTC)}</span>
          </div>
        </div>
      </div>

      {/* Montant en lettres */}
      <div className="w-80 text-right text-[0.6rem] text-gray-700 italic text-sm mt-1 whitespace-nowrap">
        Arrêté de la présente facture au montant net de :
        <span className="font-semibold"> {montantEnLettres} </span>
      </div>

      {/* MODALITES / CONDITIONS DE PAIEMENT */}
      
      {(
        (account?.method || account?.number || account?.rib) ||
        (payment?.advanceAmount || payment?.remainingAmount || payment?.advancePercent || payment?.remainingPercent)
      ) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-8">

          {/* ===== MODALITÉS DE PAIEMENT ===== */}
          {(account?.method || account?.number || account?.rib) && (
            <div className="flex-1">
              <h3 className="text-md font-bold bg-blue-600 text-white p-2 ">Modalités de paiement</h3>
              <div className="p-3 text-sm space-y-2 ">
                {account.method && <p><strong>Méthode :</strong> {account.method}</p>}
                {account.number && <p><strong>Numéro / Référence :</strong> {account.number}</p>}
                {account.rib && <p><strong>RIB :</strong> {account.rib}</p>}
              </div>
            </div>
          )}

          {/* ===== CONDITIONS DE RÈGLEMENT ===== */}
          {(payment?.advanceAmount || payment?.remainingAmount || payment?.advancePercent || payment?.remainingPercent) && (
            <div className="flex-1">
              <h3 className="text-md font-bold bg-blue-600 text-white p-2 ">Conditions de règlement</h3>
              <div className="p-3 text-sm space-y-2 ">
                {/* ===== CONDITIONS DE RÈGLEMENT ===== */}
                {(() => {
                  const advance = Number(payment?.advanceAmount) || 0;
                  const remaining = Number(payment?.remainingAmount) || 0;
                  const total = Number(totalTTC);
                
                  // Facture payée intégralement
                  if (advance > 0 && remaining === 0) {
                    return (
                      <p>
                        Le montant total de <strong>{formatFCFA(total)}</strong> a été payé intégralement.
                      </p>
                    );
                  }
                
                  

                  return (
                    <>
                      {/* Ligne 1 : Avance */}
                      {payment?.advanceAmount && (
                        <p>
                          {payment.advancePercent}% de la facture, soit {formatFCFA(payment.advanceAmount)} 
                          {payment.advanceDate && <> avancé le {new Date(payment.advanceDate).toLocaleDateString("fr-FR")}</>}
                        </p>
                      )}
                      {/* Ligne 2 : Reste à verser */}
                      {payment?.remainingAmount && (
                        <p>
                          {payment.remainingPercent}% de la facture, soit {formatFCFA(payment.remainingAmount)} 
                          {payment.remainingDate && <> avant le {new Date(payment.remainingDate).toLocaleDateString("fr-FR")}</>}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <div className="text-xs text-gray-600 mb-2 text-center">
        <p className="text-sm text-gray-600 font-bold text-center">Merci pour la confiance que vous nous accordez !</p>
      </div>
      <div className="border-t border-gray-300 pt-6 flex flex-col items-center">
        <p className="text-[0.6rem] text-gray-600 mb-4 text-center max-w-xl">
          OD-Partners est membre du groupe African Business Consulting-Group (ABC GROUP) Comptabilité- Fiscalité-Conseil.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center text-[0.6rem] text-gray-600 space-y-2 md:space-y-0 md:space-x-6">
          {company.number && <div className="flex items-center space-x-2 justify-center"><Phone className="w-4 h-4" /><span>{company.number}</span></div>}
          {company.email && <div className="flex items-center space-x-2 justify-center"><Mail className="w-4 h-4" /><span>{company.email}</span></div>}
          {company.address && <div className="flex items-center space-x-2 justify-center"><MapPin className="w-4 h-4" /><span>{company.address}</span></div>}
        </div>
      </div>
    </div>
  );
};

export default FactDetails;
