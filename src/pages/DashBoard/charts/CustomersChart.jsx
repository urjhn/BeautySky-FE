import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Import Chart.js và đăng ký scale
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";

// Đăng ký các thành phần bắt buộc
ChartJS.register(
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement,
  LineElement,
  ChartTooltip,
  ChartLegend
);

const CustomerChart = ({ customerGrowth }) => {
  // Kiểm tra dữ liệu trước khi render
  if (!customerGrowth || customerGrowth.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg text-center text-gray-600">
        📊 Không có dữ liệu khách hàng để hiển thị.
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4">
        📊 Customer Growth Trend
      </h3>
      <div className="h-[250px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={customerGrowth}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#374151", fontSize: '10px', fontWeight: 500 }}
              stroke="#E5E7EB"
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={60}
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              tick={{ fill: "#374151", fontSize: '10px' }}
              stroke="#E5E7EB"
              width={45}
            />
            
            {/* Tooltip tùy chỉnh */}
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value) => new Intl.NumberFormat().format(value)}
            />

            {/* Đường biểu đồ */}
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={{ r: 3, stroke: "#4CAF50", strokeWidth: 2, fill: "#fff" }}
              activeDot={{
                r: 6,
                stroke: "#2E7D32",
                strokeWidth: 2,
                fill: "#66BB6A",
              }}
            />

            {/* Chú thích */}
            <Legend 
              verticalAlign="top" 
              align="right"
              wrapperStyle={{
                fontSize: '12px',
                paddingBottom: '10px'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerChart;
