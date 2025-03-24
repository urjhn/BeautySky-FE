import React from 'react';
import { FaShoppingBag } from "react-icons/fa";
import dayjs from 'dayjs';

const OrdersTable = ({ orders }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaShoppingBag className="text-blue-500" />
          Đơn hàng gần đây
        </h2>
        <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
          Xem tất cả →
        </button>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden">
        {orders.map((order) => (
          <div key={order.orderId} className="border-b border-gray-200 py-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium">#{order.orderId}</span>
              <OrderStatus status={order.status} />
            </div>
            <div className="space-y-2">
              <p className="text-sm"><span className="text-gray-500">Khách hàng:</span> {order.userFullName}</p>
              <p className="text-sm"><span className="text-gray-500">SĐT:</span> {order.userPhone}</p>
              <p className="text-sm"><span className="text-gray-500">Địa chỉ:</span> {order.userAddress}</p>
              <p className="text-sm"><span className="text-gray-500">Tổng tiền:</span> {formatCurrency(order.finalAmount)}</p>
              <p className="text-sm"><span className="text-gray-500">Ngày đặt:</span> {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Thanh toán:</span>
                <PaymentStatus status={order.paymentStatus} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="overflow-x-auto">
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              <table className="min-w-full divide-y divide-gray-200 sticky top-0 z-10">
                <TableHeader />
                <TableBody orders={orders} />
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableHeader = () => (
  <thead className="bg-gray-50">
    <tr>
      <TableHeaderCell>Mã đơn hàng</TableHeaderCell>
      <TableHeaderCell>Khách hàng</TableHeaderCell>
      <TableHeaderCell>Số điện thoại</TableHeaderCell>
      <TableHeaderCell>Địa chỉ</TableHeaderCell>
      <TableHeaderCell>Tổng tiền</TableHeaderCell>
      <TableHeaderCell>Ngày đặt</TableHeaderCell>
      <TableHeaderCell>Trạng thái</TableHeaderCell>
      <TableHeaderCell>Thanh toán</TableHeaderCell>
    </tr>
  </thead>
);

const TableHeaderCell = ({ children }) => (
  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TableBody = ({ orders }) => (
  <tbody className="bg-white divide-y divide-gray-200">
    {orders.map((order) => (
      <TableRow key={order.orderId} order={order} />
    ))}
  </tbody>
);

const TableRow = ({ order }) => (
  <tr className="hover:bg-gray-50">
    <td className="p-4 text-sm">#{order.orderId}</td>
    <td className="p-4 text-sm">{order.userFullName}</td>
    <td className="p-4 text-sm">{order.userPhone}</td>
    <td className="p-4 text-sm">{order.userAddress}</td>
    <td className="p-4 text-sm font-medium">
      {formatCurrency(order.finalAmount)}
    </td>
    <td className="p-4 text-sm">
      {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
    </td>
    <td className="p-4">
      <OrderStatus status={order.status} />
    </td>
    <td className="p-4">
      <PaymentStatus status={order.paymentStatus} />
    </td>
  </tr>
);

const OrderStatus = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === "Completed"
        ? "bg-green-100 text-green-800"
        : status === "Pending"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800"
    }`}
  >
    {status === "Completed"
      ? "Đã hoàn thành"
      : status === "Pending"
      ? "Chờ xử lý"
      : "Đã hủy"}
  </span>
);

const PaymentStatus = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === "Confirmed"
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800"
    }`}
  >
    {status === "Confirmed"
      ? "Đã thanh toán"
      : "Chưa thanh toán"}
  </span>
);

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export default OrdersTable;