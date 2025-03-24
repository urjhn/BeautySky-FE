import { useState, useEffect } from 'react';

export default function useRevenueData(orders) {
  const [revenueGrowth, setRevenueGrowth] = useState([]);

  useEffect(() => {
    if (orders.length > 0) {
      const monthlyRevenue = {};
      
      orders.forEach(order => {
        if (!order.orderDate || order.status !== "Completed") return;
        
        const date = new Date(order.orderDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyRevenue[monthKey]) {
          monthlyRevenue[monthKey] = 0;
        }
        monthlyRevenue[monthKey] += Number(order.finalAmount) || 0;
      });

      const sortedData = Object.entries(monthlyRevenue)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, amount]) => ({
          month: month,
          revenue: amount,
          growth: 0
        }));

      sortedData.forEach((data, index) => {
        if (index > 0) {
          const prevRevenue = sortedData[index - 1].revenue;
          const currentRevenue = data.revenue;
          data.growth = prevRevenue ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;
        }
      });

      setRevenueGrowth(sortedData);
    }
  }, [orders]);

  return {
    revenueGrowth
  };
}