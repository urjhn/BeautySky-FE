import { createContext, useContext, useState, useEffect } from "react";
import orderAPI from "../services/order";
import { useOrdersContext } from "./OrdersContext";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth(); // Lấy user từ AuthContext
  const { fetchOrders } = useOrdersContext();

  // 🛒 Lấy giỏ hàng từ API khi user thay đổi (đăng nhập, đăng xuất)
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await orderAPI.getAll();
          const userOrders = response.data.find(
            (order) => order.userId === user.userId
          );

          if (userOrders) {
            const mappedCart = userOrders.orderProducts.map((item) => ({
              id: item.productId,
              quantity: item.quantity,
              price: item.unitPrice,
            }));
            setCartItems(mappedCart);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      } else {
        setCartItems([]); // Xóa giỏ hàng khi đăng xuất
      }
    };

    fetchCart();
  }, [user]); // Tự động fetch khi user thay đổi

  // 🛒 Cập nhật giỏ hàng lên API
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
      fetchOrders(); // Refresh đơn hàng
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
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
    syncCartWithAPI(cartItems);
  };

  // Calculate the total price of all items in the cart
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

// Custom hook to access cart data
export const useCart = () => useContext(CartContext);
