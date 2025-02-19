import React, { useEffect, useState } from "react";
import { FaUser, FaSearch } from "react-icons/fa";
import { getAllUsers } from "../../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createAxios } from "../../../createInstance";
// import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../../redux/authSlice";

const Customers = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers) || []; // Tránh lỗi undefined
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user?.accessToken) {
      getAllUsers(user?.accessToken, dispatch, axiosJWT);
    }
  }, [user, dispatch, navigate]); // Thêm dependencies để cập nhật khi user thay đổi

  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  // Nếu userList rỗng, không làm slice để tránh lỗi
  const totalPages =
    userList.length > 0 ? Math.ceil(userList.length / customersPerPage) : 1;
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = userList.slice(
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
            />
          </div>
        </div>

        {/* Customer Table */}
        {userList.length > 0 ? (
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
