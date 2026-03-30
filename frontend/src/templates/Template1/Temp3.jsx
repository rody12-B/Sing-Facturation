import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import writtenNumber from 'written-number';
writtenNumber.defaults.lang = 'fr';

const Temp3 = ({ data }) => {
  const montantEnLettres = writtenNumber(Math.round(data.totals.total || 0));

  return (
    <div className="bg-white font-sans p-8  max-w-4xl mx-auto shadow-lg">
      {/* HEADER */}
      <div className="text-center border-b border-red-300 pb-4 mb-6">
        {data.companyLogo && <img src={data.companyLogo} alt="Logo" className="h-25 w-25 mx-auto mb-2 " />}
        <h1 className="text-2xl font-accent text-gray-600">{data.companyName}</h1>
        <h2 className="text-lg font-semibold text-red-600 uppercase">{data.title || 'FACTURE'}</h2>
        <p className="text-gray-700 text-sm mt-1"><strong>N° :</strong> {data.invoiceNumber}</p>
        <p className="text-gray-700 text-sm"><strong>Établie le :</strong> {data.invoiceDate}</p>
        {data.invoiceDueDate && <p className="text-gray-700 text-sm"><strong>Échéance :</strong> {data.invoiceDueDate}</p>}
      </div>

      {/* COMPANY & CLIENT INFO */}
      <div className="flex justify-between mb-6 p-4 bg-red-50 rounded-lg text-red-700">
        <div>
          {data.companyAddress && <p>Adresse : {data.companyAddress}</p>}
          {data.companyNumber && <p>Téléphone : {data.companyNumber}</p>}
          {data.companyEmail && <p>E-mail : {data.companyEmail}</p>}
        </div>
        {data.clientName && (
          <div>
            <p><strong>Raison sociale :</strong> {data.clientName}</p>
            {data.clientRepresentative && <p><strong>Représentant :</strong> {data.clientRepresentative}</p>}
            {data.clientAddress && <p><strong>Adresse :</strong> {data.clientAddress}</p>}
            {data.clientPhone && <p><strong>Téléphone :</strong> {data.clientPhone}</p>}
            {data.clientEmail && <p><strong>Email :</strong> {data.clientEmail}</p>}
          </div>
        )}
      </div>

      {/* OBJET */}
      {data.serviceSubject && (
        <div className="mb-4 p-2 border-l-4 border-red-600 bg-red-100 rounded">
          <p><strong>Objet :</strong> {data.serviceSubject}</p>
        </div>
      )}

      {/* TABLEAU */}
      <div className="overflow-x-auto mb-6 rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-3 text-left">Réf</th>
              <th className="p-3 text-left">Désignation</th>
              <th className="p-3 text-right">PUHT ({data.currencySymbol})</th>
              <th className="p-3 text-right">Quantité/jour</th>
              <th className="p-3 text-right">Total HT ({data.currencySymbol})</th>
              <th className="p-3 text-right">Total TTC ({data.currencySymbol})</th>
              <th className="p-3 text-right">TVA (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.items?.map((item, idx) => {
              const qty = Number(item.qty) || 0;
              const price = Number(item.price) || 0;
              const tva = Number(item.tva) || 0;
      
              const totalHT = qty * price;
              const totalTTC = totalHT + (totalHT * tva) / 100;
      
              return (
                <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-3">{item.reference}</td>
                  <td className="p-3">{item.designation}</td>
                  <td className="p-3 text-right">{price.toFixed(2)}</td>
                  <td className="p-3 text-right">{qty}</td>
                  <td className="p-3 text-right">{totalHT.toFixed(2)}</td>
                  <td className="p-3 text-right">{totalTTC.toFixed(2)}</td>
                  <td className="p-3 text-right">{tva.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* ===== TOTAUX ===== */}
      <div className="flex flex-col items-end mb-8 space-y-3">
        <div className="w-80 text-sm">
          {data.totals.totalRemise > 0 ? (
            <>
              {/* Sous Total avant remise */}
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold">Sous Total 1 :</span>
                <span>{(data.totals.subtotal + data.totalRemise).toFixed(2)} {data.currencySymbol}</span>
              </div>

              {/* Remise */}
              <div className="flex justify-between py-2 border-b text-red-600">
                <span className="font-semibold">Remise :</span>
                <span>- {data.totals.totalRemise.toFixed(2)} {data.currencySymbol}</span>
              </div>

              {/* Sous Total après remise */}
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold">Sous Total 2 :</span>
                <span>{data.totals.subtotal.toFixed(2)} {data.currencySymbol}</span>
              </div>
            </>
          ) : (
            <>
              {/* Cas sans remise → un seul sous-total */}
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold">Sous Total :</span>
                <span>{data.totals.subtotal.toFixed(2)} {data.currencySymbol}</span>
              </div>
            </>
          )}

          {/* CSS */}
          <div className="flex justify-between py-2 border-b">
            <span className="font-semibold">CSS 1% :</span>
            <span>{data.totals.css.toFixed(2)} {data.currencySymbol}</span>
          </div>

          {/* TVA */}
          <div className="flex justify-between py-2 border-b">
            <span className="font-semibold">Total TVA :</span>
            <span>{data.totals.totalTVA.toFixed(2)} {data.currencySymbol}</span>
          </div>

          {/* Montant TTC */}
          <div className="flex justify-between py-3 bg-red-600 text-white font-bold rounded-lg mt-2 shadow">
            <span className="pl-3">MONTANT TTC :</span>
            <span className="pr-3">{data.totals.total.toFixed(2)} {data.currencySymbol}</span>
          </div>
        </div>
      </div>

      {/* Montant en lettres */}
      <div className="w-80 text-right text-[0.6rem] text-gray-700 italic text-sm mt-1 whitespace-nowrap">
        Arrêté de la présente facture au montant net de :
        <span className="font-semibold"> {montantEnLettres} {data.currencySymbol}</span>
      </div>

      <div className="border-t border-red-300 my-6"></div>

      {/* MODALITES & CONDITIONS */}
      {(data.accountMethod || data.accountNumber || data.accountRIB || 
        data.advancePercent || data.advanceAmount || data.remainingPercent || data.remainingAmount) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Modalités de paiement */}
          {(data.accountMethod || data.accountNumber || data.accountRIB) && (
            <div className="flex-1">
              <h3 className="text-md font-bold bg-red-600 text-white p-2 rounded-t-md">Modalités de paiement</h3>
              <div className="border border-gray-300 p-3 text-sm rounded-b-md space-y-3">
                {data.accountMethod && <p><strong>Méthode: </strong>{data.accountMethod}</p>}
                {data.accountNumber && <p><strong>Compte: </strong>{data.accountNumber}</p>}
                {data.accountRIB && <p><strong>RIB: </strong>{data.accountRIB}</p>}
              </div>
            </div>
          )}

          {/* Conditions de règlement */}
          {(data.advancePercent && data.advanceAmount && data.advanceDate) ||
          (data.remainingPercent && data.remainingAmount && data.remainingDate) ? (
            <div className="flex-1">
              <h3 className="text-md font-bold bg-red-600 text-white p-2 rounded-t-md">Conditions de règlement</h3>
              <div className="border border-gray-300 p-3 text-sm rounded-b-md space-y-2">
                {data.advancePercent && data.advanceAmount && data.advanceDate && (
                  <p>
                    {data.advancePercent}% de la facture, soit {data.advanceAmount} {data.currencySymbol} avancé le{" "}
                    {new Date(data.advanceDate).toLocaleDateString("fr-FR")}
                  </p>
                )}
                {data.remainingPercent && data.remainingAmount && data.remainingDate && (
                  <p>
                    {data.remainingPercent}% de la facture, soit {data.remainingAmount} {data.currencySymbol} avant le{" "}
                    {new Date(data.remainingDate).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <div className="border-t border-gray-300 my-6" />
      <div className="text-xs text-gray-600 mb-2 text-center">
        <p className="text-sm font-accent text-red-300 text-center"><strong>Merci pour la confiance que vous nous accordez !</strong></p>
      </div>
      
      <div className="border-t border-gray-200 pt-6 flex flex-col items-center">
        <p className="text-xs text-gray-600 mb-4 text-center max-w-xl">
          OD-Partners est membre du groupe African Business Consulting-Group (ABC GROUP) Comptabilité- Fiscalité-Conseil.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center text-xs text-gray-600 space-y-2 md:space-y-0 md:space-x-6">
          {data.companyNumber && (
            <div className="flex items-center space-x-2 justify-center">
              <Phone className="w-4 h-4" />
              <span>{data.companyNumber}</span>
            </div>
          )}
          {data.companyEmail && (
            <div className="flex items-center space-x-2 justify-center">
              <Mail className="w-4 h-4" />
              <span>{data.companyEmail}</span>
            </div>
          )}
          {data.companyAddress && (
            <div className="flex items-center space-x-2 justify-center">
              <MapPin className="w-4 h-4" />
              <span>{data.companyAddress}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Temp3;
