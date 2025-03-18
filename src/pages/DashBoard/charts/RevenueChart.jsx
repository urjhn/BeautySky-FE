import React from "react";
import { Bar } from "react-chartjs-2";

const RevenueChart = ({ revenueGrowth }) => {
  const data = {
    labels: revenueGrowth.map((item) => item.month), // Lấy danh sách tháng
    datasets: [
      {
        label: "Doanh thu",
        data: revenueGrowth.map((item) => item.revenue), // Lấy doanh thu theo tháng
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4">
        📊 Doanh thu tăng trưởng
      </h3>
      <div className="h-[250px] sm:h-[300px] w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;
