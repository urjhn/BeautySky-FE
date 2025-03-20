import { useState, useEffect } from 'react';
import orderAPI from '../../../../../services/order';
import dayjs from 'dayjs';

export default function useOrderData() {
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [profitRate, setProfitRate] = useState(0);

  const fetchOrders = async () => {
    try {
      const data = await orderAPI.getAll();
      const ordersWithUserInfo = data.map((order) => {
        const userData = order.user || {};
        return {
          ...order,
          status: order.status || "Pending",
          userFullName: userData.fullName || "Không xác định",
          userPhone: userData.phone || "Không có",
          userAddress: userData.address || "Không có",
          userId: userData.userId || null,
          finalAmount: order.finalAmount || 0,
          paymentStatus: order.paymentId ? "Confirmed" : "Pending",
        };
      });
      setOrders(ordersWithUserInfo);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    // Tính tổng doanh thu
    const totalRevenue = orders
      .filter((order) => order.status === "Completed")
      .reduce((sum, order) => sum + order.finalAmount, 0);
    setRevenue(totalRevenue);

    // Tính tỷ lệ chuyển đổi
    const completedOrders = orders.filter(order => order.status === "Completed").length;
    const conversionRateCalc = (completedOrders / orders.length) * 100;
    setConversionRate(conversionRateCalc.toFixed(1));

    // Tính tỷ lệ lợi nhuận
    const estimatedCost = totalRevenue * 0.7;
    const profit = totalRevenue - estimatedCost;
    const profitRateCalc = (profit / totalRevenue) * 100;
    setProfitRate(profitRateCalc.toFixed(1));
  }, [orders]);

  const sortedOrders = orders.sort((a, b) => 
    dayjs(b.orderDate).valueOf() - dayjs(a.orderDate).valueOf()
  );

  return {
    orders: sortedOrders,
    revenue,
    conversionRate,
    profitRate,
    fetchOrders
  };
}