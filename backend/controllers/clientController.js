const Client = require("../models/Client");

// Récupérer tous les clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find()
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer un client
exports.createClient = async (req, res) => {
  try {
    const newClient = new Client(req.body);
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement", error  });
  }
};

// Récupérer un client par ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    res.json(client);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération du client", error: err });
  }
};


// Mettre à jour un client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { codeClient, raisonSocial, type, tel, mail, archived } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { codeClient, raisonSocial, type, tel, mail, archived },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    res.json(updatedClient);
  } catch (err) {
    console.error("Erreur backend updateClient:", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du client", error: err.message });
  }
};

// Rechercher un client par raison sociale
exports.searchClient = async (req, res) => {
  try {
    const { raisonSocial } = req.query;

    if (!raisonSocial) {
      return res.status(400).json({ message: "Veuillez fournir une raison sociale" });
    }

    // 🔥 Utiliser find() au lieu de findOne()
    const clients = await Client.find({
      raisonSocial: { $regex: raisonSocial, $options: "i" },
    }).limit(10); // limite à 10 résultats max pour éviter de charger trop

    if (clients.length === 0) {
      return res.status(404).json({ message: "Aucun client trouvé" });
    }

    res.json(clients); // ✅ On renvoie un tableau de clients
  } catch (error) {
    console.error("Erreur lors de la recherche client:", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};




// Supprimer un client
exports.deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Client supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Archiver un client
exports.archiveClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, { archived: true }, { new: true });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Désarchiver un client
exports.unarchiveClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, { archived: false }, { new: true });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
