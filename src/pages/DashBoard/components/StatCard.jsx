import React from "react";

const StatCard = ({ icon, title, value, color }) => {
  return (
    <div
      className={`bg-white p-4 md:p-6 rounded-2xl shadow-lg flex items-center space-x-3 md:space-x-4 
      transition transform hover:scale-105 border-l-8 ${color}
      w-full sm:w-[calc(50%-1rem)] lg:w-auto`}
    >
      <div className="text-2xl md:text-4xl text-gray-700">{icon}</div>
      <div>
        <p className="text-gray-500 text-xs md:text-sm">{title}</p>
        <h2 className="text-xl md:text-3xl font-bold text-gray-800">{value}</h2>
      </div>
    </div>
  );
};

export default StatCard;
