import React from "react";

const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition transform hover:scale-105 w-full">
      <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-4 text-gray-800">{title}</h3>
      {children}
    </div>
  );
};

export default ChartCard;
