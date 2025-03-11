import { createContext, useContext, useState, useEffect } from "react";
import orderAPI from "../services/order";
import { useAuth } from "./AuthContext";
import { debounce } from "lodash";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Khởi tạo từ localStorage nếu chưa đăng nhập
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartId, setCartId] = useState(null);
  const { user } = useAuth();

  // Đồng bộ với localStorage khi cartItems thay đổi
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Fetch giỏ hàng từ server khi đăng nhập
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        // Nếu logout, lấy dữ liệu từ localStorage
        const savedCart = localStorage.getItem('cart');
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
        setCartId(null);
        return;
      }

      try {
        const response = await orderAPI.getInCartOrder();
        if (response) {
          setCartId(response.orderId);
          const items = response.orderProducts.map(item => ({
            id: item.productId,
            name: item.productName, // Thêm tên sản phẩm
            image: item.productImage, // Thêm hình ảnh
            quantity: item.quantity,
            price: item.unitPrice,
            totalPrice: item.totalPrice
          }));
          setCartItems(items);
          // Xóa localStorage khi đã đồng bộ với server
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [user]);

  // Thay đổi hàm syncCartWithServer thành addToCart API
  const syncCartWithServer = debounce(async (updatedCart) => {
    if (!user) return;

    try {
      const orderProducts = updatedCart.map(item => ({
        productID: item.id,
        quantity: item.quantity,
        productName: item.name, // Thêm tên sản phẩm
        productImage: item.image // Thêm hình ảnh
      }));

      const response = await orderAPI.createOrderAddCart(user.userId, orderProducts);
      setCartId(response.orderId);
      
      // Cập nhật lại cartItems từ response nếu có
      if (response.orderProducts) {
        const items = response.orderProducts.map(item => ({
          id: item.productId,
          name: item.productName,
          image: item.productImage,
          quantity: item.quantity,
          price: item.unitPrice,
          totalPrice: item.totalPrice
        }));
        setCartItems(items);
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  }, 500);

  const addToCart = async (product) => {
    const updatedCart = [...cartItems];
    const existingItem = updatedCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice = existingItem.quantity * existingItem.price;
    } else {
      updatedCart.push({
        id: product.id,
        name: product.name,
        image: product.image,
        quantity: 1,
        price: product.price,
        totalPrice: product.price
      });
    }

    setCartItems(updatedCart);
    
    if (user) {
      await syncCartWithServer(updatedCart);
    }
  };

  const removeFromCart = async (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);

    if (user) {
      if (updatedCart.length === 0 && cartId) {
        try {
          await orderAPI.deleteOrder(cartId);
          setCartId(null);
        } catch (error) {
          console.error("Error deleting empty cart:", error);
        }
      } else {
        await syncCartWithServer(updatedCart);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    const updatedCart = cartItems.map(item =>
      item.id === productId
        ? {
            ...item,
            quantity: quantity,
            totalPrice: quantity * item.price
          }
        : item
    );

    setCartItems(updatedCart);
    
    if (user) {
      await syncCartWithServer(updatedCart);
    }
  };

  const checkout = async (promotionId = null) => {
    if (!user || !cartId) return;

    try {
      const response = await orderAPI.createOrderCheckout(cartId, promotionId);
      setCartItems([]);
      setCartId(null);
      return response;
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
