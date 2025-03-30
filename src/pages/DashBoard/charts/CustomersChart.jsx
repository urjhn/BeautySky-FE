import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomersChart = ({ customerGrowth }) => {
  if (!customerGrowth || customerGrowth.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-center text-gray-600">
        📊 Không có dữ liệu khách hàng để hiển thị.
      </div>
    );
  }

  // Custom tooltip đơn giản hóa
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2.5 border border-gray-200 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-600 mb-1.5">{label}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-gray-600">Khách mới:</span>
            <span className="font-medium text-gray-900">
              {payload[0].value.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      {/* Header đơn giản hóa */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-800">
          📊 Phân tích khách hàng mới
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-gray-600">Khách mới</span>
        </div>
      </div>

      {/* Biểu đồ tối ưu */}
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={customerGrowth}
            margin={{
              top: 5,
              right: 20,
              left: 5,
              bottom: 25,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#374151", fontSize: '11px' }}
              stroke="#E5E7EB"
              angle={-45}
              textAnchor="end"
              height={40}
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tick={{ fill: "#374151", fontSize: '11px' }}
              stroke="#E5E7EB"
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Chỉ giữ lại đường khách hàng mới */}
            <Line
              type="monotone"
              dataKey="newCustomers"
              name="Khách mới"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Thống kê đơn giản */}
      <div className="mt-4 bg-blue-50 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600 mb-1">Khách hàng mới</p>
        <p className="text-xl font-semibold text-blue-600">
          {customerGrowth[customerGrowth.length - 1].newCustomers}
        </p>
        <p className="text-xs text-blue-500 mt-1">Tháng này</p>
      </div>
    </div>
  );
};

export default CustomersChart;