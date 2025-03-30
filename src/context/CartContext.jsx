import React, { createContext, useContext, useState, useEffect } from "react";
import cartsAPI from "../services/cart";
import { useAuth } from "./AuthContext";
import Swal from "sweetalert2";

const CartContext = createContext();
const LOCAL_STORAGE_CART_KEY = "guestCart";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [cartSynced, setCartSynced] = useState(false);
  const { user } = useAuth();

  // Load giỏ hàng khi component mount hoặc khi user thay đổi
  useEffect(() => {
    // Reset cart synced flag when user changes
    if (user) {
      setCartSynced(false);
    }

    const loadCart = async () => {
      if (user) {
        // Khi đã đăng nhập nhưng chưa đồng bộ
        if (!cartSynced) {
          await syncCartAfterLogin();
          setCartSynced(true);
        }
        // Sau khi đồng bộ xong hoặc đã đăng nhập từ trước
        await fetchCart();
      } else {
        // Nếu chưa đăng nhập, load từ localStorage
        loadGuestCart();
      }
    };

    loadCart();
  }, [user]);

  // Lưu giỏ hàng guest vào localStorage khi có thay đổi
  useEffect(() => {
    if (!user && cartItems.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Load giỏ hàng guest từ localStorage
  const loadGuestCart = () => {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        const total = parsedCart.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
        setTotalPrice(total);
      } else {
        // Reset giỏ hàng nếu không có dữ liệu trong localStorage
        setCartItems([]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error("Lỗi khi load giỏ hàng guest:", error);
      // Reset giỏ hàng nếu có lỗi
      setCartItems([]);
      setTotalPrice(0);
    }
  };

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await cartsAPI.getAll();
      if (response.data && response.data.items) {
        const items = response.data.items.map((item) => ({
          productId: item.productId,
          productName: item.productName || item.product?.productName,
          price: item.price || item.product?.price,
          quantity: item.quantity,
          productImage:
            item.productImage || item.product?.productsImages?.[0]?.imageUrl,
          totalPrice: item.totalPrice,
        }));
        setCartItems(items);
        setTotalPrice(response.data.totalPrice);
      } else {
        // Reset giỏ hàng nếu không có dữ liệu từ API
        setCartItems([]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
      // Reset giỏ hàng nếu có lỗi
      setCartItems([]);
      setTotalPrice(0);
    } finally {
      setIsLoading(false);
    }
  };

  const syncCartAfterLogin = async () => {
    try {
      setIsLoading(true);
      const guestCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);

      if (guestCart) {
        const parsedCart = JSON.parse(guestCart);

        // Đồng bộ từng sản phẩm
        for (const item of parsedCart) {
          try {
            const payload = {
              productId: item.productId,
              quantity: item.quantity,
            };
            await cartsAPI.createCarts(payload);
          } catch (error) {
            // Xử lý lỗi cụ thể cho từng sản phẩm
            console.error(`Lỗi khi đồng bộ sản phẩm ${item.productId}:`, error);
          }
        }

        // Xóa giỏ hàng guest sau khi đồng bộ thành công
        localStorage.removeItem(LOCAL_STORAGE_CART_KEY);

        // Reset trạng thái cart items để tránh hiển thị cả hai phiên bản
        setCartItems([]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error("Lỗi khi đồng bộ giỏ hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      setIsLoading(true);

      if (!user) {
        // Xử lý thêm vào giỏ hàng cho guest
        const existingItemIndex = cartItems.findIndex(
          (item) => item.productId === product.productId
        );

        if (existingItemIndex !== -1) {
          // Cập nhật số lượng nếu sản phẩm đã tồn tại
          const updatedItems = cartItems.map((item, index) => {
            if (index === existingItemIndex) {
              const newQuantity = item.quantity + (product.quantity || 1);
              return {
                ...item,
                quantity: newQuantity,
                totalPrice: newQuantity * item.price,
              };
            }
            return item;
          });
          setCartItems(updatedItems);
          const newTotal = updatedItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0
          );
          setTotalPrice(newTotal);

          // Hiển thị thông báo thành công
          Swal.fire({
            icon: "success",
            title: "Đã thêm vào giỏ hàng",
            text: "Số lượng sản phẩm đã được cập nhật",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          // Thêm sản phẩm mới
          const newItem = {
            ...product,
            quantity: product.quantity || 1,
            totalPrice: (product.quantity || 1) * product.price,
          };
          setCartItems(prev => [...prev, newItem]);
          setTotalPrice(prev => prev + newItem.totalPrice);

          // Hiển thị thông báo thành công
          Swal.fire({
            icon: "success",
            title: "Đã thêm vào giỏ hàng",
            text: "Sản phẩm đã được thêm vào giỏ hàng",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        return;
      }

      // Xử lý cho user đã đăng nhập
      const existingItem = cartItems.find(item => item.productId === product.productId);
      
      if (existingItem) {
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng
        const newQuantity = existingItem.quantity + (product.quantity || 1);
        const response = await cartsAPI.editCarts({
          productId: product.productId,
          quantity: newQuantity,
        });

        if (response.data) {
          await fetchCart();
          Swal.fire({
            icon: "success",
            title: "Đã thêm vào giỏ hàng",
            text: "Số lượng sản phẩm đã được cập nhật",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        // Nếu là sản phẩm mới
        const response = await cartsAPI.createCarts({
          productId: product.productId,
          quantity: product.quantity || 1,
        });

        if (response.data) {
          await fetchCart();
          Swal.fire({
            icon: "success",
            title: "Đã thêm vào giỏ hàng",
            text: "Sản phẩm đã được thêm vào giỏ hàng",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.response?.data || "Không thể thêm sản phẩm vào giỏ hàng",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      setIsLoading(true);

      if (!user) {
        // Cập nhật số lượng cho guest
        const updatedItems = cartItems.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: newQuantity,
                totalPrice: newQuantity * item.price,
              }
            : item
        );
        setCartItems(updatedItems);
        const newTotal = updatedItems.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
        setTotalPrice(newTotal);
        return;
      }

      // Cập nhật số lượng cho user đã đăng nhập
      const payload = {
        productId: productId,
        quantity: newQuantity,
      };

      const response = await cartsAPI.editCarts(payload);
      if (response.data) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.response?.data || "Không thể cập nhật số lượng sản phẩm",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setIsLoading(true);

      if (!user) {
        // Xóa sản phẩm khỏi giỏ hàng guest
        const updatedItems = cartItems.filter(
          (item) => item.productId !== productId
        );
        setCartItems(updatedItems);
        const newTotal = updatedItems.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
        setTotalPrice(newTotal);

        Swal.fire({
          icon: "success",
          title: "Đã xóa",
          text: "Sản phẩm đã được xóa khỏi giỏ hàng",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      // Xóa sản phẩm cho user đã đăng nhập
      await cartsAPI.deleteCarts(productId);
      await fetchCart();

      Swal.fire({
        icon: "success",
        title: "Đã xóa",
        text: "Sản phẩm đã được xóa khỏi giỏ hàng",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.response?.data || "Không thể xóa sản phẩm khỏi giỏ hàng",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        isLoading,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        fetchCart,
        syncCartAfterLogin,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
