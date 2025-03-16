import React from "react";

const StatCard = ({ icon, title, value, subtitle, className = '', gradient = '' }) => {
  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl p-4 
        bg-gradient-to-br ${gradient}
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-lg font-semibold text-gray-800 mb-1">{title}</div>
          <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </div>
        <div className="text-2xl opacity-90">
          {icon}
        </div>
      </div>
      
      {/* Decorative circle */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-current opacity-[0.03]" />
    </div>
  );
};

export default StatCard;
