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

const Customers = () => {
  const { users, fetchUsers } = useUsersContext();
  const { orders, setOrders } = useOrdersContext();
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

  useEffect(() => {
    fetchUsers();
    const fetchOrdersData = async () => {
      try {
        const data = await orderAPI.getAll();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrdersData();
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
    setEditingUser(user); // Đánh dấu đang chỉnh sửa user
    setNewUser({
      userName: user.userName || "",
      fullName: user.fullName || "",
      email: user.email || "",
      password: "", // Không hiển thị password cũ vì bảo mật
      confirmPassword: "", // Không hiển thị password cũ vì bảo mật
      phone: user.phone || "",
      address: user.address || "",
      roleId: user.roleId || 2,
    });
    setShowAddUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    console.log("Đang xóa người dùng với ID:", userId);

    if (!userId) {
      Swal.fire({
        title: "Lỗi!",
        text: "Không tìm thấy ID người dùng",
        icon: "error",
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
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        try {
          // Chi tiết hóa lỗi từ phản hồi
          const response = await usersAPI.deleteUser(userId);
          console.log("Phản hồi xóa người dùng:", response);

          await fetchUsers(); // Tải lại danh sách người dùng
          Swal.fire({
            title: "Đã xóa!",
            text: "Người dùng đã được xóa thành công.",
            icon: "success",
          });
        } catch (error) {
          // Chi tiết hóa thông báo lỗi
          console.error("Chi tiết lỗi:", error.response);

          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.title ||
            "Không thể xóa người dùng. Vui lòng thử lại sau.";

          Swal.fire({
            title: "Lỗi!",
            text: errorMessage,
            icon: "error",
            footer: `Mã lỗi: ${error.response?.status || "Không xác định"}`,
          });
        }
      }
    } catch (error) {
      console.error("Lỗi không mong muốn:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Đã xảy ra lỗi không mong muốn.",
        icon: "error",
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    if (!newUser.fullName || !newUser.email) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin.", "error");
      return;
    }

    try {
      // Chuẩn bị dữ liệu để gửi lên server
      const userPayload = {
        userName: newUser.userName,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        roleId: newUser.roleId,
      };

      // Chỉ gửi password nếu người dùng đã nhập
      if (newUser.password && newUser.password === newUser.confirmPassword) {
        userPayload.password = newUser.password;
      } else if (
        newUser.password &&
        newUser.password !== newUser.confirmPassword
      ) {
        Swal.fire("Lỗi", "Mật khẩu xác nhận không khớp.", "error");
        return;
      }

      // Thêm console.log ở đây để debug
      console.log("Editing user:", editingUser);
      console.log("User ID:", editingUser.id);
      console.log("Payload:", userPayload);

      // Chỉ gửi password nếu người dùng đã nhập
      if (newUser.password && newUser.password === newUser.confirmPassword) {
        userPayload.password = newUser.password;
      } else if (
        newUser.password &&
        newUser.password !== newUser.confirmPassword
      ) {
        Swal.fire("Lỗi", "Mật khẩu xác nhận không khớp.", "error");
        return;
      }
      // Thêm console.log ở đây để debug
      console.log("Editing user:", editingUser);
      console.log("User ID:", editingUser.id);
      console.log("Payload:", userPayload);

      const response = await usersAPI.editUser(editingUser.userId, userPayload);

      if (response.status >= 200 && response.status < 300) {
        Swal.fire(
          "Thành công!",
          "Thông tin thành viên đã được cập nhật.",
          "success"
        );
        fetchUsers();
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
    if (!orders || !Array.isArray(orders)) {
      return 0;
    }
    return orders.filter(
      (order) => order.userId === customerId && order.status > 0
    ).length;
  };

  const handleAddUser = async () => {
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin.", "error");
      return;
    }
    try {
      const response = await usersAPI.createUser(newUser);
      if (response.status >= 200 && response.status < 300) {
        Swal.fire("Thành công!", "Thành viên đã được thêm.", "success");
        fetchUsers();
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
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể thêm thành viên.", "error");
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Khách hàng</h1>
        <button
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600"
          onClick={() => setShowAddUserModal(true)}
        >
          {editingUser ? <FaEdit size={20} /> : <Plus size={20} />}
          {editingUser ? "Chỉnh sửa thành viên" : "Thêm thành viên"}
        </button>
      </div>

      <div className="bg-white p-2 sm:p-4 rounded-lg shadow">
        {/* Search và Filter */}
        <div className="flex flex-col gap-4 mb-4">
          {/* Search Name */}
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm khách hàng..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Date Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative w-full">
              <FaCalendarAlt className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="relative w-full">
              <FaCalendarAlt className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        {filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th scope="col" className="p-2 sm:p-3 text-left text-xs sm:text-sm">Tên</th>
                      <th scope="col" className="p-2 sm:p-3 text-left text-xs sm:text-sm hidden sm:table-cell">Email</th>
                      <th scope="col" className="p-2 sm:p-3 text-left text-xs sm:text-sm">Role</th>
                      <th scope="col" className="p-2 sm:p-3 text-left text-xs sm:text-sm hidden md:table-cell">Orders</th>
                      <th scope="col" className="p-2 sm:p-3 text-left text-xs sm:text-sm hidden sm:table-cell">Trạng thái</th>
                      <th scope="col" className="p-2 sm:p-3 text-left text-xs sm:text-sm hidden md:table-cell">Ngày Tạo</th>
                      <th scope="col" className="p-2 sm:p-3 text-left text-xs sm:text-sm">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentCustomers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="p-2 sm:p-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-blue-500" />
                            <span className="text-xs sm:text-sm">{customer.fullName}</span>
                          </div>
                        </td>
                        <td className="p-2 sm:p-3 whitespace-nowrap hidden sm:table-cell">
                          <span className="text-xs sm:text-sm">{customer.email}</span>
                        </td>
                        <td className="p-2 sm:p-3 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-white text-xs ${getRoleName(customer.roleId).color}`}>
                            {getRoleName(customer.roleId).name}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 whitespace-nowrap hidden md:table-cell">
                          <span className="text-xs sm:text-sm">{getOrderCount(customer.userId)}</span>
                        </td>
                        <td className="p-2 sm:p-3 whitespace-nowrap hidden sm:table-cell">
                          <span className={`px-2 py-1 rounded-full text-white text-xs ${customer.isActive ? "bg-green-500" : "bg-red-500"}`}>
                            {customer.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 whitespace-nowrap hidden md:table-cell">
                          <span className="text-xs sm:text-sm">{formatDate(customer.dateCreate)}</span>
                        </td>
                        <td className="p-2 sm:p-3 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button className="text-blue-500" onClick={() => handleEditUser(customer)}>
                              <FaEdit />
                            </button>
                            <button className="text-red-500" onClick={() => handleDeleteUser(customer.userId || customer.id)}>
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">Không có khách hàng nào.</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-1 sm:gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => goToPage(index + 1)}
              className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm border rounded-md ${
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
