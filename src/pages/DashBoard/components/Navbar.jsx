import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch, IoMdImage } from "react-icons/io";
import { useAuth } from "../../../context/AuthContext";
import { Menu, Popover } from "antd";
import Logo from "../public/images/logo.png";
import Namebrand from "../public/images/namebrand.png";
import { HiMenu } from "react-icons/hi";
import productAPI from "../../../services/product";
import blogsAPI from "../../../services/blogs";
import usersAPI from "../../../services/users";
import Swal from "sweetalert2";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState("products");
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
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      
      let results = [];
      
      // Tìm kiếm dựa vào loại đã chọn
      if (searchType === "products") {
        const products = await productAPI.searchProduct(searchQuery);
        results = products.map(product => ({
          ...product,
          type: "product"
        }));
      } 
      else if (searchType === "blogs") {
        const blogs = await blogsAPI.searchBlogs(searchQuery);
        results = blogs.map(blog => ({
          ...blog,
          type: "blog"
        }));
      }
      else if (searchType === "users") {
        const usersResponse = await usersAPI.getAll();
        const users = usersResponse.data || [];
        
        // Lọc người dùng theo từ khóa tìm kiếm
        results = users
          .filter(user => 
            user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(user => ({
            ...user,
            type: "user"
          }));
      }
      
      setSearchResults(results);
      setShowDropdown(true);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
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
              placeholder={`Tìm kiếm ${
                searchType === "products" ? "sản phẩm" : 
                searchType === "blogs" ? "bài viết" : "người dùng"
              }...`}
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

          {/* Tabs cho loại tìm kiếm */}
          <div className="flex mt-2 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setSearchType("products")}
              className={`flex-1 py-1 px-2 text-xs rounded-full transition-all ${
                searchType === "products" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Sản phẩm
            </button>
            <button
              onClick={() => setSearchType("blogs")}
              className={`flex-1 py-1 px-2 text-xs rounded-full transition-all ${
                searchType === "blogs" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Bài viết
            </button>
            <button
              onClick={() => setSearchType("users")}
              className={`flex-1 py-1 px-2 text-xs rounded-full transition-all ${
                searchType === "users" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Người dùng
            </button>
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
                    ? `Tìm thấy ${searchResults.length} ${
                        searchType === "products" ? "sản phẩm" : 
                        searchType === "blogs" ? "bài viết" : "người dùng"
                      }` 
                    : `Không tìm thấy ${
                        searchType === "products" ? "sản phẩm" : 
                        searchType === "blogs" ? "bài viết" : "người dùng"
                      }`}
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {searchResults.map((item) => {
                  // Hiển thị kết quả sản phẩm
                  if (item.type === "product") {
                    return (
                      <Link
                        key={`product-${item.productId}`}
                        to={`/dashboardlayout/products/${item.productId}`}
                        className="flex items-start p-4 hover:bg-blue-50 
                                 transition-all duration-200 group"
                        onClick={() => {
                          setShowDropdown(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="flex-shrink-0">
                          {item.productsImages?.[0]?.imageUrl ? (
                            <img 
                              src={item.productsImages[0].imageUrl}
                              alt={item.productName}
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
                                {item.productName}
                              </h3>
                              <div className="mt-1 space-y-1">
                                <p className="text-sm font-semibold text-blue-600">
                                  {item.price?.toLocaleString('vi-VN')}₫
                                </p>
                                <p className="text-sm text-gray-500">
                                  Số lượng: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full 
                                           bg-blue-100 text-blue-800">
                              {item.categoryName || 'Sản phẩm'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                  
                  // Hiển thị kết quả blog
                  else if (item.type === "blog") {
                    return (
                      <Link
                        key={`blog-${item.blogId}`}
                        to={`/dashboardlayout/blogs/${item.blogId}`}
                        className="flex items-start p-4 hover:bg-blue-50 
                                 transition-all duration-200 group"
                        onClick={() => {
                          setShowDropdown(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="flex-shrink-0">
                          {item.imgUrl ? (
                            <img 
                              src={item.imgUrl}
                              alt={item.title}
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
                                {item.title}
                              </h3>
                              <div className="mt-1">
                                <p className="text-sm text-gray-500 line-clamp-2">
                                  {item.content?.substring(0, 100) || ""}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full 
                                           bg-green-100 text-green-800">
                              {item.category || 'Bài viết'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                  
                  // Hiển thị kết quả người dùng
                  else if (item.type === "user") {
                    return (
                      <Link
                        key={`user-${item.userId}`}
                        to={`/dashboardlayout/users/${item.userId}`}
                        className="flex items-start p-4 hover:bg-blue-50 
                                 transition-all duration-200 group"
                        onClick={() => {
                          setShowDropdown(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="flex-shrink-0">
                          {item.avatar ? (
                            <img 
                              src={item.avatar}
                              alt={item.fullName || item.userName}
                              className="w-16 h-16 object-cover rounded-full 
                                       shadow-sm group-hover:shadow-md 
                                       transition-shadow duration-200"
                            />
                          ) : (
                            <img
                              src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${
                                item.userName || item.email || item.id || 'default-avatar'
                              }`}
                              alt="Avatar ảo"
                              className="w-16 h-16 object-cover rounded-full 
                                       shadow-sm group-hover:shadow-md 
                                       transition-shadow duration-200"
                            />
                          )}
                        </div>

                        <div className="ml-4 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 
                                           group-hover:text-blue-600 
                                           transition-colors duration-150">
                                {item.fullName || "Chưa cập nhật"}
                              </h3>
                              <div className="mt-1 space-y-1">
                                <p className="text-sm text-gray-500">
                                  @{item.userName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.email}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full 
                                           bg-purple-100 text-purple-800">
                              {item.roleId === 2 ? "Staff" : 
                               item.roleId === 3 ? "Manager" : "Khách hàng"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                  
                  return null;
                })}
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
                    user.userName || user.email || user.id || 'default-avatar'
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
                placeholder={`Tìm kiếm ${
                  searchType === "products" ? "sản phẩm" : 
                  searchType === "blogs" ? "bài viết" : "người dùng"
                }...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-[#6BBCFE] transition"
              />
              <button onClick={handleSearch} className="absolute right-4 top-2.5">
                <IoMdSearch className="text-gray-500 hover:text-[#6BBCFE] text-xl" />
              </button>
            </div>
            
            {/* Tabs cho mobile */}
            <div className="flex mt-2 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setSearchType("products")}
                className={`flex-1 py-1 px-2 text-xs rounded-full transition-all ${
                  searchType === "products" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Sản phẩm
              </button>
              <button
                onClick={() => setSearchType("blogs")}
                className={`flex-1 py-1 px-2 text-xs rounded-full transition-all ${
                  searchType === "blogs" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Bài viết
              </button>
              <button
                onClick={() => setSearchType("users")}
                className={`flex-1 py-1 px-2 text-xs rounded-full transition-all ${
                  searchType === "users" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Người dùng
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
                      user.userName || user.email || user.id || 'default-avatar'
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
