import { useState, useEffect } from 'react';

const useCustomerData = (orders, users) => {
  const [customerGrowth, setCustomerGrowth] = useState([]);

  useEffect(() => {
    if (users?.length > 0) {
      const monthlyCustomers = {};
      const monthlyActive = {};
      
      users.forEach(user => {
        if (!user.dateCreate) return;
        
        const registerDate = new Date(user.dateCreate);
        const monthKey = `${registerDate.getFullYear()}-${String(registerDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyCustomers[monthKey]) {
          monthlyCustomers[monthKey] = {
            new: 0,
            active: 0,
            total: 0
          };
        }
        monthlyCustomers[monthKey].new += 1;

        Object.keys(monthlyCustomers).forEach(month => {
          if (month <= monthKey) {
            monthlyCustomers[monthKey].total += monthlyCustomers[month].new;
          }
        });
      });

      // Xử lý đơn hàng active
      orders?.forEach(order => {
        if (!order.orderDate || !order.userId) return;
        const orderDate = new Date(order.orderDate);
        const orderMonthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyActive[orderMonthKey]) {
          monthlyActive[orderMonthKey] = new Set();
        }
        monthlyActive[orderMonthKey].add(order.userId);
      });

      // Kết hợp dữ liệu
      Object.keys(monthlyCustomers).forEach(month => {
        monthlyCustomers[month].active = monthlyActive[month]?.size || 0;
      });

      // Chuyển đổi dữ liệu cho biểu đồ
      const customerData = Object.entries(monthlyCustomers)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({
          month,
          newCustomers: data.new,
          activeCustomers: data.active,
          totalCustomers: data.total,
          retentionRate: data.active > 0 ? ((data.active / data.total) * 100).toFixed(1) : 0
        }));

      setCustomerGrowth(customerData);
    }
  }, [users, orders]);

  return {
    customerGrowth
  };
};

export default useCustomerData;