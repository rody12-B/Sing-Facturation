const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  codeProduit: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  prixUnitaire: { type: Number, required: true },
  description: { type: String },
  categorie: { type: mongoose.Schema.Types.ObjectId, ref: "Categorie", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
