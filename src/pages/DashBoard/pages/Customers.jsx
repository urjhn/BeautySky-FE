import React, { useState } from "react";
import { FaUser, FaSearch } from "react-icons/fa";

const Customers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");

  // Dữ liệu mẫu
  const userList = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "a@example.com",
      orders: 10,
      active: true,
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "b@example.com",
      orders: 5,
      active: false,
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "c@example.com",
      orders: 8,
      active: true,
    },
    {
      id: 4,
      name: "Phạm Minh D",
      email: "d@example.com",
      orders: 2,
      active: true,
    },
    {
      id: 5,
      name: "Hoàng Thị E",
      email: "e@example.com",
      orders: 15,
      active: false,
    },
    {
      id: 6,
      name: "Đinh Văn F",
      email: "f@example.com",
      orders: 7,
      active: true,
    },
  ];

  const filteredCustomers = userList.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Customer Table */}
        {filteredCustomers.length > 0 ? (
          <>
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
          </>
        ) : (
          <p className="text-center text-gray-500">Không có khách hàng nào.</p>
        )}
      </div>
    </div>
  );
};

export default Customers;
