const Categorie = require("../models/Categorie");

// Créer une catégorie
exports.createCategorie = async (req, res) => {
  try {
    const categorie = new Categorie(req.body);
    await categorie.save();
    res.status(201).json(categorie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lister toutes les catégories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Categorie.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
