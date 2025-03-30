import React, { useMemo } from 'react';
import { FaUsers, FaUserPlus, FaUserCheck, FaShoppingBag } from "react-icons/fa";
import CustomersChart from '../../../charts/CustomersChart';

const CustomerSection = ({ customerGrowth, users, orders }) => {
  // Tính toán các thống kê
  const stats = useMemo(() => {
    if (!users || !Array.isArray(users)) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
      };
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    
    const activeUsers = users.filter(user => user.isActive).length;
    
    // Tính toán khách hàng mới từ customerGrowth
    const newUsers = customerGrowth && customerGrowth.length > 0 
      ? customerGrowth[customerGrowth.length - 1].newCustomers 
      : 0;

    return {
      totalUsers: users.length,
      activeUsers,
      newUsers,
    };
  }, [users, customerGrowth]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 rounded-lg">
            <FaUsers className="text-purple-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Phân tích Khách hàng</h3>
            <p className="text-sm text-gray-500">
              Cập nhật thống kê khách hàng
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Tổng số khách hàng */}
        <div className="bg-blue-50 p-4 rounded-xl hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <span className="text-xs font-medium text-blue-500 bg-blue-100 px-2 py-1 rounded-full">
              Tất cả
            </span>
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-bold text-blue-700">{stats.totalUsers}</h4>
            <p className="text-sm text-blue-600 mt-1">Tổng khách hàng</p>
          </div>
        </div>

        {/* Khách hàng mới */}
        <div className="bg-green-50 p-4 rounded-xl hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaUserPlus className="text-green-600 text-xl" />
            </div>
            <span className="text-xs font-medium text-green-500 bg-green-100 px-2 py-1 rounded-full">
              Tháng này
            </span>
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-bold text-green-700">{stats.newUsers}</h4>
            <p className="text-sm text-green-600 mt-1">Khách hàng mới</p>
          </div>
        </div>

        {/* Khách hàng hoạt động */}
        <div className="bg-purple-50 p-4 rounded-xl hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaUserCheck className="text-purple-600 text-xl" />
            </div>
            <span className="text-xs font-medium text-purple-500 bg-purple-100 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-bold text-purple-700">{stats.activeUsers}</h4>
            <p className="text-sm text-purple-600 mt-1">Đang hoạt động</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full h-[300px] md:h-[400px] relative">
        {customerGrowth.length > 0 ? (
          <CustomersChart 
            customerGrowth={customerGrowth}
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
                shared: true,
                intersect: false,
                y: {
                  formatter: function(value) {
                    return value + " khách hàng";
                  }
                }
              },
              xaxis: {
                title: {
                  text: 'Thời gian'
                }
              },
              yaxis: {
                title: {
                  text: 'Số lượng khách hàng'
                }
              }
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-gray-500 text-center">
              <FaUsers className="text-4xl mx-auto mb-2 opacity-50" />
              <p>Chưa có dữ liệu thống kê</p>
            </div>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Tỷ lệ hoạt động</h4>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-purple-500 rounded-full"
                  style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="ml-2 text-sm font-medium text-gray-600">
              {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Tỷ lệ khách mới</h4>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${(stats.newUsers / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="ml-2 text-sm font-medium text-gray-600">
              {((stats.newUsers / stats.totalUsers) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSection;