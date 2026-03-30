const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { 
    
    updateProfile, 
     
} = require("../controllers/userController");

// Routes protégées
router.put("/profile", protect, updateProfile);




module.exports = router;
