import { createContext, useContext, useState, useEffect } from "react";
import orderAPI from "../services/order";
import { useAuth } from "./AuthContext";
import { debounce } from "lodash";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const { user } = useAuth();

  // Fetch giỏ hàng khi user đăng nhập
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCartItems([]);
        setCartId(null);
        return;
      }

      try {
        // Sử dụng API in-cart để lấy giỏ hàng hiện tại
        const response = await orderAPI.getInCartOrder();
        if (response.data) {
          setCartId(response.data.orderId);
          // Chuyển đổi OrderProducts thành cartItems
          const items = response.data.orderProducts.map(item => ({
            id: item.productId,
            quantity: item.quantity,
            price: item.unitPrice,
            totalPrice: item.totalPrice
          }));
          setCartItems(items);
        } else {
          setCartItems([]);
          setCartId(null);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartItems([]);
        setCartId(null);
      }
    };

    fetchCart();
  }, [user]);

  // Hàm đồng bộ giỏ hàng với server
  const syncCartWithServer = debounce(async (updatedCart) => {
    if (!user) return;

    try {
      const orderProducts = updatedCart.map(item => ({
        productID: item.id,
        quantity: item.quantity
      }));

      // Nếu chưa có cartId, tạo mới giỏ hàng
      if (!cartId) {
        const response = await orderAPI.addToCart(user.userId, orderProducts);
        setCartId(response.data.orderId);
      } else {
        // Nếu đã có cartId, cập nhật giỏ hàng hiện tại
        await orderAPI.updateOrder(cartId, {
          orderId: cartId,
          userId: user.userId,
          status: "In Cart",
          orderProducts: orderProducts
        });
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  }, 500);

  const addToCart = async (product) => {
    if (!user) {
      // Xử lý khi chưa đăng nhập
      return;
    }

    const updatedCart = [...cartItems];
    const existingItem = updatedCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice = existingItem.quantity * existingItem.price;
    } else {
      updatedCart.push({
        id: product.id,
        quantity: 1,
        price: product.price,
        totalPrice: product.price
      });
    }

    setCartItems(updatedCart);
    await syncCartWithServer(updatedCart);
  };

  const removeFromCart = async (productId) => {
    if (!user || !cartId) return;

    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);

    if (updatedCart.length === 0) {
      // Nếu giỏ hàng trống, xóa order
      try {
        await orderAPI.deleteOrder(cartId);
        setCartId(null);
      } catch (error) {
        console.error("Error deleting empty cart:", error);
      }
    } else {
      await syncCartWithServer(updatedCart);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user || !cartId) return;

    const updatedCart = cartItems.map(item =>
      item.id === productId
        ? {
            ...item,
            quantity: Math.max(1, quantity),
            totalPrice: Math.max(1, quantity) * item.price
          }
        : item
    );

    setCartItems(updatedCart);
    await syncCartWithServer(updatedCart);
  };

  const checkout = async (promotionId = null) => {
    if (!user || !cartId) return;

    try {
      const response = await orderAPI.checkout(cartId, promotionId);
      // Xóa giỏ hàng sau khi checkout thành công
      setCartItems([]);
      setCartId(null);
      return response.data;
    } catch (error) {
      console.error("Error during checkout:", error);
      throw error;
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartId,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
        checkout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
