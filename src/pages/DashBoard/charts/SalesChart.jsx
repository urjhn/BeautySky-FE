import React from "react";
import { Line } from "react-chartjs-2";

const SalesChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [1200, 1900, 3000, 5000, 7000, 8500],
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: "#FF5733",
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
        Sales Overview
      </h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesChart;
