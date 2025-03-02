// import React from "react";
// import { Bar } from "react-chartjs-2";

// const RevenueChart = ({ revenueGrowth }) => {
//   const data = {
//     labels: revenueGrowth.map((item) => item.month), // Lấy danh sách tháng
//     datasets: [
//       {
//         label: "Revenue",
//         data: revenueGrowth.map((item) => item.revenue), // Lấy doanh thu theo tháng
//         backgroundColor: "#36A2EB",
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: true,
//         position: "top",
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
//       <h3 className="text-lg font-semibold mb-4 text-gray-800">
//         Revenue Growth
//       </h3>
//       <Bar data={data} options={options} />
//     </div>
//   );
// };

// export default RevenueChart;

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const RevenueChart = () => {
  // Dữ liệu giả: Doanh thu theo từng tháng (VNĐ)
  const revenueGrowth = [
    { month: "Jan", revenue: 120000000 },
    { month: "Feb", revenue: 150000000 },
    { month: "Mar", revenue: 180000000 },
    { month: "Apr", revenue: 210000000 },
    { month: "May", revenue: 250000000 },
    { month: "Jun", revenue: 220000000 },
    { month: "Jul", revenue: 270000000 },
    { month: "Aug", revenue: 290000000 },
    { month: "Sep", revenue: 310000000 },
    { month: "Oct", revenue: 350000000 },
    { month: "Nov", revenue: 370000000 },
    { month: "Dec", revenue: 400000000 },
  ];

  const data = {
    labels: revenueGrowth.map((item) => item.month),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: revenueGrowth.map((item) => item.revenue),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.8)",
        hoverBorderColor: "rgba(75, 192, 192, 1)",
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
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw.toLocaleString()} ₫`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString()} ₫`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition transform duration-300">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Tăng trưởng doanh thu
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
