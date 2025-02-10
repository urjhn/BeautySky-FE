import React from "react";
import IMG from "../../assets/test/test0.png";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="min-h-[500px]">
      <div
        className="min-h-[400px] flex
        justify-center items-center"
      >
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-36">
            {/* text content section */}
            <div className="flex flex-col justify-center gap-6 sm:pt-0">
              <h1 data-aos="fade-up" className="text-3xl sm:text-4xl font-bold">
                Confused about your skin type?{" "}
              </h1>
              <p
                data-aos="fade-up"
                className="text-sm text-gray-500 tracking-wide leading-5"
              >
                Let's figure it out together! Take our fun quiz and discover
                your skin type with Sky Beauty.
                <br />
              </p>

              <div data-aos="fade-up" data-aos-delay="500">
                <Link
                  to="/quizz"
                  className="bg-gradient-to-r from-[#6BBCFE] to-[#2183d4] text-white py-2 px-4 rounded-full shadow-xl hover:shadow-md inline-block text-center"
                >
                  GO TO CHECK
                </Link>
              </div>
            </div>

            {/* Image section */}
            <div>
              <img
                src={IMG}
                alt=""
                className="max-w-lg w-full h-full mx-auto 
                      drop-shadow-[-5px_5px_6px_rgba(0,0,0,1)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
