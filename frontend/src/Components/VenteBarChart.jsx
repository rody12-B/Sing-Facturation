import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ventesData = [
  { produit: "Produit A", vente: 2200 },
  { produit: "Produit B", vente: 1900 },
  { produit: "Produit C", vente: 1800 },
  { produit: "Produit D", vente: 700 },
  { produit: "Produit E", vente: 1400 },
  { produit: "Produit F", vente: 900 },
  { produit: "Produit G", vente: 1600 },
  { produit: "Produit H", vente: 1700 },
];

const achatsData = [
  { charge: "Charge Fixe", achat: 800 },
  { charge: "Matières Premières", achat: 1500 },
  { charge: "Transport", achat: 500 },
  { charge: "Personnel", achat: 900 },
  { charge: "Achats consommés", achat: 800 },
  { charge: "Services exterieur", achat: 1500 },
  { charge: "Fiscale & sociale", achat: 500 },
  { charge: "Divers", achat: 900 },
  { charge: "Charge Fixe", achat: 800 },
  { charge: "Matières Premières", achat: 1500 },
  { charge: "Transport", achat: 500 },
  { charge: "Personnel", achat: 900 },
  { charge: "Achats consommés", achat: 800 },
  { charge: "Services exterieur", achat: 1500 },
  { charge: "Fiscale & sociale", achat: 500 },
  { charge: "Divers", achat: 900 },
  
];

// Composant générique pour les graphiques
const BarChartCard = ({ title, dataKey, labelKey, chartData, color, basePath }) => {
  const navigate = useNavigate();
  const total = chartData.reduce((sum, item) => sum + item[dataKey], 0);

  return (
    <div className="w-full bg-white shadow-lg rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <span className="text-lg font-semibold text-green-400">
          {total.toLocaleString()} FCFA
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={labelKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[6, 6, 0, 0]}
            barSize={25}
            cursor="pointer"
            onClick={(data) => {
              const item = data.payload; // barre cliquée
              navigate(`${basePath}/${encodeURIComponent(item[labelKey])}`);
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Dashboard principal
const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BarChartCard
        title="Ventes par Produits"
        chartData={ventesData}
        dataKey="vente"
        labelKey="produit"
        color="#55edc0"
        basePath="/produits"
      />
      <BarChartCard
        title="Achats & Charges"
        chartData={achatsData}
        dataKey="achat"
        labelKey="charge"
        color="#1c59d0"
        basePath="/charges"
      />
    </div>
  );
};

export default DashboardCharts;
