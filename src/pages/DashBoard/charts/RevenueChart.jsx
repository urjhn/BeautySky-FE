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
  // Kiểm tra dữ liệu
  if (!revenueGrowth || revenueGrowth.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg text-center text-gray-600">
        📊 Không có dữ liệu doanh thu để hiển thị.
      </div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full"
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
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            📊 Phân tích doanh thu
          </h3>
          <p className="text-sm text-gray-500">
            Tổng doanh thu: {" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(revenueGrowth.reduce((sum, item) => sum + item.revenue, 0))}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-600">Doanh thu</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-600">Tăng trưởng</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={revenueGrowth}
            margin={{
              top: 10,
              right: 30,
              left: 10,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#374151", fontSize: '12px' }}
              stroke="#E5E7EB"
              angle={-45}
              textAnchor="end"
              height={60}
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#374151", fontSize: '12px' }}
              stroke="#E5E7EB"
              width={80}
              tickFormatter={(value) => 
                new Intl.NumberFormat("vi-VN", {
                  notation: "compact",
                  compactDisplay: "short",
                  maximumFractionDigits: 1,
                }).format(value)
              }
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#374151", fontSize: '12px' }}
              stroke="#E5E7EB"
              width={45}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend display={false} />

            {/* Bar chart cho doanh thu */}
            <Bar
              yAxisId="left"
              dataKey="revenue"
              name="revenue"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />

            {/* Line chart cho tăng trưởng */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="growth"
              name="growth"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        {revenueGrowth.length > 0 && (
          <>
            <div className="text-center">
              <p className="text-sm text-gray-500">Doanh thu cao nhất</p>
              <p className="text-lg font-semibold text-blue-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(Math.max(...revenueGrowth.map(item => item.revenue)))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Doanh thu thấp nhất</p>
              <p className="text-lg font-semibold text-red-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(Math.min(...revenueGrowth.map(item => item.revenue)))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Doanh thu trung bình</p>
              <p className="text-lg font-semibold text-purple-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(revenueGrowth.reduce((sum, item) => sum + item.revenue, 0) / revenueGrowth.length)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Tăng trưởng TB</p>
              <p className="text-lg font-semibold text-green-600">
                {(revenueGrowth.reduce((sum, item) => sum + (item.growth || 0), 0) / revenueGrowth.length).toFixed(1)}%
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
