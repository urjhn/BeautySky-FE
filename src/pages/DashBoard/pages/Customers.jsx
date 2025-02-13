import React from "react";
import { FaUser, FaSearch } from "react-icons/fa";

const Customers = () => {
  const customers = [
    { id: 1, name: "John Doe", email: "john@example.com", orders: 5 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", orders: 3 },
    { id: 3, name: "Alice Brown", email: "alice@example.com", orders: 7 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Customers</h1>
      <div className="bg-white p-4 rounded-lg shadow">
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

        <table className="w-full border-collapse bg-white shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t">
                <td className="p-3 flex items-center gap-2">
                  <FaUser className="text-blue-500" /> {customer.name}
                </td>
                <td className="p-3">{customer.email}</td>
                <td className="p-3">{customer.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
