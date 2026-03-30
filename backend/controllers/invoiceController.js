require("dotenv").config();
const Invoice = require("../models/Invoice");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');
const writtenNumber = require("written-number");

writtenNumber.defaults.lang = "fr";

//  Créer une facture
exports.createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement", err });
  }
};


//  Récupérer toutes les factures (et mettre à jour le statut)
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    const today = new Date();

    for (const inv of invoices) {
      const total = inv.totals?.total || 0;
      const advance = inv.payment?.advanceAmount || 0;
      const remaining = total - advance;
      const dueDate = inv.payment?.remainingDate
        ? new Date(inv.payment.remainingDate)
        : null;

      let newStatut = "attente";
      if (advance > 0 && advance < total) newStatut = "avance";
      if (remaining <= 0 || advance >= total) newStatut = "payee";
      if (remaining > 0 && dueDate && dueDate < today) newStatut = "retard";

      if (inv.statut !== newStatut) {
        inv.statut = newStatut;
        inv.payment.remainingAmount = remaining;
        await inv.save();
      }
    }

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

//  Récupérer une facture par ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice)
      return res.status(404).json({ message: "Facture introuvable" });
    res.json(invoice);
    
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération", err });
  }
};


//  Mettre à jour une facture existante
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const invoice = await Invoice.findByIdAndUpdate(id, updatedData, {
      new: true, 
      runValidators: true,
    });

    if (!invoice) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }

    res.status(200).json({
      message: "Facture mise à jour avec succès",
      invoice,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la facture :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


// 🔹 Supprimer une facture
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice)
      return res.status(404).json({ message: "Facture introuvable" });
    res.json({ message: "✅ Facture supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", err });
  }
};


// 🔹 Chiffre d’affaires = total payé (avances + factures entièrement payées)
exports.getChiffreAffaires = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const invoices = await Invoice.find(filter);

    // 🔹 total payé = avances + montants payés intégralement
    const totalPayé = invoices.reduce((sum, inv) => {
      if (inv.statut === "payee") return sum + (inv.totals?.total || 0) ;
      if (inv.statut === "avance") return sum + (inv.payment?.advanceAmount || 0) ;
      if (inv.statut === "attente") return sum + (inv.totals?.total || 0) ;
      return sum; // en attente ou autres → 0
    }, 0);

    res.json({ totalPayé });
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération CA", err });
  }
};

// 🔹 Mettre à jour le statut d'une facture
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { statut } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }

    // Si on la passe en "payée"
    if (statut === "payee") {
      invoice.statut = "payee";
      invoice.payment.advanceAmount = invoice.totals?.total || 0; // tout payé
      invoice.payment.remainingAmount = 0;
    }

    // Si on la remet en "avance"
    else if (statut === "avance") {
      const advance = invoice.payment?.advanceAmount || 0;
      const total = invoice.totals?.total || 0;
      invoice.statut = "avance";
      invoice.payment.remainingAmount = total - advance;
    }

    // Si on la remet en "attente"
    else if (statut === "attente") {
      invoice.statut = "attente";
      invoice.payment.advanceAmount = 0;
      invoice.payment.remainingAmount = invoice.totals?.total || 0;
    }

    await invoice.save();
    res.json({ message: "Statut mis à jour avec succès", invoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
  }
};


