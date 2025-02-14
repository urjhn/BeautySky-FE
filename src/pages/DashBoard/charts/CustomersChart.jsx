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

const data = [
  { month: "Jan", customers: 120 },
  { month: "Feb", customers: 180 },
  { month: "Mar", customers: 250 },
  { month: "Apr", customers: 300 },
  { month: "May", customers: 400 },
  { month: "Jun", customers: 450 },
  { month: "Jul", customers: 500 },
];

const CustomerChart = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Customer Growth
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="customers"
            stroke="#4F46E5"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerChart;
