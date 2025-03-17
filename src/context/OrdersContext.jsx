import { createContext, useEffect, useState, useContext } from "react";
import orderAPI from "../services/order";

const OrdersContext = createContext();

const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders data:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, setOrders, fetchOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};
const useOrdersContext = () => useContext(OrdersContext);

export { OrdersProvider, useOrdersContext };
