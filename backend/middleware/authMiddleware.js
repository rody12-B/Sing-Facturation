const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let userId = null;

    // ✅ Vérifie JWT
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }

    // ✅ Vérifie session si JWT absent
    if (!userId && req.session?.userId) {
      userId = req.session.userId;
    }

    if (!userId) {
      return res.status(401).json({ message: "Non autorisé : token ou session manquant" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(401).json({ message: "Utilisateur introuvable" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Non autorisé", error: error.message });
  }
};

