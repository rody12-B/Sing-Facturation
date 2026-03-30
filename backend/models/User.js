const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  personnelInfo: {
    raisonSocial: { type: String, required: true },
    nif: { type: String, required: true },
    date: { type: Date, required: true },
    statut: { type: String, required: true },
    avatar: { type: String }
  },
  contactInfo: {
    email: { type: String, required: true, unique: true },
    codePostal: String,
    region: String,
    num: String
  },
  activiteInfo: {
    typeActivite: { type: String, required: true },
    tva: Boolean,
    password: { type: String, required: true }
  }
}, { timestamps: true });

// Hash le mot de passe avant chaque sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('activiteInfo.password')) return next();
  this.activiteInfo.password = await bcrypt.hash(this.activiteInfo.password, 10);
  next();
});

// Comparer le mot de passe
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.activiteInfo.password);
};

module.exports = mongoose.model('User', userSchema);
