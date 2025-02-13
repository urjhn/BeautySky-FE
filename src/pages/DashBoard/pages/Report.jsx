import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const CustomerReport = () => {
  const newCustomersData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Customers",
        data: [120, 150, 200, 180, 220, 250],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const returningCustomersData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Returning Customers",
        data: [60, 90, 130, 110, 140, 170],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  const customerCategoryData = {
    labels: ["VIP", "Regular", "New"],
    datasets: [
      {
        label: "Customer Categories",
        data: [30, 50, 20],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Customer Reports & Insights
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            New Customers Per Month
          </h2>
          <Bar data={newCustomersData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Returning Customers Trend
          </h2>
          <Line data={returningCustomersData} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mt-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Customer Categories
        </h2>
        <Pie data={customerCategoryData} />
      </div>
    </div>
  );
};

export default CustomerReport;
