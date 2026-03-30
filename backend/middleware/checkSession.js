const User = require("../models/User");

exports.checkSession = async (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Session expirée" });
  }

  try {
    const user = await User.findById(req.session.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Utilisateur introuvable" });

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
