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
  Area,
  ComposedChart
} from "recharts";

const CustomersChart = ({ customerGrowth }) => {
  // Kiểm tra dữ liệu
  if (!customerGrowth || customerGrowth.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-center text-gray-600">
        📊 Không có dữ liệu khách hàng để hiển thị.
      </div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium text-gray-900">
                {entry.name.includes("Rate") 
                  ? `${entry.value}%`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-800">
          📊 Phân tích khách hàng
        </h3>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-gray-600">Khách mới</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-gray-600">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-gray-600">Tổng</span>
          </div>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={customerGrowth}
            margin={{
              top: 10,
              right: 25,
              left: 0,
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
              height={50}
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#374151", fontSize: '11px' }}
              stroke="#E5E7EB"
              width={40}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#374151", fontSize: '11px' }}
              stroke="#E5E7EB"
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend display={false} />

            {/* Đường biểu đồ khách hàng mới */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="newCustomers"
              name="Khách mới"
              stroke="#3B82F6"
              strokeWidth={1.5}
              dot={{ r: 3, strokeWidth: 1.5 }}
              activeDot={{ r: 5, strokeWidth: 1.5 }}
            />

            {/* Đường biểu đồ khách hàng active */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="activeCustomers"
              name="Khách active"
              stroke="#10B981"
              strokeWidth={1.5}
              dot={{ r: 3, strokeWidth: 1.5 }}
              activeDot={{ r: 5, strokeWidth: 1.5 }}
            />

            {/* Area chart cho tổng số khách hàng */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="totalCustomers"
              name="Tổng khách hàng"
              fill="#A855F7"
              fillOpacity={0.1}
              stroke="#A855F7"
              strokeWidth={1.5}
              dot={{ r: 3, strokeWidth: 1.5 }}
              activeDot={{ r: 5, strokeWidth: 1.5 }}
            />

            {/* Đường biểu đồ tỷ lệ giữ chân */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="retentionRate"
              name="Tỷ lệ giữ chân"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-4 gap-3 mt-4 bg-gray-50 p-3 rounded-lg">
        {customerGrowth.length > 0 && (
          <>
            <div className="text-center px-2">
              <p className="text-sm text-gray-500 mb-1">Khách mới</p>
              <p className="text-base font-semibold text-blue-600">
                {customerGrowth[customerGrowth.length - 1].newCustomers}
              </p>
            </div>
            <div className="text-center px-2">
              <p className="text-sm text-gray-500 mb-1">Đang active</p>
              <p className="text-base font-semibold text-green-600">
                {customerGrowth[customerGrowth.length - 1].activeCustomers}
              </p>
            </div>
            <div className="text-center px-2">
              <p className="text-sm text-gray-500 mb-1">Tổng khách</p>
              <p className="text-base font-semibold text-purple-600">
                {customerGrowth[customerGrowth.length - 1].totalCustomers}
              </p>
            </div>
            <div className="text-center px-2">
              <p className="text-sm text-gray-500 mb-1">Tỷ lệ giữ chân</p>
              <p className="text-base font-semibold text-yellow-600">
                {customerGrowth[customerGrowth.length - 1].retentionRate}%
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomersChart;