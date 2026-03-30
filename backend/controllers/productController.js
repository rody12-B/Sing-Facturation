const Product = require("../models/Produit");

// Créer un produit
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lister tous les produits avec leur catégorie
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categorie"); // populate pour récupérer les infos de la catégorie
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rechercher un client par raison sociale
exports.searchProduit = async (req, res) => {
    try {
      const { nom } = req.query;
  
      if (!nom) {
        return res.status(400).json({ message: "Veuillez fournir le produit" });
      }
  
      // 🔥 Utiliser find() au lieu de findOne()
      const products = await Product.find({
        nom: { $regex: nom, $options: "i" },
      }).limit(10); // limite à 10 résultats max pour éviter de charger trop
  
      if (products.length === 0) {
        return res.status(404).json({ message: "Aucun produit trouvé" });
      }
  
      res.json(products); // ✅ On renvoie un tableau de clients
    } catch (error) {
      console.error("Erreur lors de la recherche du produit:", error);
      res.status(500).json({ message: "Erreur serveur", error });
    }
  };
  
// Récupérer un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categorie");
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Produit non trouvé" });
  
      // Mise à jour des champs
      product.codeProduit = req.body.codeProduit || product.codeProduit;
      product.nom = req.body.nom || product.nom;
      product.prixUnitaire = req.body.prixUnitaire || product.prixUnitaire;
      product.description = req.body.description || product.description;
      product.categorie = req.body.categorie || product.categorie;
  
      await product.save();
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });
    res.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
