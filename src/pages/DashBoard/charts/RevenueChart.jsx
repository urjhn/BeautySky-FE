import React from "react";
import { Bar } from "react-chartjs-2";

const RevenueChart = ({ revenueGrowth }) => {
  const data = {
    labels: revenueGrowth.map((item) => item.month), // Lấy danh sách tháng
    datasets: [
      {
        label: "Revenue",
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
    <div className="bg-white rounded-2xl shadow-lg hover:scale-105 transition
      h-[400px] md:h-[450px] lg:h-[500px]
      p-3 sm:p-4 md:p-6
      ">
      <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-4 text-gray-800">
        Revenue Growth
      </h3>
      <div className="h-[calc(100%-2rem)]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;
