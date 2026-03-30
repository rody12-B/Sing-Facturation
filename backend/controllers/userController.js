const fs = require('fs');
const path = require('path');
const User = require("../models/User");


exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return  res.status(404).json({message: "Utilisateur introuvable"});

        const { raisonSocial, email, avatar } = req.body;


    if (raisonSocial) user.personnelInfo.raisonSocial = raisonSocial;
    if (avatar) user.personnelInfo.avatar = avatar; 
    if (email) user.contactInfo.email = email;

    await user.save();

    res.json({
      _id: user._id,
      raisonSocial: user.personnelInfo.raisonSocial,
      avatar: user.personnelInfo.avatar,
      email: user.contactInfo.email,
    });

    }catch (err) {
        res.status(500).json({message: err.message});
    }
};


exports.getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({message: "Utilisateur introuvable ! "});
        
        res.json(user);

    }catch (err) {
        res.status(500).json({message: err.message});
    }
};