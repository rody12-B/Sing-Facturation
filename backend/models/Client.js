const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  codeClient: { type: String, required: true, unique: true }, 
  raisonSocial: { type: String, required: true },
  type: { type: String, enum: ["professionnel", "particulier"], required: true },
  tel: { type: String },
  adress: { type: String, required: true },
  mail: { type: String, required: true, unique: true },
  archived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Client", clientSchema);
