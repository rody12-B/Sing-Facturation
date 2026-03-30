import React from "react";
import { Link } from "react-router-dom";

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

export default FinanceCard;
