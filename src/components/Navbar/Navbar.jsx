import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import Logo from "../../assets/logo.png";
import Namebrand from "../../assets/namebrand.png";
import { NavbarMenu } from "../../mockData/data";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // State cho search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(userStatus);
  }, []);

  // Gửi request API khi bấm tìm kiếm
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
      console.error("Search error:", error);
    }
  };

  return (
    <nav>
      <div className="container flex justify-between items-center py-8 px-0">
        {/* Logo */}
        <div className="sm:max-w-40 flex items-center grid-cols-2 gap-4">
          <a href="#" className="flex">
            <img src={Logo} alt="Logo" className="w-20" />
            <img src={Namebrand} alt="Namebrand" className="w-40" />
          </a>
        </div>

        {/* Menu */}
        <div className="hidden md:block">
          <ul className="sm:flex hidden justify-center items-center gap-8 text-gray-700">
            {NavbarMenu.map((item) => (
              <li key={item.id}>
                <a
                  href={item.link}
                  className="inline-block py-1 px-2 hover:text-[#6BBCFE] font-semibold"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Icons + Search */}
        <div className="flex items-center gap-4 relative">
          {/* Search Box */}
          <div className="relative group">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[150px] sm:w-[120px] rounded-full border border-gray-300 px-3 py-1 focus:outline-none focus:border-1 focus:border-primary"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <IoMdSearch className="text-gray-500 hover:text-[#6BBCFE]" />
            </button>

            {/* Search Results Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-[200px] bg-white shadow-md rounded-lg mt-2 z-50">
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

          {/* Cart */}
          <button className="bg-gradient-to-r from-[#6BBCFE] to-[#0272cd] text-white py-1 px-4 rounded-full flex items-center gap-3">
            <Link to="/viewcart" className="relative">
              Order{" "}
              <span className="absolute -top-3 -right-14 bg-red-500 text-white text-xs px-1 py-1 rounded-md">
                {cartCount}
              </span>
            </Link>
            <FaShoppingCart className="text-xl" />
          </button>

          {/* User Login */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/profile">
                <FaUserCircle className="text-3xl text-[#0272cd] cursor-pointer hover:text-[#6BBCFE]" />
              </Link>
              <Link
                to="/logout"
                className="text-red-600 font-semibold hover:text-red-800"
              >
                Logout
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="hover:bg-[#6BBCFE] text-primary font-semibold hover:text-white rounded-md border-2 border-[#6BBFCE] px-6 py-2 duration-200 hidden md:block"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
