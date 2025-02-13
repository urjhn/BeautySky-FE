import React from "react";
import { Bar } from "react-chartjs-2";

const RevenueChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [3000, 5000, 7000, 9000, 12000, 15000],
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Revenue Growth
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
