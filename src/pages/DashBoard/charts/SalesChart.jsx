import React from "react";
import { Line } from "react-chartjs-2";

const SalesChart = ({ salesData, leadData }) => {
  // Kết hợp dữ liệu đơn hàng & khách hàng tiềm năng theo tháng
  const labels = salesData.map((sale) => sale.month);
  const salesValues = salesData.map((sale) => sale.sales);
  const leadsValues = labels.map((month) => {
    const leadEntry = leadData.find((lead) => lead.month === month);
    return leadEntry ? leadEntry.leads : 0;
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Sales",
        data: salesValues,
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: "#FF5733",
      },
      {
        label: "Leads",
        data: leadsValues,
        borderColor: "#82ca9d",
        backgroundColor: "rgba(130, 202, 157, 0.2)",
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: "#82ca9d",
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
        labels: {
          font: {
            size: function(context) {
              let width = context.chart.width;
              if (width < 768) return 10;
              if (width < 1024) return 12;
              return 14;
            }
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: function(context) {
              let width = context.chart.width;
              if (width < 768) return 10;
              if (width < 1024) return 12;
              return 14;
            }
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: function(context) {
              let width = context.chart.width;
              if (width < 768) return 10;
              if (width < 1024) return 12;
              return 14;
            }
          }
        }
      }
    },
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg hover:scale-105 transition">
      <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-4 text-gray-800">
        Sales & Leads Overview
      </h3>
      <div className="h-[300px] md:h-[400px] lg:h-[450px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SalesChart;
