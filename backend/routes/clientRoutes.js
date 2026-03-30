    const express = require("express");
    const router = express.Router();
    const clientController = require("../controllers/clientController");
    const { protect } = require("../middleware/authMiddleware");

    
    router.get("/get-all", clientController.getAllClients);
    router.post("/create",  clientController.createClient);
    router.get("/search", clientController.searchClient);
    router.get("/:id", clientController.getClientById);
    router.patch("/update/:id",  clientController.updateClient);
    router.delete("/delete/:id",  clientController.deleteClient);
    router.patch("/archive/:id",  clientController.archiveClient);
    router.patch("/unarchive/:id",  clientController.unarchiveClient);
    

    module.exports = router;


 