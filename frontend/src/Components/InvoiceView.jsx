import React, { useContext } from "react";
import { Phone, Mail, MapPin } from 'lucide-react';
import writtenNumber from 'written-number';
import { AppContext } from "../context/AppContext";

writtenNumber.defaults.lang = 'fr';

const InvoiceView = () => {
  const { invoiceData } = useContext(AppContext);

  const formatFCFA = (value) => {
    if (isNaN(value)) return "0 FCFA";
    return `${Math.round(value).toLocaleString("fr-FR")} FCFA`;
  };

  // Calcul automatique du Montant TTC après remise
  const totalRemise = invoiceData?.totals?.totalRemise || 0;
  const totalHTApresRemise = invoiceData?.totals?.subtotal || 0;
  const totalHTAvantRemise = totalHTApresRemise + totalRemise;
  const totalTVA = invoiceData?.totals?.totalTVA || 0;
  const totalCSS = invoiceData?.totals?.css || 0;
  const totalTTC = totalHTApresRemise + totalTVA + totalCSS;

  // Montant en lettres
  const montantEnLettres = writtenNumber(Math.round(totalTTC));

  

  return (
    <div className="bg-white font-sans p-8 max-w-4xl mx-auto shadow-lg">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-start border-b pb-6 mb-6 border-gray-300">
        <div className="flex flex-col items-center space-y-2">
          {invoiceData.company?.logo && (
            <img src={invoiceData.company.logo} alt="Logo" className="h-25 w-25 object-cover" />
          )}
          <h1 className="text-lg font-accent text-gray-600">{invoiceData.company?.name || "Logo"}</h1>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-extrabold text-blue-600 uppercase">
            FACTURE
          </h2>
          <p className="text-gray-700 text-sm mt-1"><strong>N° :</strong> {invoiceData.invoice?.number || "FACT-000000"}</p>
          <p className="text-gray-700 text-sm"><strong>Date :</strong> {invoiceData.invoice?.date || "YYYY-MM-DD"}</p>
          <p className="text-gray-700 text-sm"><strong>Statut :</strong> {invoiceData.statut || "Attente"}</p>
        </div>
      </div>
      {/* ===== COMPANY & CLIENT INFO ===== */}
      <div className="flex justify-between mb-6 p-4 bg-gray-50">
        <div>
          {invoiceData.company?.address && <p className="text-gray-600 text-sm"><strong>Adresse :</strong> {invoiceData.company.address}</p>}
          {invoiceData.company?.number && <p className="text-gray-600 text-sm"><strong>Téléphone :</strong> {invoiceData.company.number}</p>}
          {invoiceData.company?.email && <p className="text-gray-600 text-sm"><strong>Email :</strong> {invoiceData.company.email}</p>}
        </div>
        <div>
          {invoiceData.client && (
            <>
              <p className="text-gray-700"><strong>Raison sociale :</strong> {invoiceData.client.name || invoiceData.client.raisonSocial}</p>
              {invoiceData.client.representative && <p className="text-sm text-gray-700"><strong>Représentant :</strong> {invoiceData.client.representative}</p>}
              {invoiceData.client.address && <p className="text-sm text-gray-700"><strong>Adresse :</strong> {invoiceData.client.address}</p>}
              {invoiceData.client.phone && <p className="text-sm text-gray-700"><strong>Téléphone :</strong> {invoiceData.client.phone}</p>}
              {invoiceData.client.email && <p className="text-sm text-gray-700"><strong>Email :</strong> {invoiceData.client.email}</p>}
            </>
          )}
        </div>
      </div>
      {/* ===== OBJET / SERVICE ===== */}
      {invoiceData.service.subject && (
        <div className="mb-4 p-2 border-l-4 border-blue-600 bg-blue-50 ">
        <p className="text-gray-800"><span className="font-semibold">Objet :</span> {invoiceData.service.subject}</p>
        </div>
      )}
      {/* ===== TABLEAU DES ARTICLES ===== */}
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
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
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
      {/* ===== TOTAUX ===== */}
      <div className="flex flex-col items-end mb-8 space-y-3">
        <div className="w-80 text-sm">
          {totalRemise > 0 ? (
            <>
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold">Sous Total 1 :</span>
                <span>{formatFCFA(totalHTAvantRemise)}</span>
              </div>

              <div className="flex justify-between py-2 border-b text-red-600">
                <span className="font-semibold">Remise :</span>
                <span>- {formatFCFA(totalRemise)}</span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold">Sous Total 2 :</span>
                <span>{formatFCFA(totalHTApresRemise)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between py-2 border-b">
              <span className="font-semibold">Sous Total :</span>
              <span>{formatFCFA(totalHTApresRemise)}</span>
            </div>
          )}

          <div className="flex justify-between py-2 border-b">
            <span className="font-semibold">CSS 1% :</span>
            <span className="font-semibold">{formatFCFA(totalCSS)}</span>
          </div>

          {/* TVA par taux */}
          {Object.entries(
            invoiceData.items.reduce((acc, item) => {
              const taux = item.tva || 0;
              const montantTVA = ((item.total || 0) * taux) / 100;
              acc[taux] = (acc[taux] || 0) + montantTVA;
              return acc;
            }, {})
          ).map(([taux, montant], idx) => (
            <div key={idx} className="flex justify-between py-2 border-b">
              <span className="font-semibold">TVA {taux}% :</span>
              <span>{formatFCFA(montant)}</span>
            </div>
          ))}

          <div className="flex justify-between py-3 bg-blue-600 text-white font-bold  mt-2 shadow">
            <span className="pl-3">MONTANT TTC :</span>
            <span className="pr-3">{formatFCFA(totalTTC)}</span>
          </div>
        </div>
      </div>

      {/* Montant en lettres */}
      <div className="w-80 text-right text-[0.6rem] text-gray-700 italic text-xs mt-1 break-words whitespace-normal">
        Arrêté de la présente facture au montant net de : <span className="font-semibold">{montantEnLettres} FCFA</span>
      </div>

      <div className="border-t border-gray-300 my-6"></div>

      
      {/* ===== MODALITÉS ET CONDITIONS DE PAIEMENT ===== */}
      {(invoiceData.account?.method || invoiceData.account?.number || invoiceData.account?.rib || 
        invoiceData.payment?.advanceAmount || invoiceData.payment?.remainingAmount) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Modalités de paiement */}
          {(invoiceData.account?.method || invoiceData.account?.number || invoiceData.account?.rib) && (
            <div className="flex-1">
              <h3 className="text-md font-bold bg-blue-600 text-white p-2 ">Modalités de paiement</h3>
              <div className=" p-3 text-sm  space-y-3">
                {invoiceData.account?.method && <p><strong>Méthode:</strong> {invoiceData.account.method}</p>}
                {invoiceData.account?.number && <p><strong>Numéro / référence:</strong> {invoiceData.account.number}</p>}
                {invoiceData.account?.rib && <p><strong>RIB:</strong> {invoiceData.account.rib}</p>}
              </div>
            </div>
          )}

          {/* Conditions de règlement */}
          {(invoiceData.payment?.advanceAmount || invoiceData.payment?.remainingAmount) && (
            <div className="flex-1">
              <h3 className="text-md font-bold bg-blue-600 text-white p-2 ">Conditions de règlement</h3>
              <div className=" p-3 text-sm space-y-2">
                {invoiceData.payment?.advanceAmount && (
                  <p>Avance: {formatFCFA(invoiceData.payment.advanceAmount)} ({invoiceData.payment.remainingDate || 0}%)</p>
                )}
                {invoiceData.payment?.remainingAmount && (
                  <p>Reste à verser: {formatFCFA(invoiceData.payment.remainingAmount)} ({invoiceData.payment.remainingPercent || 0}%) avant le {invoiceData.payment.remainingDate || "-"}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== FOOTER ===== */}
      
      <div className="text-xs text-gray-700 mb-2 text-center">
        <p className="text-sm font-accent text-gray-600 text-center"><strong>Merci pour la confiance que vous nous accordez !</strong></p>
      </div>
      <div className="border-t border-gray-200 pt-6 flex flex-col items-center">
        <p className="text-[0.6rem] text-gray-600 mb-4 text-center max-w-xl">
          OD-Partners est membre du groupe African Business Consulting-Group (ABC GROUP) Comptabilité- Fiscalité-Conseil.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center text-[0.6rem] text-gray-600 space-y-2 md:space-y-0 md:space-x-6">
          {invoiceData.company?.number && (
            <div className="flex items-center space-x-2 justify-center">
              <Phone className="w-4 h-4" />
              <span>{invoiceData.company.number}</span>
            </div>
          )}
          {invoiceData.company?.email && (
            <div className="flex items-center space-x-2 justify-center">
              <Mail className="w-4 h-4" />
              <span>{invoiceData.company.email}</span>
            </div>
          )}
          {invoiceData.company?.address && (
            <div className="flex items-center space-x-2 justify-center">
              <MapPin className="w-4 h-4" />
              <span>{invoiceData.company.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
