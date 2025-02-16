import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import Logo from "../../assets/logo.png";
import Namebrand from "../../assets/namebrand.png";
import { NavbarMenu } from "../Navbar/data";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Kiểm tra trạng thái đăng nhập từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let user = null;
    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch (error) {
        console.error("Lỗi khi phân tích dữ liệu người dùng:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Xử lý tìm kiếm sản phẩm
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(
        `http://localhost:5000/search?query=${searchQuery}`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="w-16" />
            <img src={Namebrand} alt="Tên thương hiệu" className="w-32" />
          </Link>
        </div>

        {/* Menu */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-semibold">
          {NavbarMenu.map((item) => (
            <li key={item.id}>
              <Link
                to={item.link}
                className="hover:text-[#6BBCFE] transition duration-300"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        {/* Thanh tìm kiếm + Biểu tượng */}
        <div className="flex items-center gap-6">
          {/* Ô tìm kiếm */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 md:w-48 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-primary"
            />
            <button onClick={handleSearch} className="absolute right-3 top-2">
              <IoMdSearch className="text-gray-500 hover:text-[#6BBCFE]" />
            </button>

            {/* Kết quả tìm kiếm */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-60 bg-white shadow-lg rounded-lg mt-2 z-50">
                {searchResults.map((product) => (
                  <Link
                    to={`/product/${product.id}`}
                    key={product.id}
                    className="flex items-center gap-3 p-2 border-b hover:bg-gray-100"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="text-sm font-semibold">{product.name}</h3>
                      <p className="text-xs text-gray-500">{product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Giỏ hàng */}
          <Link
            to="/viewcart"
            className="relative flex items-center bg-gradient-to-r from-[#6BBCFE] to-[#0272cd] text-white py-2 px-4 rounded-full"
          >
            <FaShoppingCart className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Đăng nhập/Đăng xuất */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile">
                <img
                  src={user.photoURL || "https://via.placeholder.com/40"}
                  alt="Ảnh đại diện"
                  className="w-10 h-10 rounded-full border"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 font-semibold hover:text-red-800"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:block hover:bg-[#6BBCFE] text-primary font-semibold hover:text-white rounded-md border-2 border-[#6BBFCE] px-6 py-2 transition duration-200"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
