const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const { protect } = require("../middleware/authMiddleware");

// Routes protégées (seulement accessibles si connecté)
router.post("/creer-facture",  invoiceController.createInvoice);
router.put("/modifier-facture/:id",  invoiceController.updateInvoice);
router.delete("/supprimer-facture/:id",  invoiceController.deleteInvoice);
router.put("/update-status/:id",  invoiceController.updateInvoiceStatus);
router.post("/send-email/:id",  invoiceController.sendInvoiceByEmail);  

// Routes publiques (facultatif)
router.get("/get-facture",  invoiceController.getInvoices);
router.get("/facture/:id",  invoiceController.getInvoiceById);
router.get("/chiffre-affaires",  invoiceController.getChiffreAffaires);
router.get("/download/:id",  invoiceController.downloadInvoicePDF);

module.exports = router;
