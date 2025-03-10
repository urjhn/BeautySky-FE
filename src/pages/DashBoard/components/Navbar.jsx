import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch, IoMdImage } from "react-icons/io";
import { useAuth } from "../../../context/AuthContext";
import { Menu, Popover, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Logo from "../public/images/logo.png";
import Namebrand from "../public/images/namebrand.png";
import { HiMenu } from "react-icons/hi";
import productAPI from "../../../services/product";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const products = await productAPI.searchProduct(searchQuery);
      setSearchResults(products);
      setShowDropdown(true);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/dashboardlayout/profileadmin">Tài khoản của bạn</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="bg-white shadow-md px-4">
      <div className="container mx-auto flex justify-between items-center py-4 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="w-14 h-auto" />
          <img src={Namebrand} alt="Tên thương hiệu" className="w-32 h-auto hidden sm:block" />
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-gray-600 hover:text-[#6BBCFE]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <HiMenu size={24} />
        </button>

        {/* Desktop/Tablet Search Bar */}
        <div className="hidden lg:block relative w-96">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-full px-4 py-2 
                       pl-10 focus:outline-none focus:border-blue-400 
                       transition-all duration-300"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
              ) : (
                <IoMdSearch className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          {/* Dropdown Results */}
          {showDropdown && (
            <div 
              ref={dropdownRef}
              className="absolute mt-2 w-full bg-white rounded-lg shadow-lg 
                         border border-gray-100 max-h-[32rem] overflow-y-auto z-50"
            >
              <div className="sticky top-0 bg-gray-50 p-3 border-b border-gray-100">
                <p className="text-sm text-gray-500">
                  {searchResults.length > 0 
                    ? `Tìm thấy ${searchResults.length} sản phẩm` 
                    : 'Không tìm thấy sản phẩm'}
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {searchResults.map((product) => (
                  <Link
                    key={product.productId}
                    to={`/dashboardlayout/products/${product.productId}`}
                    className="flex items-start p-4 hover:bg-blue-50 
                             transition-all duration-200 group"
                    onClick={() => {
                      setShowDropdown(false);
                      setSearchQuery('');
                    }}
                  >
                    <div className="flex-shrink-0">
                      {product.productsImages?.[0]?.imageUrl ? (
                        <img 
                          src={product.productsImages[0].imageUrl}
                          alt={product.productName}
                          className="w-16 h-16 object-cover rounded-lg 
                                   shadow-sm group-hover:shadow-md 
                                   transition-shadow duration-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg 
                                      flex items-center justify-center">
                          <IoMdImage className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 
                                       group-hover:text-blue-600 
                                       transition-colors duration-150">
                            {product.productName}
                          </h3>
                          <div className="mt-1 space-y-1">
                            <p className="text-sm font-semibold text-blue-600">
                              {product.price?.toLocaleString('vi-VN')}₫
                            </p>
                            <p className="text-sm text-gray-500">
                              Số lượng: {product.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full 
                                       bg-blue-100 text-blue-800">
                          {product.categoryName || 'Sản phẩm'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="hidden lg:flex items-center space-x-4">
          {user ? (
            <Popover content={menu} trigger="click" placement="bottomRight">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName || "Người dùng ẩn danh"}
                  className="w-10 h-10 rounded-full object-cover border cursor-pointer"
                />
              ) : (
                <img
                  src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${
                    user.userName || `user-${Math.random()}`
                  }`}
                  alt="Avatar ảo"
                  className="w-10 h-10 rounded-full border cursor-pointer"
                />
              )}
            </Popover>
          ) : (
            <Link
              to="/login"
              className="bg-[#6BBCFE] text-white font-semibold px-6 py-2 rounded-md hover:bg-[#4BA6E5] transition duration-200"
            >
              Đăng nhập
            </Link>
          )}
        </div>

        {/* Mobile/Tablet Menu */}
        <div className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-md transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
          {/* Mobile Search Bar */}
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-[#6BBCFE] transition"
              />
              <button onClick={handleSearch} className="absolute right-4 top-2.5">
                <IoMdSearch className="text-gray-500 hover:text-[#6BBCFE] text-xl" />
              </button>
            </div>
          </div>

          {/* Mobile User Section */}
          <div className="p-4 border-t">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName || "Người dùng ẩn danh"}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                ) : (
                  <img
                    src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${
                      user.userName || `user-${Math.random()}`
                    }`}
                    alt="Avatar ảo"
                    className="w-10 h-10 rounded-full border"
                  />
                )}
                <div className="flex flex-col">
                  <Link to="/dashboardlayout/profileadmin" className="text-gray-800 hover:text-[#6BBCFE]">
                    Tài khoản của bạn
                  </Link>
                  <button onClick={handleLogout} className="text-left text-gray-600 hover:text-[#6BBCFE]">
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center bg-[#6BBCFE] text-white font-semibold px-6 py-2 rounded-md hover:bg-[#4BA6E5] transition duration-200"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
