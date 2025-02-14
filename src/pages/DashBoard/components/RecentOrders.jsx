import React from "react";

const orders = [
  {
    id: "#1001",
    customer: "Alice Johnson",
    date: "2024-02-10",
    amount: "$120.00",
    status: "Completed",
  },
  {
    id: "#1002",
    customer: "Bob Smith",
    date: "2024-02-11",
    amount: "$75.50",
    status: "Pending",
  },
  {
    id: "#1003",
    customer: "Charlie Brown",
    date: "2024-02-12",
    amount: "$45.00",
    status: "Shipped",
  },
  {
    id: "#1004",
    customer: "David Wilson",
    date: "2024-02-13",
    amount: "$210.00",
    status: "Completed",
  },
];

const statusColors = {
  Completed: "bg-green-500",
  Pending: "bg-yellow-500",
  Shipped: "bg-blue-500",
};

const RecentOrders = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Recent Orders
      </h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Order ID</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Date</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{order.id}</td>
              <td className="p-3">{order.customer}</td>
              <td className="p-3">{order.date}</td>
              <td className="p-3">{order.amount}</td>
              <td className="p-3">
                <span
                  className={`text-white text-sm px-2 py-1 rounded ${
                    statusColors[order.status]
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
