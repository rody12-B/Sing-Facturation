import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import './index.css';
import { Toaster } from "react-hot-toast";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import Home from "./Components/Home";
import { AuthProvider } from "./context/AuthContext";
import Dash from "./pages/Auth/Dash";
import Facturation from "./pages/Auth/Facturation";
import Charge from "./pages/Auth/Charge";
import Dashboard from "./pages/Auth/Dashboard";
import Parametres from "./pages/Auth/Parametres";
import Tresorie from "./pages/Auth/Tresorie";
import Fact from "./pages/Auth/Fact";
import Devis from "./pages/Auth/Devis";
import DashboardLayout from "./Components/layout/DashboardLayout";
import FormFac from "./pages/Auth/FormFac";
import FactDetails from "./Components/FactDetails";
import EditFacture from "./Components/EditFacture";
import Preview from "./Components/Preview";
import Clients from "./pages/Clients/Clients"
import ClientForm from "./pages/Clients/ClientForm";
import ClientEditForm from "./pages/Clients/ClientEditForm";
import Config from "./pages/Produits/Config";
import ProduitForm from "./pages/Produits/ProduitForm";
import ProduitEditForm from "./pages/Produits/ProduitEditForm";
import CategorieForm from "./pages/Produits/CategorieForm";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dash" element={<Dash />} /> 
          <Route path="/preview" element={<Preview />} /> 
          

          {/* Routes protégées */}
          <Route element={<DashboardLayout />}>
            <Route path="/menu-dash" element={<Dashboard />} />

           

            {/* Facture & Devis */}
            <Route path="/menu-facture" element={<Facturation />}>
              <Route path="creer-facture" element={<Fact />} />
              <Route path="/menu-facture/creer-facture/facturation" element={<FormFac />} />
              <Route path="/menu-facture/creer-facture/details/:id" element={<FactDetails />} />
              <Route path="/menu-facture/creer-facture/edit/:id" element={<EditFacture />} />
              <Route path="faire-devis" element={<Devis />} />
              <Route path="produits-services" element={<Fact />} />
              <Route path="gestion-ventes" element={<Fact />} />
            </Route>

            {/* Gestion de Charges */}
            <Route path="/menu-charge" element={<Charge />}>
              <Route path="transports" element={<Fact />} />
              <Route path="achats-consommes" element={<Fact />} />
              <Route path="services-exterieurs" element={<Fact />} />
              <Route path="charges-personnel" element={<Fact />} />
              <Route path="charges-fiscale-sociale" element={<Fact />} />
              <Route path="charges-divers" element={<Fact />} />
            </Route>

            {/* Trésorerie */}
            <Route path="/menu-tresorie" element={<Tresorie />}>
              <Route path="generer-encaissement" element={<Fact />} />
              <Route path="generer-decaissement" element={<Fact />} />
              <Route path="gerer-compte-tresorie" element={<Fact />} />
            </Route>

            {/* Paramètres */}
            <Route path="/menu-parametres" element={<Parametres />}>
              <Route path="config-db" element={<Config />} />
              <Route path="/menu-parametres/config-db/creer-produit" element={<ProduitForm />} />
              <Route path="/menu-parametres/config-db/creer-categorie" element={< CategorieForm />} />
              <Route path="/menu-parametres/config-db/edit-produit/:id" element={<ProduitEditForm />} />
              <Route path="clients" element={<Clients />} />
              <Route path="/menu-parametres/clients/creer-client" element={<ClientForm />} />
              <Route path="/menu-parametres/clients/edit-client/:id" element={<ClientEditForm />} />
              <Route path="fiscaux" element={<Fact />} />
              <Route path="fournisseurs" element={<Fact />} />
            </Route>
          </Route>

          {/* Toutes les autres routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />  
    </AuthProvider>
  );
};

export default App;
