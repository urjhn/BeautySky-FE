import React from 'react'

const TopProducts = ({ handleOrderPopup }) => {
  return (       

    <div>
        <div className="container">

            {/* Header section */}
                <div className= "text-center mb-10 max-w-[800px] mx-auto">
                <p data-aos="fade-up" className="text-sm text-black">
                Top Rated Products for you
                </p>
                <h1 data-aos="fade-up" className="text-center text-4xl underline underline-offset-8 hover:underline decoration-1 decoration-black font-bold text-[#6BBCFE]">
                Best Products
                </h1>
                <p data-aos="fade-up" className="text-xs text-gray-400">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit
                asperiores modi Sit asperiores modi
                </p>
                </div>
        </div>
    </div>
  )
}

export default TopProducts
