const User = require("../models/User");
const jwt = require("jsonwebtoken");



// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { personnelInfo, contactInfo, activiteInfo } = req.body;

    const userExists = await User.findOne({ "contactInfo.email": contactInfo.email });
    if (userExists) return res.status(400).json({ message: "L'utilisateur existe déjà" });

    // Le hash est fait automatiquement par le pre('save')
    const user = await User.create({ personnelInfo, contactInfo, activiteInfo });

    res.status(201).json({ _id: user._id, token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ "contactInfo.email": email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // ✅ Crée la session avant de répondre
    req.session.userId = user._id;

    // ✅ Génère le JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// Déconnexion
exports.logout = (req, res) => {
  // Supprime la session côté serveur
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }

    // Supprime le cookie de session côté client
    res.clearCookie("connect.sid", { path: "/" });

    res.json({ message: "Déconnexion réussie" });
  });
};

// Mise à jour étape par étape
exports.updateStep = async (req, res) => {
  try {
    const { step, data } = req.body; // "personnelInfo" | "contactInfo" | "activiteInfo"
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    user[step] = data;

    await user.save(); // hash automatique si mot de passe modifié

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Récupérer l'utilisateur connecté
exports.getMe = async (req, res) => {
  res.json(req.user);
};
