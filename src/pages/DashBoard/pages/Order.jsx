import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const allOrders = [
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
  {
    id: "ORD004",
    customer: "David Brown",
    amount: "$140.00",
    date: "2025-02-13",
    status: "Completed",
  },
  {
    id: "ORD005",
    customer: "Emma Wilson",
    amount: "$60.00",
    date: "2025-02-14",
    status: "Pending",
  },
  {
    id: "ORD006",
    customer: "Michael Green",
    amount: "$110.00",
    date: "2025-02-15",
    status: "Completed",
  },
  {
    id: "ORD007",
    customer: "Sophia White",
    amount: "$80.00",
    date: "2025-02-16",
    status: "Cancelled",
  },
  {
    id: "ORD008",
    customer: "Daniel Black",
    amount: "$200.00",
    date: "2025-02-17",
    status: "Pending",
  },
  {
    id: "ORD009",
    customer: "Olivia Adams",
    amount: "$50.00",
    date: "2025-02-18",
    status: "Completed",
  },
  {
    id: "ORD010",
    customer: "Chris Miller",
    amount: "$130.00",
    date: "2025-02-19",
    status: "Pending",
  },
  {
    id: "ORD011",
    customer: "Ava Brown",
    amount: "$95.00",
    date: "2025-02-20",
    status: "Completed",
  },
  {
    id: "ORD012",
    customer: "Liam Davis",
    amount: "$170.00",
    date: "2025-02-21",
    status: "Cancelled",
  },
  {
    id: "ORD013",
    customer: "Noah Carter",
    amount: "$45.00",
    date: "2025-02-22",
    status: "Completed",
  },
  {
    id: "ORD014",
    customer: "Ethan Moore",
    amount: "$120.00",
    date: "2025-02-23",
    status: "Pending",
  },
  {
    id: "ORD015",
    customer: "Isabella Wright",
    amount: "$90.00",
    date: "2025-02-24",
    status: "Cancelled",
  },
  {
    id: "ORD016",
    customer: "Mason Clark",
    amount: "$75.00",
    date: "2025-02-25",
    status: "Completed",
  },
  {
    id: "ORD017",
    customer: "Sophia Scott",
    amount: "$85.00",
    date: "2025-02-26",
    status: "Pending",
  },
  {
    id: "ORD018",
    customer: "James White",
    amount: "$150.00",
    date: "2025-02-27",
    status: "Completed",
  },
  {
    id: "ORD019",
    customer: "Charlotte Hall",
    amount: "$55.00",
    date: "2025-02-28",
    status: "Cancelled",
  },
  {
    id: "ORD020",
    customer: "Benjamin Lewis",
    amount: "$180.00",
    date: "2025-03-01",
    status: "Completed",
  },
];

const Order = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Tính toán danh sách đơn hàng hiển thị trên trang hiện tại
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = allOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Tổng số trang
  const totalPages = Math.ceil(allOrders.length / ordersPerPage);

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
            {currentOrders.map((order) => (
              <tr key={order.id} className="border-t">
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
                    <FaClock className="text-yellow-500 mr-2" />
                  )}
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Box */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 border rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Order;
