import { createContext, useContext, useState, useEffect } from "react";
import orderAPI from "../services/order";
import { useOrdersContext } from "./OrdersContext";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();
  const { fetchOrders } = useOrdersContext();

  // 🛒 Lấy giỏ hàng từ API hoặc localStorage khi user thay đổi
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await orderAPI.getAll();
          const userOrders = response.data.find(
            (order) =>
              order.userId === user.userId && order.status === "Pending"
          );

          if (userOrders) {
            const mappedCart = userOrders.orderProducts.map((item) => ({
              id: item.productId,
              quantity: item.quantity,
              price: item.unitPrice,
            }));
            setCartItems(mappedCart);
          } else {
            const savedCart =
              JSON.parse(localStorage.getItem("cartItems")) || [];
            setCartItems(savedCart);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      } else {
        setCartItems([]);
        localStorage.removeItem("cartItems");
      }
    };

    fetchCart();
  }, [user]);

  // 🌍 Lưu giỏ hàng vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // 🛒 Đồng bộ giỏ hàng với API
  const syncCartWithAPI = async (updatedCart) => {
    if (!user) return;

    const orderData = {
      userId: user.userId,
      orderDate: new Date().toISOString(),
      totalAmount: updatedCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      finalAmount: updatedCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      status: "Pending",
      orderProducts: updatedCart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      })),
    };

    try {
      await orderAPI.createOrder(orderData);
      fetchOrders();
    } catch (error) {
      console.error("Error syncing cart with API:", error);
    }
  };

  // 🛍️ Thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }

      syncCartWithAPI(updatedCart);
      return updatedCart;
    });
  };

  // ❌ Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== id);
      syncCartWithAPI(updatedCart);
      return updatedCart;
    });
  };

  // 🔄 Cập nhật số lượng sản phẩm
  const updateQuantity = (id, quantity) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      );

      syncCartWithAPI(updatedCart);
      return updatedCart;
    });
  };

  // 🛒 Tính tổng giá trị giỏ hàng
  const totalPrice =
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook để dùng CartContext
export const useCart = () => useContext(CartContext);
