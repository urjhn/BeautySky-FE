import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaSearch,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useUsersContext } from "../../../context/UserContext";
import usersAPI from "../../../services/users";
import Swal from "sweetalert2";
import { useOrdersContext } from "../../../context/OrdersContext";

const Customers = () => {
  const { users, fetchUsers } = useUsersContext();
  const { orders, fetchOrders } = useOrdersContext();
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 9;
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate]);

  useEffect(() => {
    const filtered = users.filter((customer) => {
      const nameMatch = searchTerm
        .toLowerCase()
        .split("")
        .every((char) =>
          customer.fullName.toLowerCase().replace(/\s+/g, "").includes(char)
        );

      const customerDate = new Date(customer.dateCreate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const dateMatch =
        (!start || customerDate >= start) && (!end || customerDate <= end);

      return nameMatch && dateMatch;
    });

    setFilteredCustomers(filtered);
  }, [users, searchTerm, startDate, endDate]);

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const goToPage = (page) => setCurrentPage(page);

  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1:
        return { name: "User", color: "bg-blue-500" };
      case 2:
        return { name: "Staff", color: "bg-yellow-500" };
      case 3:
        return { name: "Manager", color: "bg-red-500" };
      default:
        return { name: "Unknown", color: "bg-gray-500" };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await usersAPI.deleteUser(userId);
          fetchUsers();
          Swal.fire("Đã xóa!", "Người dùng đã được xóa.", "success");
        } catch (error) {
          Swal.fire("Lỗi!", "Không thể xóa người dùng.", "error");
          console.error("Error deleting user:", error);
        }
      }
    });
  };

  const getOrderCount = (userId) => {
    return orders.filter((order) => order.userId === userId).length;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Khách hàng</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        {/* Search Bar + Date Filters */}
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          {/* Search Name */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm khách hàng..."
              className="pl-10 pr-4 py-2 border rounded-md w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Date Filters */}
          <div className="flex gap-3">
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="date"
                className="pl-10 pr-4 py-2 border rounded-md"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="date"
                className="pl-10 pr-4 py-2 border rounded-md"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
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
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Orders</th>
                  <th className="p-3 text-left">Trạng thái</th>
                  <th className="p-3 text-left">Ngày Tạo</th>
                  <th className="p-3 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentCustomers.map((customer) => {
                  const { name, color } = getRoleName(customer.roleId);
                  return (
                    <tr key={customer.id} className="border-t">
                      <td className="p-3 flex items-center gap-2">
                        <FaUser className="text-blue-500" /> {customer.fullName}
                      </td>
                      <td className="p-3">{customer.email}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${color}`}
                        >
                          {name}
                        </span>
                      </td>
                      <td className="p-3">{getOrderCount(customer.userId)}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${
                            customer.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {customer.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-3">{formatDate(customer.dateCreate)}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          className="text-blue-500"
                          onClick={() => handleEditUser(customer)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => handleDeleteUser(customer.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