// Générer et télécharger une facture en PDF avec Puppeteer
exports.downloadInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) return res.status(404).json({ message: "Facture introuvable" });

    // Préparer les données

    const subtotalHT = invoice.items.reduce((acc, i) => acc + i.price * i.qty, 0);
    const totalRemise = invoice.totals?.totalRemise || 0;
    const subtotalAfterRemise = subtotalHT - totalRemise;
    const css = invoice.totals?.css || 0;
    const totalTVA = invoice.totals?.totalTVA || invoice.items.reduce((acc, i) => acc + (i.price * i.qty * (i.tva || 0) / 100), 0);
    const totalTTC = subtotalAfterRemise + totalTVA + css;

    const data = {
      companyLogo: invoice.company.logo,
      companyName: invoice.company.name,
      companyAddress: invoice.company.address,
      companyNumber: invoice.company.number,
      companyEmail: invoice.company.email,
      clientName: invoice.client.raisonSocial,
      clientRepresentative: invoice.client.representative,
      clientAddress: invoice.client.address,
      clientPhone: invoice.client.phone,
      clientEmail: invoice.client.email,
      invoiceNumber: invoice.invoice.number,
      invoiceDate: invoice.invoice.date.toISOString().split("T")[0],
      invoiceDueDate: invoice.invoice.dueDate ? invoice.invoice.dueDate.toISOString().split("T")[0] : null,
      title: invoice.title || "FACTURE",
      serviceSubject: invoice.service.subject,
      items: invoice.items.map(i => ({
        reference: i.reference,
        designation: i.designation,
        price: i.price,
        qty: i.qty,
        total: i.price * i.qty,
        totalTTC: i.price * i.qty * (1 + (i.tva || 0) / 100),
        tva: i.tva
      })),
      subtotal: subtotalHT,
      totalRemise: totalRemise,
      subtotalAfterRemise: subtotalAfterRemise,
      css: css,
      totalTVA: totalTVA,
      total: totalTTC,
      currencySymbol: "FCFA",
      accountMethod: invoice.account.method,
      accountNumber: invoice.account.number,
      accountRIB: invoice.account.rib,
      advancePercent: invoice.payment.advancePercent,
      advanceAmount: invoice.payment.advanceAmount,
      advanceDate: invoice.payment.advanceDate,
      remainingPercent: invoice.payment.remainingPercent,
      remainingAmount: invoice.payment.remainingAmount,
      remainingDate: invoice.payment.remainingDate
    };

    const montantEnLettres = writtenNumber(Math.round(data.total));

    // Générer le HTML complet
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Facture ${data.invoiceNumber}</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
  /* =================== BASE =================== */
  body {
    font-size: 14px;
    margin: 0;
    padding: 0;
  }
  #invoice {
    width: 210mm;
  height: 297mm;
  box-sizing: border-box;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; 
  font-family: sans-serif;
  margin-top: 0; 
  }

  /* Conteneur central pour tout le contenu sauf le footer */
