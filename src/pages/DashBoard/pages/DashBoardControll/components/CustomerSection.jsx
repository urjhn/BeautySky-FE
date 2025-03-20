import React from 'react';
import { FaUsers } from "react-icons/fa";
import CustomersChart from '../../../charts/CustomersChart';

const CustomerSection = ({ customerGrowth, users }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 rounded-lg">
            <FaUsers className="text-purple-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Phân tích Khách hàng</h3>
            <p className="text-sm text-gray-500">
              Tổng số khách hàng: {users.length}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-[400px] relative">
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
                intersect: false
              }
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <FaUsers className="text-4xl mx-auto mb-2 opacity-50" />
              <p>Chưa có dữ liệu khách hàng</p>
            </div>
          </div>
        )}
      </div>

      <CustomerStats customerGrowth={customerGrowth} />
    </div>
  );
};

const CustomerStats = ({ customerGrowth }) => {
  if (!customerGrowth.length) return null;
  
  const latestData = customerGrowth[customerGrowth.length - 1];
  const growthRate = customerGrowth.length > 1 
    ? ((latestData.totalCustomers / customerGrowth[0].totalCustomers - 1) * 100).toFixed(1)
    : 0;
};

export default CustomerSection;