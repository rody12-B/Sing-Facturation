import React from "react";
import FinanceCard from "./FinanceCard";

const TresorieCard = ({ caisse, banque, linkCaisse, linkBanque }) => (
  <div className="bg-white shadow-md rounded-xl p-4">
    <h3 className="text-gray-400 font-semibold mb-2 text-sm text-center">Trésorerie</h3>
    <div className="grid grid-cols-2 gap-3">
      <FinanceCard title="Caisse" amount={caisse} color="text-blue-400" link={linkCaisse} />
      <FinanceCard title="Banque" amount={banque} color="text-blue-400" link={linkBanque} />
    </div>
  </div>
);

export default TresorieCard;
