import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const orders = [
  {
    id: "ORD001",
    customer: "John Doe",
    amount: "$120.00",
    date: "2025-02-10",
    status: "Completed",
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    amount: "$75.50",
    date: "2025-02-11",
    status: "Pending",
  },
  {
    id: "ORD003",
    customer: "Alice Johnson",
    amount: "$95.00",
    date: "2025-02-12",
    status: "Cancelled",
  },
];

const Order = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">{order.amount}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3 flex items-center">
                  {order.status === "Completed" ? (
                    <FaCheckCircle className="text-green-500 mr-2" />
                  ) : order.status === "Cancelled" ? (
                    <FaTimesCircle className="text-red-500 mr-2" />
                  ) : (
                    <span className="text-yellow-500">Pending</span>
                  )}
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