.invoice-content {
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  gap: 8px; /* un peu d'espace entre les sections */
  padding-bottom: 60px;
}
  h1,h2,h3 { margin: 0; }
  h1 { font-size: 20px; }
  h2 { font-size: 18px; }
  h3 { font-size: 16px; }

  /* =================== TABLE =================== */
  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 13px;
  }
  th, td {
    padding: 4px 6px;
    text-align: left;
  }
  th {
    background-color: #1D4ED8;
    color: #fff;
    font-weight: bold;
  }
  td {
    border-bottom: 1px solid #E5E7EB;
  }

  /* =================== SECTIONS =================== */
  .section { margin-bottom: 12px; }
  .flex-between { display: flex; justify-content: space-between; align-items: center; }
  .text-right { text-align: right; }
  .text-center { text-align: center; }
  .totals { width: 70%; font-size: 14px; }
  .totals div { display: flex; justify-content: space-between; padding: 4px 0; }
  .totals .total { background-color: #1D4ED8; color: white; font-weight: bold; padding: 6px; border-radius: 4px; }

  /* =================== MODALITES & CONDITIONS =================== */
.payment-terms {
  display: flex;             
  justify-content: space-between; 
  gap: 12px;                 
  margin-bottom: 16px;
  padding-bottom: 50px;
}

.payment-terms > div {
  flex: 1;                   
  border: none;
  
}

.payment-terms h3 {
  font-weight: 700;
  background-color: #1D4ED8;
  color: #fff;
  padding: 4px;
  
  margin: 0;
}

.payment-terms div > div {
  padding: 4px;
  
   
}

  /* =================== FOOTER =================== */
  .footer {
    font-size: 10px;
    text-align: center;
    margin-top: 40px;
    text-color: #00000;
  }
  /* =================== OBJET =================== */
  .invoice-object {
    background-color: #DBEAFE;
    border-left: 4px solid #1D4ED8;
    padding: 8px;
    margin-bottom: 16px;
    font-size: 14px;
  }

  /* =================== ESPACEMENTS ADITIONNELS =================== */
  .section + .section { margin-top: 8px; }
  .table-container { margin-bottom: 16px; }
  .amount-in-words {
    width: 20rem;               
    text-align: right;           
    font-size: 0.6rem;           
    color: #4B5563;              
    font-style: italic;          
    margin-top: 0.25rem;         
    white-space: nowrap;         
  }
  
  .amount-in-words span {
    font-weight: 600;           
  }
  
</style>
</head>
<body class="bg-white p-0 m-0">
<div id="invoice" class="bg-white font-sans">
<div class="invoice-content">

  <!-- HEADER -->
  <div class="flex justify-between items-start border-b pb-4 mb-4 border-gray-300">
    <div class="flex flex-col items-center space-y-2">
      ${data.companyLogo ? `<img src="${data.companyLogo}" alt="Logo" class="h-16 w-16 object-cover" />` : ""}
      <h1 class="text-base font-extrabold text-blue-600">${data.companyName}</h1>
    </div>
    <div class="text-right">
      <h2 class="text-base font-extrabold text-blue-600 uppercase">${data.title}</h2>
      <p class="text-gray-700 text-xs mt-1"><strong>N° :</strong> ${data.invoiceNumber}</p>
      <p class="text-gray-700 text-xs"><strong>Établie le :</strong> ${data.invoiceDate}</p>
      ${data.invoiceDueDate ? `<p class="text-gray-700 text-xs"><strong>Échéance :</strong> ${data.invoiceDueDate}</p>` : ""}
    </div>
  </div>

  <!-- COMPANY & CLIENT INFO -->
  <div class="flex justify-between mb-4 p-2 bg-gray-50 section">
    <div>
      ${data.companyAddress ? `<p class="text-gray-600 text-xs"><strong>Adresse :</strong> ${data.companyAddress}</p>` : ""}
      ${data.companyNumber ? `<p class="text-gray-600 text-xs"><strong>Téléphone :</strong> ${data.companyNumber}</p>` : ""}
      ${data.companyEmail ? `<p class="text-gray-600 text-xs"><strong>E-mail :</strong> ${data.companyEmail}</p>` : ""}
    </div>
    ${data.clientName ? `
    <div>
      <p class="text-gray-700 text-xs"><strong>Raison sociale :</strong> ${data.clientName}</p>
      ${data.clientRepresentative ? `<p class="text-gray-700 text-xs"><strong>Représentant :</strong> ${data.clientRepresentative}</p>` : ""}
      ${data.clientAddress ? `<p class="text-gray-700 text-xs"><strong>Adresse :</strong> ${data.clientAddress}</p>` : ""}
      ${data.clientPhone ? `<p class="text-gray-700 text-xs"><strong>Téléphone :</strong> ${data.clientPhone}</p>` : ""}
      ${data.clientEmail ? `<p class="text-gray-700 text-xs"><strong>Email :</strong> ${data.clientEmail}</p>` : ""}
    </div>` : ""}
  </div>

  <!-- OBJET / SERVICE -->
  ${data.serviceSubject ? `
  <div class="invoice-object">
    <p class="text-gray-800 text-xs"><span class="font-semibold">Objet de la facture:</span> ${data.serviceSubject}</p>
  </div>` : ""}

  <!-- TABLEAU DES ARTICLES -->
  <div class="table-container overflow-x-auto rounded-sm border border-gray-200 section">
    <table class="min-w-full text-xs">
      <thead class="bg-blue-600 text-white">
        <tr>
          <th class="p-1 text-left">Réf</th>
          <th class="p-1 text-left">Désignation</th>
          <th class="p-1 text-right">PUHT (${data.currencySymbol})</th>
          <th class="p-1 text-right">Quantité/jour</th>
          <th class="p-1 text-right">Total HT (${data.currencySymbol})</th>
          <th class="p-1 text-right">TVA (%)</th>
          <th class="p-1 text-right">Total TTC (${data.currencySymbol})</th>
          
        </tr>
      </thead>
      <tbody>
        ${data.items.map((item, idx) => `
          <tr class="${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
            <td class="p-1">${item.reference}</td>
            <td class="p-1">${item.designation}</td>
            <td class="p-1 text-right">${Number(item.price).toFixed(2)}</td>
            <td class="p-1 text-right">${item.qty}</td>
            <td class="p-1 text-right">${Number(item.price * item.qty).toFixed(2)}</td>
            <td class="p-1 text-right">${Number(item.tva|| 0).toFixed(2)}</td>
            <td class="p-1 text-right">${Number(item.totalTTC).toFixed(2)}</td>
          </tr>`).join("")}
      </tbody>
    </table>
  </div>

  <!-- TOTAUX -->
  <div class="flex flex-col items-end mb-4 space-y-1 section">
      <div class="w-64 text-xs">
      ${data.totalRemise > 0 ? `
        <div class="flex justify-between py-1 border-b">
          <span class="font-semibold">Sous-total avant remise :</span>
          <span>${data.subtotal.toFixed(2)} ${data.currencySymbol}</span>
        </div>
        <div class="flex justify-between py-1 border-b text-red-600">
          <span class="font-semibold">Remise :</span>
          <span>- ${data.totalRemise.toFixed(2)} ${data.currencySymbol}</span>
        </div>
        <div class="flex justify-between py-1 border-b">
          <span class="font-semibold">Sous-total après remise :</span>
          <span>${data.subtotalAfterRemise.toFixed(2)} ${data.currencySymbol}</span>
        </div>
      ` : `
        <div class="flex justify-between py-1 border-b">
          <span class="font-semibold">Sous-total :</span>
          <span>${data.subtotal.toFixed(2)} ${data.currencySymbol}</span>
        </div>
      `}
      <div class="flex justify-between py-1 border-b">
        <span class="font-semibold">CSS 1% :</span>
        <span>${data.css.toFixed(2)} ${data.currencySymbol}</span>
      </div>
        <div class="flex justify-between py-1 border-b">
          <span class="font-semibold">Total TVA :</span>
          <span>${data.totalTVA.toFixed(2)} ${data.currencySymbol}</span>
        </div>
        <div class="flex justify-between py-1 bg-blue-600 text-white font-bold mt-1">
          <span class="pl-2">MONTANT TTC :</span>
          <span class="pr-2">${data.total.toFixed(2)} ${data.currencySymbol}</span>
        </div>
      </div>
    </div>

  <!-- Montant en lettres -->
  <div class="w-80 text-right text-[0.6rem] text-gray-700 italic amount-in-words">
    Arrêté de la présente facture au montant net de :
    <span class="font-semibold">${montantEnLettres} ${data.currencySymbol}</span>
  </div>

  <!-- MODALITÉS & CONDITIONS -->
  <div class="payment-terms section text-xs"">
    <div>
      <h3 class="font-bold bg-blue-600 text-white p-1 ">Modalités de paiement</h3>
      <div class="  p-1 rounded-b space-y-1">
        ${data.accountMethod ? `<p><strong>Méthode:</strong> ${data.accountMethod}</p>` : ""}
        ${data.accountNumber ? `<p><strong>Compte:</strong> ${data.accountNumber}</p>` : ""}
        ${data.accountRIB ? `<p><strong>RIB:</strong> ${data.accountRIB}</p>` : ""}
      </div>
    </div>
    <div>
      <h3 class="font-bold bg-blue-600 text-white p-1 ">Conditions de règlement</h3>
      <div class="  p-1 rounded-b space-y-1">
        ${data.advancePercent && data.advanceAmount && data.advanceDate ? `<p>${data.advancePercent}% de la facture, soit ${data.advanceAmount} ${data.currencySymbol} avancé le ${new Date(data.advanceDate).toLocaleDateString("fr-FR")}</p>` : ""}
        ${data.remainingPercent && data.remainingAmount && data.remainingDate ? `<p>${data.remainingPercent}% de la facture, soit ${data.remainingAmount} ${data.currencySymbol} avant le ${new Date(data.remainingDate).toLocaleDateString("fr-FR")}</p>` : ""}
      </div>
    </div>
  </div>
  </div>
  <!-- FOOTER -->
  <div class="footer text-xs text-gray-600 font-semibold">
    Merci pour la confiance que vous nous accordez !
  </div>
  <div class="border-t border-gray-300 pt-2 flex flex-col items-center text-xs text-gray-600 text-center">
    <p class=" text-[0.6rem]" text-black -900 >OD-Partners est membre du groupe African Business Consulting-Group (ABC GROUP) Comptabilité- Fiscalité-Conseil.</p>
    <div class="flex flex-row text-[0.6rem] justify-center items-center space-x-4 mt-1 ">
      ${data.companyNumber ? `<div>📞 ${data.companyNumber}</div>` : ""}
      ${data.companyEmail ? `<div>✉️ ${data.companyEmail}</div>` : ""}
      ${data.companyAddress ? `<div>📍 ${data.companyAddress}</div>` : ""}
    </div>
  </div>
</div>
</body>
</html>
`;

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '10mm', left: '10mm', right: '10mm' },
      scale: 1
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=facture-${data.invoiceNumber}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la génération du PDF", error });
  }
};


const generateInvoicePDF = async (invoice) => {
      // Préparer les données
  const subtotalHT = invoice.items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const totalRemise = invoice.totals?.totalRemise || 0;
  const subtotalAfterRemise = subtotalHT - totalRemise;
  const css = invoice.totals?.css || 0;
  const totalTVA = invoice.totals?.totalTVA || invoice.items.reduce((acc, i) => acc + (i.price * i.qty * (i.tva || 0) / 100), 0);
  const totalTTC = subtotalAfterRemise + totalTVA + css;

  const data = {
    companyLogo: invoice.company.logo,
    companyName: invoice.company.name,
    companyAddress: invoice.company.address,
    companyNumber: invoice.company.number,
    companyEmail: invoice.company.email,
    clientName: invoice.client.raisonSocial,
    clientRepresentative: invoice.client.representative,
    clientAddress: invoice.client.address,
    clientPhone: invoice.client.phone,
    clientEmail: invoice.client.email,
    invoiceNumber: invoice.invoice.number,
    invoiceDate: invoice.invoice.date.toISOString().split("T")[0],
    invoiceDueDate: invoice.invoice.dueDate ? invoice.invoice.dueDate.toISOString().split("T")[0] : null,
    title: invoice.title || "FACTURE",
    serviceSubject: invoice.service.subject,
    items: invoice.items.map(i => ({
      reference: i.reference,
      designation: i.designation,
      price: i.price,
      qty: i.qty,
      total: i.price * i.qty,
      totalTTC: i.price * i.qty * (1 + (i.tva || 0) / 100),
      tva: i.tva
    })),
    subtotal: subtotalHT,
    totalRemise: totalRemise,
    subtotalAfterRemise: subtotalAfterRemise,
    css: css,
    totalTVA: totalTVA,
    total: totalTTC,
    currencySymbol: "FCFA",
    accountMethod: invoice.account.method,
    accountNumber: invoice.account.number,
    accountRIB: invoice.account.rib,
    advancePercent: invoice.payment.advancePercent,
    advanceAmount: invoice.payment.advanceAmount,
    advanceDate: invoice.payment.advanceDate,
    remainingPercent: invoice.payment.remainingPercent,
    remainingAmount: invoice.payment.remainingAmount,
    remainingDate: invoice.payment.remainingDate
  };

  
      const montantEnLettres = writtenNumber(Math.round(data.total));
  
      // Générer le HTML complet
      const html = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Facture ${data.invoiceNumber}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* =================== BASE =================== */
    body {
      font-size: 14px;
      margin: 0;
      padding: 0;
    }
    #invoice {
      width: 210mm;
    height: 297mm;
    box-sizing: border-box;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; 
    font-family: sans-serif;
    margin-top: 0; 
    }
  
    /* Conteneur central pour tout le contenu sauf le footer */
  .invoice-content {
    flex: 0 1 auto;
    display: flex;
    flex-direction: column;
    gap: 8px; /* un peu d'espace entre les sections */
    padding-bottom: 60px;
  }
    h1,h2,h3 { margin: 0; }
    h1 { font-size: 20px; }
    h2 { font-size: 18px; }
    h3 { font-size: 16px; }
  
    /* =================== TABLE =================== */
    table {
      border-collapse: collapse;
      width: 100%;
      font-size: 13px;
    }
    th, td {
      padding: 4px 6px;
      text-align: left;
    }
    th {
      background-color: #1D4ED8;
      color: #fff;
      font-weight: bold;
    }
    td {
      border-bottom: 1px solid #E5E7EB;
    }
  
    /* =================== SECTIONS =================== */
    .section { margin-bottom: 12px; }
    .flex-between { display: flex; justify-content: space-between; align-items: center; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .totals { width: 70%; font-size: 14px; }
    .totals div { display: flex; justify-content: space-between; padding: 4px 0; }
    .totals .total { background-color: #1D4ED8; color: white; font-weight: bold; padding: 6px; border-radius: 4px; }
  
    /* =================== MODALITES & CONDITIONS =================== */
  .payment-terms {
    display: flex;             
    justify-content: space-between; 
    gap: 12px;                 
    margin-bottom: 16px;
    padding-bottom: 50px;
  }
  
  .payment-terms > div {
    flex: 1;                   
    border: none;
    
  }
  
  .payment-terms h3 {
    font-weight: 700;
    background-color: #1D4ED8;
    color: #fff;
    padding: 4px;
    
    margin: 0;
  }
  
  .payment-terms div > div {
    padding: 4px;
    
     
  }
  
    /* =================== FOOTER =================== */
    .footer {
      font-size: 10px;
      text-align: center;
      margin-top: 40px;
      text-color: #00000;
    }
    /* =================== OBJET =================== */
    .invoice-object {
      background-color: #DBEAFE;
      border-left: 4px solid #1D4ED8;
      padding: 8px;
      margin-bottom: 16px;
      font-size: 14px;
    }
  
    /* =================== ESPACEMENTS ADITIONNELS =================== */
    .section + .section { margin-top: 8px; }
    .table-container { margin-bottom: 16px; }
    .amount-in-words {
      width: 20rem;               
      text-align: right;           
      font-size: 0.6rem;           
      color: #4B5563;              
      font-style: italic;          
      margin-top: 0.25rem;         
      white-space: nowrap;         
    }
    
    .amount-in-words span {
      font-weight: 600;           
    }
    
  </style>
  </head>
  <body class="bg-white p-0 m-0">
  <div id="invoice" class="bg-white font-sans">
  <div class="invoice-content">
  
    <!-- HEADER -->
    <div class="flex justify-between items-start border-b pb-4 mb-4 border-gray-300">
      <div class="flex flex-col items-center space-y-2">
        ${data.companyLogo ? `<img src="${data.companyLogo}" alt="Logo" class="h-16 w-16 object-cover" />` : ""}
        <h1 class="text-base font-extrabold text-blue-600">${data.companyName}</h1>
      </div>
      <div class="text-right">
        <h2 class="text-base font-extrabold text-blue-600 uppercase">${data.title}</h2>
        <p class="text-gray-700 text-xs mt-1"><strong>N° :</strong> ${data.invoiceNumber}</p>
        <p class="text-gray-700 text-xs"><strong>Établie le :</strong> ${data.invoiceDate}</p>
        ${data.invoiceDueDate ? `<p class="text-gray-700 text-xs"><strong>Échéance :</strong> ${data.invoiceDueDate}</p>` : ""}
      </div>
    </div>
  
    <!-- COMPANY & CLIENT INFO -->
    <div class="flex justify-between mb-4 p-2 bg-gray-50 section">
      <div>
        ${data.companyAddress ? `<p class="text-gray-600 text-xs"><strong>Adresse :</strong> ${data.companyAddress}</p>` : ""}
        ${data.companyNumber ? `<p class="text-gray-600 text-xs"><strong>Téléphone :</strong> ${data.companyNumber}</p>` : ""}
        ${data.companyEmail ? `<p class="text-gray-600 text-xs"><strong>E-mail :</strong> ${data.companyEmail}</p>` : ""}
      </div>
      ${data.clientName ? `
      <div>
        <p class="text-gray-700 text-xs"><strong>Raison sociale :</strong> ${data.clientName}</p>
        ${data.clientRepresentative ? `<p class="text-gray-700 text-xs"><strong>Représentant :</strong> ${data.clientRepresentative}</p>` : ""}
        ${data.clientAddress ? `<p class="text-gray-700 text-xs"><strong>Adresse :</strong> ${data.clientAddress}</p>` : ""}
        ${data.clientPhone ? `<p class="text-gray-700 text-xs"><strong>Téléphone :</strong> ${data.clientPhone}</p>` : ""}
        ${data.clientEmail ? `<p class="text-gray-700 text-xs"><strong>Email :</strong> ${data.clientEmail}</p>` : ""}
      </div>` : ""}
    </div>
  
    <!-- OBJET / SERVICE -->
    ${data.serviceSubject ? `
    <div class="invoice-object">
      <p class="text-gray-800 text-xs"><span class="font-semibold">Objet de la facture:</span> ${data.serviceSubject}</p>
    </div>` : ""}
  
    <!-- TABLEAU DES ARTICLES -->
    <div class="table-container overflow-x-auto rounded-sm border border-gray-200 section">
      <table class="min-w-full text-xs">
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="p-1 text-left">Réf</th>
            <th class="p-1 text-left">Désignation</th>
            <th class="p-1 text-right">PUHT (${data.currencySymbol})</th>
            <th class="p-1 text-right">Quantité/jour</th>
            <th class="p-1 text-right">Total HT (${data.currencySymbol})</th>
            <th class="p-1 text-right">TVA (%)</th>
            <th class="p-1 text-right">Total TTC (${data.currencySymbol})</th>
            
          </tr>
        </thead>
        <tbody>
          ${data.items.map((item, idx) => `
          <tr class="${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
            <td class="p-1">${item.reference}</td>
            <td class="p-1">${item.designation}</td>
            <td class="p-1 text-right">${Number(item.price).toFixed(2)}</td>
            <td class="p-1 text-right">${item.qty}</td>
            <td class="p-1 text-right">${Number(item.price * item.qty).toFixed(2)}</td>
            <td class="p-1 text-right">${Number(item.tva|| 0).toFixed(2)}</td>
            <td class="p-1 text-right">${Number(item.totalTTC).toFixed(2)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
  
    <!-- TOTAUX -->
    <div class="flex flex-col items-end mb-4 space-y-1 section">
      <div class="w-64 text-xs">
      ${data.totalRemise > 0 ? `
        <div class="flex justify-between py-1 border-b">
          <span class="font-semibold">Sous-total avant remise :</span>
          <span>${data.subtotal.toFixed(2)} ${data.currencySymbol}</span>
        </div>
        <div class="flex justify-between py-1 border-b text-red-600">
          <span class="font-semibold">Remise :</span>
          <span>- ${data.totalRemise.toFixed(2)} ${data.currencySymbol}</span>
        </div>
        <div class="flex justify-between py-1 border-b">
          <span class="font-semibold">Sous-total après remise :</span>
          <span>${data.subtotalAfterRemise.toFixed(2)} ${data.currencySymbol}</span>
        </div>
      ` : `
        <div class="flex justify-between py-1 border-b">
          <span class="font-semibold">Sous-total :</span>
          <span>${data.subtotal.toFixed(2)} ${data.currencySymbol}</span>
        </div>
      `}
      <div class="flex justify-between py-1 border-b">
        <span class="font-semibold">CSS 1% :</span>
        <span>${data.css.toFixed(2)} ${data.currencySymbol}</span>
      </div>
        <div class="flex justify-between py-1 border-b">
          <span class="font-semibold">Total TVA :</span>
          <span>${data.totalTVA.toFixed(2)} ${data.currencySymbol}</span>
        </div>
        <div class="flex justify-between py-1 bg-blue-600 text-white font-bold mt-1">
          <span class="pl-2">MONTANT TTC :</span>
          <span class="pr-2">${data.total.toFixed(2)} ${data.currencySymbol}</span>
        </div>
      </div>
    </div>
  
    <!-- Montant en lettres -->
    <div class="w-80 text-right text-[0.6rem] text-gray-700 italic amount-in-words">
      Arrêté de la présente facture au montant net de :
      <span class="font-semibold">${montantEnLettres} ${data.currencySymbol}</span>
    </div>
  
    <!-- MODALITÉS & CONDITIONS -->
    <div class="payment-terms section text-xs"">
      <div>
        <h3 class="font-bold bg-blue-600 text-white p-1 ">Modalités de paiement</h3>
        <div class="  p-1 rounded-b space-y-1">
          ${data.accountMethod ? `<p><strong>Méthode:</strong> ${data.accountMethod}</p>` : ""}
          ${data.accountNumber ? `<p><strong>Compte:</strong> ${data.accountNumber}</p>` : ""}
          ${data.accountRIB ? `<p><strong>RIB:</strong> ${data.accountRIB}</p>` : ""}
        </div>
      </div>
      <div>
        <h3 class="font-bold bg-blue-600 text-white p-1 ">Conditions de règlement</h3>
        <div class="  p-1 rounded-b space-y-1">
          ${data.advancePercent && data.advanceAmount && data.advanceDate ? `<p>${data.advancePercent}% de la facture, soit ${data.advanceAmount} ${data.currencySymbol} avancé le ${new Date(data.advanceDate).toLocaleDateString("fr-FR")}</p>` : ""}
          ${data.remainingPercent && data.remainingAmount && data.remainingDate ? `<p>${data.remainingPercent}% de la facture, soit ${data.remainingAmount} ${data.currencySymbol} avant le ${new Date(data.remainingDate).toLocaleDateString("fr-FR")}</p>` : ""}
        </div>
      </div>
    </div>
    </div>
    <!-- FOOTER -->
    <div class="footer text-xs text-gray-600 font-semibold">
      Merci pour la confiance que vous nous accordez !
    </div>
    <div class="border-t border-gray-300 pt-2 flex flex-col items-center text-xs text-gray-600 text-center">
      <p class=" text-[0.6rem] text-black-900" >OD-Partners est membre du groupe African Business Consulting-Group (ABC GROUP) Comptabilité- Fiscalité-Conseil.</p>
      <div class="flex flex-row text-[0.6rem] justify-center items-center space-x-4 mt-1 ">
        ${data.companyNumber ? `<div>📞 ${data.companyNumber}</div>` : ""}
        ${data.companyEmail ? `<div>✉️ ${data.companyEmail}</div>` : ""}
        ${data.companyAddress ? `<div>📍 ${data.companyAddress}</div>` : ""}
      </div>
    </div>
  </div>
  </body>
  </html>
  `;

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "15mm", bottom: "10mm", left: "10mm", right: "10mm" },
    scale: 1
  });
  await browser.close();
  return pdfBuffer;
};


/* -----------------------------
  ENVOI FACTURE PAR EMAIL
------------------------------ */
exports.sendInvoiceByEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { email: userEmail } = req.body;

    const invoice = await Invoice.findById(id).populate("client");
    if (!invoice) return res.status(404).json({ message: "Facture introuvable" });

    const clientEmail = invoice.client?.email || userEmail;
    if (!clientEmail) return res.status(400).json({ message: "Email client manquant" });

    // Générer le PDF
    const pdfBuffer = await generateInvoicePDF(invoice);

    // Configurer Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: `Votre facture N°${invoice.invoice.number}`,
      html: `
        <p>Bonjour ${invoice.client?.raisonSocial || "Client"},</p>
        <p>Veuillez trouver votre facture en pièce jointe.</p>
        <p>Merci pour votre confiance.</p>
      `,
      attachments: [
        {
          filename: `facture-${invoice.invoice.number}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Email envoyé avec succès" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email", err });
  }
};
