require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path =  require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const clientRoutes = require("./routes/clientRoutes");
const categorieRoutes = require("./routes/categorieRoutes")
const productRoutes = require("./routes/productRoutes");

const app = express();


//middleware pour manipuler les cors

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-type", "Authorization"],
        credentials: true,
    })
);

// creation de la session   
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,        //  empêche l’accès JS au cookie
      secure: false,         //  mettre true si HTTPS (ex: en prod)
      sameSite: "lax",       //  empêche les CSRF de base
      maxAge: 1000 * 60 * 60 * 24 // 24h
    }
  }));
  


//connexion a la base de donnee
connectDB();

//middleware(intergiciel)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


//routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/categorie", categorieRoutes);
app.use("/api/produit", productRoutes);




//enregistrement des fichier 
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));
    
//lancement du server
const PORT = process.env.PORT || 5000 ;
app.listen(PORT, () => console.log (`Le serveur est lancé sur le port: ${PORT}` ));
