const express = require("express");
const router = express.Router();
const catController = require("../controllers/catController");
const { protect } = require("../middleware/authMiddleware");

// Route pour créer une catégorie (protégée)
router.post("/creer-categorie",  catController.createCategorie);
// Route pour lister toutes les catégories
router.get("/categories", catController.getCategories);

module.exports = router;

