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
import { Plus } from "lucide-react";
import orderAPI from "../../../services/order";
import { useAuth } from "../../../context/AuthContext";

const Customers = () => {
  const { users, fetchUsers, updateUser } = useUsersContext();
  const { orders, setOrders } = useOrdersContext();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 9;
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    roleId: 2, // Mặc định là Staff
  });

  // Sửa lại cách kiểm tra Manager
  const isManager = user?.roleId === 3 || user?.role === "Manager";

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUsers();
        const ordersData = await orderAPI.getAll();
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
        return { name: "Customer", color: "bg-blue-500" };
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

  const handleEditUser = (userToEdit) => {
    if (!isManager) {
      Swal.fire({
        title: "Không có quyền!",
        text: "Chỉ Manager mới có quyền chỉnh sửa thông tin thành viên",
        icon: "error"
      });
      return;
    }
    setEditingUser(userToEdit);
    setNewUser({
      userName: userToEdit.userName || "",
      fullName: userToEdit.fullName || "",
      email: userToEdit.email || "",
      password: "",
      confirmPassword: "",
      phone: userToEdit.phone || "",
      address: userToEdit.address || "",
      roleId: userToEdit.roleId || 2,
    });
    setShowAddUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!isManager) {
      Swal.fire({
        title: "Không có quyền!",
        text: "Chỉ Manager mới có quyền xóa thành viên",
        icon: "error"
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy"
      });

      if (result.isConfirmed) {
        await usersAPI.deleteUser(userId);
        await fetchUsers();
        Swal.fire("Thành công!", "Đã xóa thành viên.", "success");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Lỗi!", "Không thể xóa thành viên.", "error");
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    if (!isManager) {
      Swal.fire({
        title: "Không có quyền!",
        text: "Chỉ Manager mới có quyền cập nhật thông tin thành viên",
        icon: "error"
      });
      return;
    }

    if (!newUser.fullName || !newUser.email) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin.", "error");
      return;
    }

    try {
      const userPayload = {
        userName: newUser.userName,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        roleId: parseInt(newUser.roleId),
      };

      if (newUser.password && newUser.password === newUser.confirmPassword) {
        userPayload.password = newUser.password;
      } else if (
        newUser.password &&
        newUser.password !== newUser.confirmPassword
      ) {
        Swal.fire("Lỗi", "Mật khẩu xác nhận không khớp.", "error");
        return;
      }

      const result = await updateUser(editingUser.userId, userPayload);

      if (result && result.success) {
        Swal.fire(
          "Thành công!",
          "Thông tin thành viên đã được cập nhật.",
          "success"
        );
        setShowAddUserModal(false);
        setEditingUser(null);
        setNewUser({
          userName: "",
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: "",
          roleId: 2,
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể cập nhật thông tin thành viên.", "error");
      console.error("Error updating user:", error);
    }
  };

  const getOrderCount = (customerId) => {
    if (!orders || !Array.isArray(orders)) return 0;

    return orders.filter(
      (order) =>
        (order.userId === customerId || order.user?.userId === customerId) &&
        order.status !== "Cancelled"
    ).length;
  };

  const roleOptions = isManager
    ? [
        { value: 1, label: "Customer" },
        { value: 2, label: "Staff" },
        { value: 3, label: "Manager" },
      ]
    : [
        { value: 1, label: "Customer" },
        { value: 2, label: "Staff" },
      ];

  const handleAddUser = async () => {
    if (!isManager) {
      Swal.fire({
        title: "Không có quyền!",
        text: "Chỉ Manager mới có quyền thêm thành viên",
        icon: "error"
      });
      return;
    }

    if (!newUser.fullName || !newUser.email || !newUser.password) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin.", "error");
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      Swal.fire("Lỗi", "Mật khẩu và xác nhận mật khẩu không khớp.", "error");
      return;
    }

    try {
      const userPayload = {
        userName: newUser.userName,
        fullName: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
        confirmPassword: newUser.confirmPassword,
        phone: newUser.phone || "",
        address: newUser.address || "",
        roleId: parseInt(newUser.roleId),
        isActive: true,
      };

      const response = await usersAPI.createUser(userPayload);

      if (response && response.status >= 200 && response.status < 300) {
        Swal.fire("Thành công!", "Thành viên đã được thêm.", "success");
        await fetchUsers();
        setShowAddUserModal(false);
        setNewUser({
          userName: "",
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: "",
          roleId: 2,
        });
      } else {
        throw new Error(response?.data?.message || "Không thể thêm thành viên");
      }
    } catch (error) {
      console.error("Chi tiết lỗi:", error.response || error);
      const errorMessage =
        error.response?.data ||
        error.message ||
        "Không thể thêm thành viên. Vui lòng kiểm tra thông tin và thử lại.";

      Swal.fire(
        "Lỗi!",
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage),
        "error"
      );
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            <FaUser className="text-white text-xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Quản lý Khách hàng
          </h1>
        </div>
        {isManager && (
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            onClick={() => setShowAddUserModal(true)}
          >
            <Plus size={20} />
            Thêm thành viên
          </button>
        )}
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
        {/* Search và Filter */}
        <div className="flex flex-col gap-5 mb-6">
          <div className="relative w-full">
            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="relative w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Từ ngày
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="relative w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Đến ngày
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg shadow-md text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">Tổng khách hàng</p>
                <p className="text-2xl font-bold">{filteredCustomers.length}</p>
              </div>
              <FaUser className="text-3xl opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg shadow-md text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">Khách hàng hoạt động</p>
                <p className="text-2xl font-bold">
                  {filteredCustomers.filter((c) => c.isActive).length}
                </p>
              </div>
              <FaUser className="text-3xl opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg shadow-md text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">Tổng đơn hàng</p>
                <p className="text-2xl font-bold">
                  {orders?.filter(order => 
                    order.status === "Pending" || 
                    order.status === "Completed"
                  ).length || 0}
                </p>
              </div>
              <FaCalendarAlt className="text-3xl opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-lg shadow-md text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">Khách mới (30 ngày)</p>
                <p className="text-2xl font-bold">
                  {
                    filteredCustomers.filter((c) => {
                      const date = new Date(c.dateCreate);
                      const thirtyDaysAgo = new Date();
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                      return date >= thirtyDaysAgo;
                    }).length
                  }
                </p>
              </div>
              <FaUser className="text-3xl opacity-80" />
            </div>
          </div>
        </div>

        {/* Table Container */}
        {filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto -mx-2 sm:mx-0 rounded-lg border border-gray-200">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Tên
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                        Email
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">
                        Đơn hàng
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                        Trạng thái
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">
                        Ngày Tạo
                      </th>
                      {isManager && (
                        <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Hành động
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentCustomers.map((customer) => {
                      const orderCount = getOrderCount(customer.userId);

                      return (
                        <tr
                          key={customer.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="p-3 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <FaUser className="text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {customer.fullName}
                                </div>
                                <div className="text-xs text-gray-500 sm:hidden">
                                  {customer.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap hidden sm:table-cell">
                            <span className="text-sm text-gray-600">
                              {customer.email}
                            </span>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                getRoleName(customer.roleId).color
                              } text-white shadow-sm`}
                            >
                              {getRoleName(customer.roleId).name}
                            </span>
                          </td>
                          <td className="p-3 whitespace-nowrap hidden md:table-cell">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {orderCount}
                              </span>
                              <span className="text-xs text-gray-500">
                                đơn hàng
                              </span>
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap hidden sm:table-cell">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                customer.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {customer.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="p-3 whitespace-nowrap hidden md:table-cell">
                            <span className="text-sm text-gray-600">
                              {formatDate(customer.dateCreate)}
                            </span>
                          </td>
                          {isManager && (
                            <td className="p-3 whitespace-nowrap">
                              <div className="flex gap-3">
                                <button
                                  className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-100 rounded-full"
                                  onClick={() => handleEditUser(customer)}
                                >
                                  <FaEdit size={18} />
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-100 rounded-full"
                                  onClick={() => handleDeleteUser(customer.userId)}
                                >
                                  <FaTrash size={18} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
            <FaUser className="mx-auto text-gray-300 text-5xl mb-3" />
            <p className="text-gray-500 text-lg">
              Không tìm thấy khách hàng nào.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Thử thay đổi bộ lọc tìm kiếm của bạn.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-center mt-6">
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                &laquo; Trước
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => goToPage(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    currentPage === index + 1
                      ? "z-10 bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  } text-sm font-medium transition-colors duration-150`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  currentPage < totalPages && goToPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Tiếp &raquo;
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingUser ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => {
                    setShowAddUserModal(false);
                    setEditingUser(null);
                    setNewUser({
                      userName: "",
                      fullName: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      phone: "",
                      address: "",
                      roleId: 2,
                    });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newUser.userName}
                    onChange={(e) =>
                      setNewUser({ ...newUser, userName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newUser.fullName}
                    onChange={(e) =>
                      setNewUser({ ...newUser, fullName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    placeholder={
                      editingUser ? "Để trống nếu không thay đổi" : ""
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newUser.confirmPassword}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder={
                      editingUser ? "Để trống nếu không thay đổi" : ""
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Vai trò
                  </label>
                  <select
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newUser.roleId}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        roleId: parseInt(e.target.value),
                      })
                    }
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newUser.address}
                    onChange={(e) =>
                      setNewUser({ ...newUser, address: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
                  onClick={() => {
                    setShowAddUserModal(false);
                    setEditingUser(null);
                    setNewUser({
                      userName: "",
                      fullName: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      phone: "",
                      address: "",
                      roleId: 2,
                    });
                  }}
                >
                  Hủy
                </button>

                <button
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  onClick={editingUser ? handleUpdateUser : handleAddUser}
                >
                  {editingUser ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;