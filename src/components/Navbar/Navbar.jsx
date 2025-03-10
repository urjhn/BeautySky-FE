import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch, IoMdImage } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext"; // 🆕 Import useAuth
import { NavbarMenu } from "../Navbar/Data";
import Logo from "../../assets/logo.png";
import Namebrand from "../../assets/namebrand.png";
import { Menu, Popover, Avatar } from "antd";
import productAPI from "../../services/product";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    console.log("searchQuery changed:", searchQuery); // Kiểm tra searchQuery thay đổi
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        console.log("Calling handleSearch with query:", searchQuery.trim());
        handleSearch();
      } else {
        console.log("Empty search query - clearing results");
        setSearchResults([]);
        setShowProductDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setShowProductDropdown(false);
        return;
      }

      const products = await productAPI.searchProduct(searchQuery);
      
      const formattedResults = products.map(item => ({
        id: item.productId,
        title: item.productName,
        price: item.price,
        description: item.description,
        image: item.productsImages?.[0]?.imageUrl
      }));

      setSearchResults(formattedResults);
      setShowProductDropdown(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menu = (
    <Menu>
      {user?.roleId === 2 || user?.roleId === 3 ? (
        <Menu.Item key="dashboard">
          <Link to="/dashboardlayout">Quản trị hệ thống</Link>
        </Menu.Item>
      ) : null}
      <Menu.Item key="profile">
        <Link to="/profilelayout">Tài khoản của bạn</Link>
      </Menu.Item>
      <Menu.Item key="Quizz">
        <Link to="/quizz">Kiểm tra loại da</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="bg-white shadow-md pr-1 pl-1 relative">
      <div className="container mx-auto flex justify-between items-center py-4 px-1">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="w-12 md:w-16" />
            <img
              src={Namebrand}
              alt="Tên thương hiệu"
              className="w-24 md:w-32"
            />
          </Link>
        </div>

        {/* Desktop & Tablet Menu */}
        <ul className="hidden sm:flex items-center gap-2 lg:gap-4 text-gray-700 font-semibold text-sm lg:text-base">
          {NavbarMenu.map((item) => (
            <li
              key={item.id}
              className="relative flex items-center gap-1 lg:gap-2"
            >
              {item.icon && (
                <span className="text-base lg:text-lg">{item.icon}</span>
              )}
              {item.submenu ? (
                <button
                  onMouseEnter={() => setShowProductDropdown(true)}
                  onClick={() => setShowProductDropdown((prev) => !prev)}
                  className="hover:text-[#6BBCFE] transition duration-300 flex items-center gap-1 lg:gap-2"
                >
                  {item.title}
                </button>
              ) : (
                <Link
                  to={item.link}
                  className="hover:text-[#6BBCFE] transition duration-300 flex items-center gap-1 lg:gap-2"
                >
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-gray-700 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <HiX className="h-6 w-6" />
          ) : (
            <HiMenu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } sm:hidden absolute top-full left-0 right-0 bg-white shadow-md flex-col w-full z-50`}
        >
          {NavbarMenu.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="px-4 py-3 hover:bg-gray-100 border-b border-gray-200 flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              {item.title}
            </Link>
          ))}
        </div>

        {/* Search, Cart, User */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowProductDropdown(true);
                  }
                }}
                className="w-32 sm:w-48 lg:w-64 border-2 border-gray-200 rounded-full 
                           px-4 py-2 pr-10 focus:outline-none focus:border-blue-400 
                           transition-all duration-300 text-sm placeholder-gray-400"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 
                              text-gray-400 hover:text-blue-500 transition-colors duration-200">
                <IoMdSearch className="w-5 h-5" />
              </div>
            </div>

            {/* Dropdown Results */}
            {showProductDropdown && (
              <div className="absolute bg-white w-96 mt-2 rounded-lg shadow-lg 
                              max-h-[32rem] overflow-y-auto z-50 border border-gray-100"
                   ref={dropdownRef}>
                <div className="sticky top-0 bg-gray-50 p-3 border-b border-gray-100">
                  <p className="text-sm text-gray-500">
                    {searchResults.length > 0 
                      ? `Tìm thấy ${searchResults.length} sản phẩm` 
                      : 'Không tìm thấy sản phẩm'}
                  </p>
                </div>

                {searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        className="flex items-start p-4 hover:bg-blue-50 transition-all 
                                 duration-200 group cursor-pointer"
                        onClick={() => {
                          setShowProductDropdown(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="flex-shrink-0">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-20 h-20 object-cover rounded-lg shadow-sm 
                                       group-hover:shadow-md transition-shadow duration-200"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center 
                                          justify-center">
                              <IoMdImage className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 group-hover:text-blue-600 
                                           transition-colors duration-150 line-clamp-2">
                                {item.title}
                              </h3>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full 
                                             text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                Sản phẩm
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-blue-600">
                              {item.price?.toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                          
                          {item.description && (
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 
                                   rounded-full bg-gray-100 mb-4">
                      <IoMdSearch className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Vui lòng thử tìm kiếm với từ khóa khác
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            to="/viewcart"
            className="relative flex items-center bg-gradient-to-r from-[#6BBCFE] to-[#0272cd] text-white py-1.5 px-3 lg:py-2 lg:px-4 rounded-full"
          >
            <FaShoppingCart className="text-base lg:text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Section */}
          {user ? (
            <Popover content={menu} trigger="click" placement="bottomRight">
              <img
                src={
                  user.avatar ||
                  `https://api.dicebear.com/9.x/adventurer/svg?seed=${
                    user.userName || `user-${Math.random()}`
                  }`
                }
                alt={user.fullName || "Người dùng ẩn danh"}
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover border cursor-pointer"
              />
            </Popover>
          ) : (
            <div className="flex gap-2 lg:gap-4">
              <Link
                to="/login"
                className="text-xs sm:text-sm lg:text-base hover:bg-[#6BBCFE] text-primary font-semibold hover:text-white rounded-md border-2 border-[#6BBFCE] px-2 sm:px-3 lg:px-6 py-1.5 lg:py-2 transition duration-200"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
