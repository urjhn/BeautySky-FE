import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // Điều chỉnh đường dẫn nếu cần

const Setting = () => {
  const { darkMode, setDarkMode, language, setLanguage } =
    useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen p-6 md:p-8 transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-8 border-b pb-4">
        Cài đặt hệ thống
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Dark Mode */}
        <div
          className={`p-6 rounded-xl shadow-lg transition-all hover:shadow-xl ${
            darkMode 
              ? "bg-gray-800 text-white hover:bg-gray-750" 
              : "bg-white text-gray-900 hover:bg-gray-50"
          }`}
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            Giao diện
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-base md:text-lg">Chế độ tối</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer 
                dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white 
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"/>
            </label>
          </div>
        </div>

        {/* Language */}
        <div
          className={`p-6 rounded-xl shadow-lg transition-all hover:shadow-xl ${
            darkMode 
              ? "bg-gray-800 text-white hover:bg-gray-750" 
              : "bg-white text-gray-900 hover:bg-gray-50"
          }`}
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Ngôn ngữ
          </h2>
          <select
            className={`w-full p-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                : "bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500"
            }`}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Setting;
