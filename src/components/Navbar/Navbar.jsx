import React from "react";
import Logo from "../../assets/logo.png";
import Namebrand from "../../assets/namebrand.png";
import { NavbarMenu } from "../../mockData/data";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav>
        <div className="container flex justify-between items-center py-8 px-0">
          {/* Logo section */}
          <div className="sm:max-w-40 flex items-center grid-cols-2 gap-4">
            <a href="#" className="flex">
              <img src={Logo} alt="Logo" className="w-20" />

              <img src={Namebrand} alt="Namebrand" className="w-40" />
            </a>
          </div>
          {/* Menu section */}
          <div className="hidden md:block">
            <ul className="sm:flex hidden justify-center items-center gap-8 text-gray-700">
              {NavbarMenu.map((item) => {
                return (
                  <li key={item.id}>
                    <a
                      href={item.link}
                      className="
                    inline-block py-1 px-2 hover:text-[#6BBCFE] font-semibold"
                    >
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Icons section */}
          <div className="flex items-center gap-4">
            <div className="relative group hidden md:block">
              <input
                type="text"
                placeholder="Search"
                className="w-[100px] sm:w-[100px] group-hover:w-[150px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-sky-400 dark:bg-gray-100  "
              />
              <IoMdSearch className="text-gray-500 group-hover:text-[#6BBCFE] absolute top-1/2 -translate-y-1/2 right-3" />
            </div>

            <button
              onClick={() => handleOrderPopup()}
              className="bg-gradient-to-r from-[#6BBCFE] to-[#0272cd] transition-all duration-200 text-white  py-1 px-4 rounded-full flex items-center gap-3 group"
            >
              <Link
                to="/viewcart"
                className="group-hover:block hidden transition-all duration-200"
              >
                Order
              </Link>
              <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
            </button>

            <button className="hover:bg-[#6BBCFE] text-primary font-semibold hover:text-white rounded-md border-2 border-[#6BBFCE] px-6 py-2 duration-200 hidden md:block">
              <Link to="/login">Sign in</Link>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
