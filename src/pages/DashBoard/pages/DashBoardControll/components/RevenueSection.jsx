import React from 'react';
import { FaChartLine, FaChartBar } from "react-icons/fa";
import RevenueChart from '../../../charts/RevenueChart';

const RevenueSection = ({ revenueGrowth }) => {
  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 bg-blue-500/10 rounded-lg">
            <FaChartLine className="text-blue-600 text-lg sm:text-xl" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              Biểu đồ Doanh thu
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Tổng doanh thu: {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                notation: "compact",
                compactDisplay: "short",
              }).format(revenueGrowth.reduce((total, item) => total + item.revenue, 0))}
            </p>
          </div>
        </div>

        <select 
          className="text-xs sm:text-sm border rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 
            bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 
            focus:ring-blue-500/20 w-full sm:w-auto max-w-[200px]"
          onChange={(e) => {
            // Xử lý lọc dữ liệu theo thời gian
          }}
        >
          <option value="6">6 tháng gần nhất</option>
          <option value="12">12 tháng gần nhất</option>
          <option value="all">Tất cả</option>
        </select>
      </div>

      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] relative">
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
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value);
                  }
                }
              },
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    toolbar: {
                      show: false
                    }
                  },
                  legend: {
                    position: 'bottom',
                    offsetY: 0
                  }
                }
              }]
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-lg">
            <div className="text-gray-500 text-center p-4">
              <FaChartBar className="text-2xl sm:text-4xl mx-auto mb-1 sm:mb-2 opacity-50" />
              <p className="text-sm sm:text-base">Chưa có dữ liệu doanh thu</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 sm:hidden grid grid-cols-2 gap-2">
        <div className="bg-blue-50 p-2 rounded-lg text-center">
          <p className="text-xs text-gray-600">Doanh thu tháng này</p>
          <p className="text-sm font-semibold text-blue-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              notation: "compact",
              compactDisplay: "short",
            }).format(revenueGrowth[revenueGrowth.length - 1]?.revenue || 0)}
          </p>
        </div>
        <div className="bg-green-50 p-2 rounded-lg text-center">
          <p className="text-xs text-gray-600">Tăng trưởng</p>
          <p className="text-sm font-semibold text-green-600">
            {(revenueGrowth[revenueGrowth.length - 1]?.growth || 0).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueSection;