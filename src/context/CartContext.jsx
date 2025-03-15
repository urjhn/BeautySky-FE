import React, { createContext, useContext, useState, useEffect } from 'react';
import cartsAPI from '../services/cart';
import Swal from 'sweetalert2';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await cartsAPI.getAll();
      if (response.data && response.data.items) {
        const items = response.data.items.map(item => ({
          productId: item.productId,
          productName: item.productName || item.product?.productName,
          price: item.price || item.product?.price,
          quantity: item.quantity,
          productImage: item.productImage || item.product?.productsImages?.[0]?.imageUrl,
          totalPrice: item.totalPrice
        }));
        setCartItems(items);
        setTotalPrice(response.data.totalPrice);
      }
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      setIsLoading(true);
      const payload = {
        productId: product.productId,
        quantity: 1
      };
      
      await cartsAPI.createCarts(payload);
      await fetchCart(); // Fetch lại giỏ hàng sau khi thêm
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      setIsLoading(true);
      const payload = {
        productId: productId,
        quantity: newQuantity
      };
      await cartsAPI.editCarts(payload);
      await fetchCart();
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể cập nhật số lượng sản phẩm',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setIsLoading(true);
      await cartsAPI.deleteCarts(productId);
      await fetchCart();
      
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa',
        text: 'Sản phẩm đã được xóa khỏi giỏ hàng',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể xóa sản phẩm khỏi giỏ hàng',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Tính toán tổng số lượng sản phẩm trong giỏ hàng
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      totalPrice,
      isLoading,
      cartCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
