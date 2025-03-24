import React from 'react';
import { FaUsers, FaShoppingCart, FaBox, FaMoneyBillWave } from "react-icons/fa";
import StatCard from '../../../components/StatCard';

const StatisticsCards = ({ users, orders, products, revenue }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard
        icon={<FaUsers className="text-blue-500 text-lg md:text-xl" />}
        title="Người dùng"
        value={users.length}
        className="bg-white p-4 md:p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 rounded-xl"
        gradient="from-blue-500/10 to-blue-100/30"
      />
      <StatCard
        icon={<FaShoppingCart className="text-green-500" />}
        title="Đơn hàng"
        value={orders ? orders.length : 0}
        className="bg-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 rounded-xl"
        gradient="from-green-500/10 to-green-100/30"
      />
      <StatCard
        icon={<FaBox className="text-purple-500" />}
        title="Sản phẩm"
        value={products.length}
        className="bg-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 rounded-xl"
        gradient="from-purple-500/10 to-purple-100/30"
      />
      <StatCard
        icon={<FaMoneyBillWave className="text-yellow-500" />}
        title="Doanh thu"
        value={new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(revenue)}
        className="bg-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 rounded-xl"
        gradient="from-yellow-500/10 to-yellow-100/30"
      />
    </div>
  );
};

export default StatisticsCards;