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
import blogsAPI from "../../services/blogs"; // Thêm import blogsAPI
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const cartCount = cartItems ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState("products"); // Thêm state để theo dõi loại tìm kiếm
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowProductDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async () => {
    try {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setShowProductDropdown(false);
        return;
      }

      // Tìm kiếm cả sản phẩm và blog
      const products = await productAPI.searchProduct(searchQuery);
      const blogs = await blogsAPI.searchBlogs(searchQuery);

      // Định dạng kết quả sản phẩm
      const formattedProducts = products.map((item) => ({
        id: item.productId,
        title: item.productName,
        price: item.price,
        description: item.description,
        image: item.productsImages?.[0]?.imageUrl,
        categoryName: item.categoryName,
        skinTypeName: item.skinTypeName,
        rating: item.rating,
        type: "product", // Đánh dấu là sản phẩm
      }));

      // Định dạng kết quả blog
      const formattedBlogs = blogs.map((item) => ({
        id: item.blogId,
        title: item.title,
        description: item.content?.substring(0, 100) || "",
        image: item.imgURL,
        categoryName: item.category,
        skinTypeName: item.skinType,
        type: "blog", // Đánh dấu là blog
      }));

      // Kết hợp kết quả
      const combinedResults = [...formattedProducts, ...formattedBlogs];
      setSearchResults(combinedResults);
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
    <>
      {/* Spacer div để giữ khoảng trống cho navbar fixed */}
      <div className="h-[72px] sm:h-[80px] w-full"></div>
      
      <nav className={`
        fixed top-0 left-0 right-0 
        h-[72px] sm:h-[80px]
        bg-white
        z-[1000]
        transition-all duration-300
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md' 
          : 'bg-white shadow-md'}
      `}>
        <div className="h-full container mx-auto flex justify-between items-center px-4">
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
          <ul className="hidden sm:flex items-center space-x-6 lg:space-x-8">
            {NavbarMenu.map((item) => (
              <li key={item.id}>
                {item.submenu ? (
                  <button
                    onMouseEnter={() => setShowProductDropdown(true)}
                    onClick={() => setShowProductDropdown((prev) => !prev)}
                    className="text-sm lg:text-base text-gray-700 font-medium 
                               hover:text-[#6BBCFE] active:scale-95 
                               transition-all duration-200"
                  >
                    {item.title}
                  </button>
                ) : (
                  <Link
                    to={item.link}
                    className="text-sm lg:text-base text-gray-700 font-medium 
                               hover:text-[#6BBCFE] active:scale-95 
                               transition-all duration-200"
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Search, Cart, User */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search Bar */}
            <div className="relative hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowProductDropdown(true);
                    }
                  }}
                  className="w-32 sm:w-40 lg:w-48 h-9 border-2 border-gray-200 rounded-full 
                             px-3 pr-8 text-sm focus:outline-none focus:border-[#6BBCFE] 
                             transition-all duration-200"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                  <IoMdSearch className="w-4 h-4" />
                </div>
              </div>

              {/* Dropdown Results - Điều chỉnh vị trí */}
              {showProductDropdown && (
                <div
                  className="absolute right-0 bg-white w-96 mt-2 rounded-lg shadow-lg 
                             max-h-[32rem] overflow-y-auto z-[999] border border-gray-100"
                  ref={dropdownRef}
                >
                  <div className="sticky top-0 bg-gray-50 p-3 border-b border-gray-100">
                    {/* Thêm tab để chuyển đổi giữa sản phẩm và blog */}
                    <div className="flex mb-2">
                      <button
                        className={`flex-1 py-1 px-2 text-sm rounded-l-md ${
                          searchType === "products"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => setSearchType("products")}
                      >
                        Sản phẩm
                      </button>
                      <button
                        className={`flex-1 py-1 px-2 text-sm rounded-r-md ${
                          searchType === "blogs"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => setSearchType("blogs")}
                      >
                        Bài viết
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      {searchResults.length > 0
                        ? `Tìm thấy ${
                            searchType === "products"
                              ? searchResults.filter(
                                  (item) => item.type === "product"
                                ).length
                              : searchResults.filter(
                                  (item) => item.type === "blog"
                                ).length
                          } ${
                            searchType === "products" ? "sản phẩm" : "bài viết"
                          }`
                        : `Không tìm thấy ${
                            searchType === "products" ? "sản phẩm" : "bài viết"
                          }`}
                    </p>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {searchResults
                        .filter(
                          (item) =>
                            (searchType === "products" &&
                              item.type === "product") ||
                            (searchType === "blogs" && item.type === "blog")
                        )
                        .map((item) => (
                          <Link
                            key={`${item.type}-${item.id}`}
                            to={
                              item.type === "product"
                                ? `/product/${item.id}`
                                : `/blog?blogId=${item.id}`
                            }
                            className="flex items-start p-4 hover:bg-blue-50 transition-all duration-200 group cursor-pointer"
                            onClick={() => {
                              setShowProductDropdown(false);
                              setSearchQuery("");
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
                                <div
                                  className="w-20 h-20 bg-gray-100 rounded-lg flex items-center 
                                            justify-center"
                                >
                                  <IoMdImage className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>

                            <div className="ml-4 flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3
                                    className="font-medium text-gray-900 group-hover:text-blue-600 
                                             transition-colors duration-150 line-clamp-2"
                                  >
                                    {item.title}
                                  </h3>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {item.categoryName && (
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                        {item.categoryName}
                                      </span>
                                    )}
                                    {item.skinTypeName && (
                                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                        {item.skinTypeName}
                                      </span>
                                    )}
                                    {item.type === "blog" && (
                                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                                        Bài viết
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {item.type === "product" && item.price && (
                                  <p className="text-sm font-semibold text-blue-600">
                                    {item.price?.toLocaleString("vi-VN")}₫
                                  </p>
                                )}
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
                      <div
                        className="inline-flex items-center justify-center w-12 h-12 
                                     rounded-full bg-gray-100 mb-4"
                      >
                        <IoMdSearch className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500">
                        Không tìm thấy sản phẩm phù hợp
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Vui lòng thử tìm kiếm với từ khóa khác
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              to="/viewcart"
              className="relative flex items-center bg-gradient-to-r from-[#6BBCFE] to-[#0272cd] 
                         text-white py-1.5 px-3 lg:py-2 lg:px-4 rounded-full 
                         hover:shadow-lg transition-all duration-300 
                         active:scale-95"
            >
              <FaShoppingCart className="text-base lg:text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 
                               bg-red-500 text-white text-xs 
                               min-w-[20px] h-5 
                               flex items-center justify-center
                               rounded-full px-1
                               border-2 border-white
                               animate-bounce">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Section */}
            {user ? (
              <Popover content={menu} trigger="click" placement="bottomRight">
                <img
                  src={user.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${user.userId || user.userName || 'default'}`}
                  alt={user.fullName || "Người dùng"}
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

        {/* Mobile Menu */}
        <div
          className={`
            ${isMobileMenuOpen ? "block" : "hidden"}
            sm:hidden absolute top-full left-0 right-0 
            bg-white shadow-md border-t border-gray-100
            z-[998]
          `}
        >
          {NavbarMenu.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 
                         text-gray-700 text-sm font-medium
                         transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.title}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
