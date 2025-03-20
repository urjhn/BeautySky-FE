import React from 'react';
import { FaChartLine } from "react-icons/fa";

const Header = ({ timeFrame, onTimeFrameChange }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-lg animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-500 text-white rounded-lg shadow-lg">
          <FaChartLine className="text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tổng quan Bảng điều khiển
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
        <span className="text-sm text-gray-500">Xem theo:</span>
        <select
          value={timeFrame}
          onChange={(e) => onTimeFrameChange(e.target.value)}
          className="border-none bg-white px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="monthly">Tháng</option>
          <option value="yearly">Năm</option>
        </select>
      </div>
    </div>
  );
};

export default Header;