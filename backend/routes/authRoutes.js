const express = require("express");
const { register, login, getMe,  updateStep } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require('../middleware/uploadMiddleware');
const { checkSession } = require("../middleware/checkSession");
const User = require("../models/User");
const router = express.Router();

router.post("/register", register);          
router.post("/login", login);                
router.get("/me", protect, getMe);         
router.put("/me/step", updateStep);

router.get("/protected", checkSession, (req, res) => {
  res.json({ message: `Bienvenue ${req.user.personnelInfo.raisonSocial}` });
});

router.post("/check-email", async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: "Email manquant" });
      }
  
      // Chercher un utilisateur avec cet email
      const user = await User.findOne({ "contactInfo.email": email });
  
      if (user) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message : "Pas de fichier telechargé "});
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`;
    res.status(200).json({ imageUrl });
}
);

module.exports = router; 