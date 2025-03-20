import React from 'react';
import { FaChartLine, FaChartBar } from "react-icons/fa";
import RevenueChart from '../../../charts/RevenueChart';

const RevenueSection = ({ revenueGrowth }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-lg">
            <FaChartLine className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Biểu đồ Doanh thu</h3>
            <p className="text-sm text-gray-500">
              Tổng doanh thu: {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(revenueGrowth.reduce((total, item) => total + item.revenue, 0))}
            </p>
          </div>
        </div>

        <select 
          className="text-sm border rounded-lg px-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors"
          onChange={(e) => {
            // Xử lý lọc dữ liệu theo thời gian
          }}
        >
          <option value="6">6 tháng gần nhất</option>
          <option value="12">12 tháng gần nhất</option>
          <option value="all">Tất cả</option>
        </select>
      </div>

      <div className="w-full h-[400px] relative">
        {revenueGrowth.length > 0 ? (
          <RevenueChart 
            revenueGrowth={revenueGrowth}
            options={{
              chart: {
                toolbar: {
                  show: true,
                  tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                  }
                },
                zoom: {
                  enabled: true
                }
              },
              tooltip: {
                y: {
                  formatter: (value) => {
                    return new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(value);
                  }
                }
              }
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <FaChartBar className="text-4xl mx-auto mb-2 opacity-50" />
              <p>Chưa có dữ liệu doanh thu</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-500">Tháng cao nhất</p>
          <p className="text-lg font-semibold text-blue-600">
            {revenueGrowth.length > 0 && new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Math.max(...revenueGrowth.map(item => item.revenue)))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Doanh thu TB/tháng</p>
          <p className="text-lg font-semibold text-purple-600">
            {revenueGrowth.length > 0 && new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(revenueGrowth.reduce((total, item) => total + item.revenue, 0) / revenueGrowth.length)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueSection;