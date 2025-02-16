import React, { useState } from "react";
import { FaUser, FaSearch } from "react-icons/fa";

const Customers = () => {
  const allCustomers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      orders: 5,
      active: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      orders: 3,
      active: false,
    },
    {
      id: 3,
      name: "Alice Brown",
      email: "alice@example.com",
      orders: 7,
      active: true,
    },
    {
      id: 4,
      name: "David Johnson",
      email: "david@example.com",
      orders: 2,
      active: true,
    },
    {
      id: 5,
      name: "Emily Davis",
      email: "emily@example.com",
      orders: 6,
      active: false,
    },
    {
      id: 6,
      name: "Michael Wilson",
      email: "michael@example.com",
      orders: 4,
      active: true,
    },
    {
      id: 7,
      name: "Sarah Taylor",
      email: "sarah@example.com",
      orders: 8,
      active: false,
    },
    {
      id: 8,
      name: "Chris Martinez",
      email: "chris@example.com",
      orders: 1,
      active: true,
    },
    {
      id: 9,
      name: "Jessica White",
      email: "jessica@example.com",
      orders: 3,
      active: false,
    },
    {
      id: 10,
      name: "Daniel Harris",
      email: "daniel@example.com",
      orders: 9,
      active: true,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  // Tính toán chỉ số khách hàng hiển thị
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = allCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  // Tổng số trang
  const totalPages = Math.ceil(allCustomers.length / customersPerPage);

  // Chuyển trang khi click vào số
  const goToPage = (page) => setCurrentPage(page);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Khách hàng</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        {/* Search bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 border rounded-md w-80"
            />
          </div>
        </div>

        {/* Customer Table */}
        <table className="w-full border-collapse bg-white shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Orders</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.id} className="border-t">
                <td className="p-3 flex items-center gap-2">
                  <FaUser className="text-blue-500" /> {customer.name}
                </td>
                <td className="p-3">{customer.email}</td>
                <td className="p-3">{customer.orders}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      customer.active ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {customer.active ? "Active" : "Inactive"}
                  </span>
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
              onClick={() => goToPage(index + 1)}
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

export default Customers;
