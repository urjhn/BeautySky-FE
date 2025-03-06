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

const ProductFeedback = () => {
  const positiveFeedbackData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
      {
        label: "Phản hồi tích cực",
        data: [80, 100, 120, 140, 160, 180],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const negativeFeedbackData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
      {
        label: "Phản hồi tiêu cực",
        data: [20, 30, 40, 35, 45, 50],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  const feedbackCategoryData = {
    labels: [
      "Tuyệt vời",
      "Hài lòng",
      "Bình thường",
      "Không hài lòng",
      "Rất tệ",
    ],
    datasets: [
      {
        label: "Mức độ phản hồi",
        data: [50, 30, 10, 5, 5],
        backgroundColor: [
          "#36A2EB",
          "#4BC0C0",
          "#FFCE56",
          "#FF9F40",
          "#FF6384",
        ],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Báo Cáo & Phân Tích Phản Hồi Khách Hàng
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Phản hồi tích cực theo tháng
          </h2>
          <Bar data={positiveFeedbackData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Phản hồi tiêu cực theo tháng
          </h2>
          <Line data={negativeFeedbackData} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mt-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Tỷ lệ mức độ phản hồi
        </h2>
        <Pie data={feedbackCategoryData} />
      </div>
    </div>
  );
};

export default ProductFeedback;
