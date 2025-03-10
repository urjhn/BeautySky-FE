import { useState } from "react";
import { motion } from "framer-motion";
import { EyeIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [selectedTab, setSelectedTab] = useState("Đã giao hàng");

  const orders = [
    {
      orderId: "#ORD20240227",
      date: "27/02/2024",
      status: "Đang giao hàng",
      total: 250000,
      items: ["Kem dưỡng da", "Toner cấp ẩm"],
      payment: "VNPAY",
      trackingId: "VN123456789",
    },
    {
      orderId: "#ORD20240226",
      date: "26/02/2024",
      status: "Đã giao hàng",
      total: 500000,
      items: ["Sữa rửa mặt", "Serum vitamin C", "Mặt nạ ngủ"],
      payment: "Thẻ tín dụng",
      trackingId: "VN987654321",
    },
    {
      orderId: "#ORD20240225",
      date: "25/02/2024",
      status: "Đã hủy",
      total: 150000,
      items: ["Kem chống nắng"],
      payment: "Thẻ tín dụng",
      trackingId: "Không có",
    },
    {
      orderId: "#ORD20240220",
      date: "20/02/2024",
      status: "Đã giao hàng",
      total: 300000,
      items: ["Bộ dưỡng da mini", "Tẩy tế bào chết"],
      payment: "MoMo",
      trackingId: "VN456789123",
    },
  ];

  const filteredOrders = orders.filter((order) => order.status === selectedTab);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8 md:p-6 sm:p-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6 sm:text-2xl">
          🛒 Lịch sử đơn hàng
        </h1>

        <div className="flex flex-wrap justify-center gap-4 mb-6 sm:gap-2">
          {["Đã giao hàng", "Đang giao hàng", "Đã hủy"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition sm:px-3 sm:py-1.5 sm:text-sm ${
                selectedTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="md:hidden">
          {paginatedOrders.map((order, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="mb-4 p-4 border rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{order.orderId}</span>
                <span className="text-sm">{order.date}</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Sản phẩm:</span> {order.items.join(", ")}</p>
                <p className="flex items-center text-sm">
                  <CreditCardIcon className="w-4 h-4 text-indigo-500 mr-2" />
                  <span className="font-medium">Thanh toán:</span> {order.payment}
                </p>
                <p className="text-sm"><span className="font-medium">Mã vận chuyển:</span> {order.trackingId}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-semibold">{formatCurrency(order.total)}</span>
                  <button
                    onClick={() => navigate(`/orderdetail/${order.orderId.replace("#", "")}`)}
                    className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg shadow hover:bg-blue-600 transition flex items-center"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" /> Xem
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 text-left">Mã đơn hàng</th>
                <th className="p-3 text-left">Ngày đặt</th>
                <th className="p-3 text-left">Sản phẩm</th>
                <th className="p-3 text-left">Thanh toán</th>
                <th className="p-3 text-left">Mã vận chuyển</th>
                <th className="p-3 text-right">Tổng tiền</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="border-t border-gray-300 hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-semibold">{order.orderId}</td>
                  <td className="p-4">{order.date}</td>
                  <td className="p-4 text-sm">{order.items.join(", ")}</td>
                  <td className="p-4 flex items-center">
                    <CreditCardIcon className="w-5 h-5 text-indigo-500 mr-2" />
                    {order.payment}
                  </td>
                  <td className="p-4 text-gray-600">{order.trackingId}</td>
                  <td className="p-4 text-right font-semibold">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        navigate(
                          `/orderdetail/${order.orderId.replace("#", "")}`
                        )
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition flex items-center"
                    >
                      <EyeIcon className="w-5 h-5 mr-1" /> Xem
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg sm:px-2 sm:py-0.5 sm:text-sm ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderHistory;
