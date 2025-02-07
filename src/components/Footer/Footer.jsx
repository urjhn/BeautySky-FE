import React from 'react'
import footerLogo from "../../assets/footer/logo.png"
import footerNamebrand from "../../assets/footer/namebrand.png"
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  //FaMobileAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div data-aos="fade-up" className="bg-white">
        <section className="max-w-[1500px] mx-auto">
            <div className="grid md:grid-cols-2 py-5">

                {/* company details */}
                
                    <div className=" py-8 px-16">
                        <h1 className="sm:max-w-40 flex justify-around items-center grid-cols-2 gap-4">
                        <a href="#/" className="flex items-center">
                            <img src={footerLogo} alt="" className="w-20"/>
            
                            <img src={footerNamebrand} alt="" className="w-40"/>
                        </a>
                        </h1>
                        <p className="">
                        The exclusive distributor of Sky Beauty in Vietnam
                        is FPT Trading Company Limited.{" "}
                        </p>
                        {/* Social Handle */}
                        <div className="flex items-center gap-3 mt-6">
                            <a href="#">
                                <FaInstagram className="text-3xl" />
                            </a>
                            <a href="#">
                                <FaFacebook className="text-3xl" />
                            </a>
                            <a href="#">
                                <FaLinkedin className="text-3xl" />
                            </a>
                        </div>
                    </div>
   
                    {/* footer links */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 col-span-1 md:pl-6 ">
                        <div className="">
                            <div className="text-center py-8 px-16">
                                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                                    FPT Trading Company Limited
                                </h1>
                                <ul className={`flex flex-col gap-3`}>
                                <li className="cursor-pointer">Address: Lot E2a-7, D1 Road, High-Tech Park,
                                 Long Thanh My Ward, Thu Duc City, Ho Chi Minh City</li>
                                <li className="cursor-pointer">Phone number: 0937748123</li>
                                <li className="cursor-pointer">Hotline: (028) 7300 5588</li>
                                <li className="cursor-pointer">Email: company.skybeauty@fpt.net.vn</li>
                                </ul>
                            </div>
                        </div>
                        <div className="">
                            <div className="py-8 px-4 ">
                                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                                Term of service
                                </h1>
                                <ul className="flex flex-col gap-3">
                                <li className="cursor-pointer">Purchase guidelines</li>
                                <li className="cursor-pointer">Shipment</li>
                                <li className="cursor-pointer">Payment methodsmethods</li>
                                <li className="cursor-pointer">Data privacy</li>
                                </ul>
                            </div>
                        </div>
                    </div>
            </div>
        
                    <div>
                        <div className="text-center py-10 border-t-2 border-gray-300/50 bg-sky-500">
                        @Copyright 2025 || The Sky Beauty
                        </div>
                    </div>
        </section>
    </div>
  )
}

export default Footer
