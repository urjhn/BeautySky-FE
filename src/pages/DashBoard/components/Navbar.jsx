import React from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import Logo from "../public/images/logo.png";
import Brandname from "../public/images/namebrand.png";
import { useDataContext } from "../../../context/DataContext";

const Navbar = () => {

  return (
    <div className="bg-white px-6 py-3 shadow flex justify-between items-center">
      {/* Logo + Brand Name */}
      <div className="flex items-center space-x-3">
        <img src={Logo} alt="Logo" className="w-14 h-14 object-contain" />
        <img src={Brandname} alt="Brand Name" className="h-10 object-contain" />
      </div>

      {/* Thanh tìm kiếm */}
      <div className="flex items-center bg-gray-200 px-4 py-2 rounded-full w-80">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-3 w-full text-gray-700"
        />
      </div>

      {/* Thông báo & Avatar */}
      <div className="flex items-center space-x-5">
        <FaBell className="text-gray-600 text-2xl cursor-pointer hover:text-gray-800 transition" />
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="w-12 h-12 rounded-full border-2 border-gray-300"
        />
      </div>
    </div>
  );
};

export default Navbar;
