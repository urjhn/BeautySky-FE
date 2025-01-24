import React from 'react'
import Logo from "../../assets/logo.png"
import Namebrand from "../../assets/namebrand.png"
import { FaCartShopping } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";



const Navbar = ({handleOrderPopup}) => {
  return (
  <div className ="shadow-md bg-white dark:text-white duration-200 relative z-40">
        {/* upper Navbar */}
        <div className= "bg-[#6BBCFE] py-2">
            <div className="container flex justify-end items-center gap-4 ">
   
                {/* search bar and order button */}
                    <div className="flex justify-between items-center gap-4">
                        <div className="relative group hidden sm:block">
                        <input type = "text" placeholder= "Search"
                        className="w-[200px] sm:w-[200px] group-hover:w-[300px] text-black transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-[#6BBCFE] dark:border-gray-500 dark:bg-gray-100  "
                        />
                        <IoMdSearch className="text-gray-5500 group-hover:text-[#6BBCFE] absolute top-1/2 -translate-y-1/2 right-3" />

                    </div>
            </div>
                
                {/* order button */}
            <button
              onClick={() => handleOrderPopup()}
              className="bg-gradient-to-r from-[#3a81ba] to-[#008cff] transition-all duration-200 text-white  py-1 px-4 rounded-full flex items-center gap-3 group"
            >
              <span className="group-hover:block hidden transition-all duration-200">
                Order
              </span>
              <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
            </button>

               {/*sign in*/}
            <div>
                <a href= "#">
                    <span className= "wd-tools-icon"></span>
                    <span className= " font-bold wd-tools-text">Sign in</span>

                </a>
            </div>
         

            </div>
        </div>
        
        {/* lower Navbar */}
        <div>
            <a href="#" className=" flex gap-0">
                    <img src={Logo} alt="Logo"
                    className = "max-w-20"/>
    
                    <img src={Namebrand} alt="Namebrand"
                    className = "max-w-36"/>
                    </a>
        </div>
    </div> 
  )
}

export default Navbar
