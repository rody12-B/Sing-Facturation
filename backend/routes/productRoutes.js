const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware"); 



// Les routes protégées
router.post("/create-produit",  productController.createProduct);
router.put("/update-produit/:id",  productController.updateProduct);
router.delete("/delete-produit/:id",  productController.deleteProduct);

// Les routes non protégées
router.get("/produits", productController.getProducts);
router.get("/get-produit/:id", productController.getProductById);
router.get("/search", productController.searchProduit);

module.exports = router;
