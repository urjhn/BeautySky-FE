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
import Swal from "sweetalert2";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        image: item.imgUrl,
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
    // Hiển thị thông báo xác nhận đăng xuất
    Swal.fire({
      title: 'Đăng xuất',
      text: 'Bạn có chắc chắn muốn đăng xuất?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        // Hiển thị thông báo đăng xuất thành công
        Swal.fire({
          title: 'Đã đăng xuất',
          text: 'Đăng xuất thành công!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/login");
        });
      }
    });
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
      <div className="h-[60px] sm:h-[72px] lg:h-[80px] w-full"></div>
      
      <nav className={`
        fixed top-0 left-0 right-0 
        h-[60px] sm:h-[72px] lg:h-[80px]
        bg-white
        z-[1000]
        transition-all duration-300
        ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white shadow-md'}
      `}>
        <div className="h-full container mx-auto flex justify-between items-center px-4">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Logo" className="w-10 sm:w-12 lg:w-16" />
              <img src={Namebrand} alt="Tên thương hiệu" className="w-20 sm:w-24 lg:w-32" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <HiX className="h-6 w-6 text-gray-600" />
            ) : (
              <HiMenu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {NavbarMenu.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className="text-gray-700 font-medium hover:text-[#6BBCFE] 
                           transition-colors duration-200"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Search, Cart, User for Desktop */}
          <div className="hidden lg:flex items-center gap-4">
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

          {/* Mobile/Tablet Menu Dropdown */}
          <div
            ref={menuRef}
            className={`
              absolute top-full left-0 right-0 
              bg-white shadow-lg border-t border-gray-100
              transition-all duration-300 transform
              lg:hidden
              ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'}
            `}
          >
            <div className="container mx-auto px-4 py-2">
              {/* Mobile Search */}
              <div className="py-4 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 px-4 pr-10 rounded-lg border-2 border-gray-200 
                             focus:outline-none focus:border-[#6BBCFE]"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <IoMdSearch className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Mobile Menu Items */}
              <div className="py-2 space-y-1">
                {NavbarMenu.map((item) => (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 
                             rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon && (
                      <span className="mr-3 text-gray-500">{item.icon}</span>
                    )}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile User Section */}
              <div className="py-4 border-t border-gray-100">
                {user ? (
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center">
                      <img
                        src={user.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${user.userId || 'default'}`}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="ml-3 font-medium text-gray-900">
                        {user.fullName}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-4">
                    <Link
                      to="/login"
                      className="w-full py-2 text-center bg-[#6BBCFE] text-white rounded-lg 
                               hover:bg-[#5AA8EA] transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="w-full py-2 text-center border-2 border-[#6BBCFE] text-[#6BBCFE] 
                               rounded-lg hover:bg-[#6BBCFE] hover:text-white 
                               transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
