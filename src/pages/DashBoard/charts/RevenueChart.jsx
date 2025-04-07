import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const RevenueChart = ({ revenueGrowth }) => {
  if (!revenueGrowth || revenueGrowth.length === 0) {
    return (
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow text-center text-gray-600 text-sm">
        📊 Không có dữ liệu doanh thu để hiển thị.
      </div>
    );
  }

  // Custom tooltip responsive
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow text-xs sm:text-sm">
          <p className="font-medium text-gray-600 mb-1.5">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-1.5 sm:gap-2">
              <span
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">
                {entry.name === "revenue" ? "Doanh thu:" : "Tăng trưởng:"}
              </span>
              <span className="font-medium text-gray-900">
                {entry.name === "revenue"
                  ? new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(entry.value)
                  : `${entry.value.toFixed(1)}%`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
      {/* Header responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
            📊 Phân tích doanh thu
      </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Tổng doanh thu: {" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              notation: "compact",
              compactDisplay: "short",
            }).format(revenueGrowth.reduce((sum, item) => sum + item.revenue, 0))}
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500" />
            <span className="text-gray-600">Doanh thu</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
            <span className="text-gray-600">Tăng trưởng</span>
          </div>
        </div>
      </div>

      {/* Biểu đồ responsive */}
      <div className="h-[200px] sm:h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={revenueGrowth}
            margin={{
              top: 5,
              right: 15,
              left: 5,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#374151", fontSize: '10px' }}
              stroke="#E5E7EB"
              angle={-45}
              textAnchor="end"
              height={40}
              scale="point"
              padding={{ left: 5, right: 5 }}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#374151", fontSize: '10px' }}
              stroke="#E5E7EB"
              width={45}
              tickFormatter={(value) => 
                new Intl.NumberFormat("vi-VN", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#374151", fontSize: '10px' }}
              stroke="#E5E7EB"
              width={35}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Bar chart responsive */}
            <Bar
              yAxisId="left"
              dataKey="revenue"
              name="revenue"
              fill="#3B82F6"
              radius={[3, 3, 0, 0]}
              barSize={20}
            />

            {/* Line chart responsive */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="growth"
              name="growth"
              stroke="#10B981"
              strokeWidth={1.5}
              dot={{ r: 2, strokeWidth: 1.5 }}
              activeDot={{ r: 4, strokeWidth: 1.5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Thống kê responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3 sm:mt-4">
        <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Doanh thu cao nhất</p>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-blue-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              notation: "compact",
              compactDisplay: "short",
            }).format(Math.max(...revenueGrowth.map(item => item.revenue)))}
          </p>
        </div>
        <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Doannh thu thấp nhất</p>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-red-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              notation: "compact",
              compactDisplay: "short",
            }).format(Math.min(...revenueGrowth.map(item => item.revenue)))}
          </p>
        </div>
        <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Doanh thu TB</p>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-purple-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              notation: "compact",
              compactDisplay: "short",
            }).format(revenueGrowth.reduce((sum, item) => sum + item.revenue, 0) / revenueGrowth.length)}
          </p>
        </div>
        <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Tăng trưởng TB</p>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-green-600">
            {(revenueGrowth.reduce((sum, item) => sum + (item.growth || 0), 0) / revenueGrowth.length).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
