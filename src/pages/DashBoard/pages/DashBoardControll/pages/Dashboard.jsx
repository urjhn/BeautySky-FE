import React, { useState } from "react";
import { useUsersContext } from "../../../../../context/UserContext";
import { useDataContext } from "../../../../../context/DataContext";
import useOrderData from "../hooks/useOrderData";       
import useCustomerData from "../hooks/useCustomerData";
import useRevenueData from "../hooks/useRevenueData";       

import Header from "../components/Header";
import StatisticsCards from "../components/StatisticsCard";
import RevenueSection from "../components/RevenueSection";
import CustomerSection from "../components/CustomerSection";
import InsightsSection from "../components/InsightsSection";
import OrdersTable from "../components/OrdersTable";

const Dashboard = () => {
  const { users } = useUsersContext();
  const { products } = useDataContext();
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const { orders, revenue, conversionRate, profitRate } = useOrderData();
  const { customerGrowth } = useCustomerData(orders, users);
  const { revenueGrowth } = useRevenueData(orders);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-1 flex flex-col p-4 md:p-6 space-y-4 md:space-y-8">
        <Header timeFrame={timeFrame} onTimeFrameChange={setTimeFrame} />

        <StatisticsCards users={users} orders={orders} products={products} revenue={revenue} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          <RevenueSection revenueGrowth={revenueGrowth} />
          <CustomerSection customerGrowth={customerGrowth} users={users} />
        </div>

        <InsightsSection 
          conversionRate={conversionRate}
          profitRate={profitRate}
          revenue={revenue}
          orders={orders}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        <OrdersTable orders={orders} />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #888 #f1f1f1;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;