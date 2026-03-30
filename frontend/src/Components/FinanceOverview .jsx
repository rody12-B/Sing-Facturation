import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Composant pour afficher ou éditer une carte de donnée
const FinanceCard = ({ title, amount, color, link }) => (
  <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center justify-center">
    <h3 className="text-gray-400 font-semibold mb-1 text-sm">{title}</h3>
    <Link
      to={link}
      className={`text-lg font-bold ${color} cursor-pointer hover:underline`}
    >
      {amount.toLocaleString()} FCFA
    </Link>
  </div>
);

const FinanceCharge = ({ title, amount, color, link }) => (
  <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center justify-center">
    <h3 className="text-gray-400 font-semibold mb-1 text-sm">{title}</h3>
    <Link
      to={link}
      className={`text-lg font-bold ${color} cursor-pointer hover:underline`}
    >
      {amount.toLocaleString()} FCFA
    </Link>
  </div>
);

const TresorerieCard = ({ caisse, banque, linkCaisse, linkBanque }) => (
  <div className="bg-white shadow-md rounded-xl p-4">
    <h3 className="text-gray-400 font-semibold mb-2 text-sm text-center">
      Trésorerie
    </h3>
    <div className="grid grid-cols-2 gap-3">
      <FinanceCard
        title="Caisse"
        amount={caisse}
        color="text-blue-400"
        link={linkCaisse}
      />
      <FinanceCard
        title="Banque"
        amount={banque}
        color="text-blue-400"
        link={linkBanque}
      />
    </div>
  </div>
);

const FinanceOverview = () => {
  const [data, setData] = useState({
    chiffreAffaires: 0,
    gesttionsCharges: 0,
    caisse: 0,
    banque: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const res = await axios.get("http://localhost:8081/api/invoice/chiffre-affaires", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setData((prev) => ({
          ...prev,
          chiffreAffaires: res.data.totalPayé || 0, 
        }));
      } catch (err) {
        console.error("Erreur récupération CA:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFinanceData();
  }, []);
  

  if (loading) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <FinanceCard
        title="Chiffre d'Affaire"
        amount={data.chiffreAffaires}
        color="text-green-400"
        link="/menu-facture/creer-facture"
      />
      <FinanceCharge
        title="Gestion des charges"
        amount={data.gesttionsCharges}
        color="text-green-400"
        link="/gestion-charge"
      />
      <TresorerieCard
        caisse={data.caisse}
        banque={data.banque}
        linkCaisse="/caisse"
        linkBanque="/banque"
      />
    </div>
  );
};

export default FinanceOverview;
