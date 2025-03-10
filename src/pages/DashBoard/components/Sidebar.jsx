import {
  FaChartBar,
  FaShoppingCart,
  FaUsers,
  FaBox,
  FaHome,
  FaCog,
  FaTags,
  FaFileAlt,
  FaBlog,
  FaCalendarAlt,
  FaBars,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-gray-900 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars size={24} />
      </button>

      <aside 
        className={`fixed lg:relative w-64 bg-gray-900 p-5 flex flex-col space-y-6 h-screen shadow-lg transition-all duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} z-10`}
      >
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-white lg:block md:hidden sm:hidden">Admin Panel</h2>

        {/* Navigation */}
        <nav>
          <ul className="space-y-2">
            <NavItem
              icon={<FaUsers />}
              title="Khách hàng"
              to="/dashboardlayout"
            />
            <NavItem
              icon={<FaChartBar />}
              title="Doanh thu"
              to="/dashboardlayout/dashboard"
            />
            <NavItem icon={<FaHome />} title="Cửa hàng" to="/" />

            <NavItem
              icon={<FaShoppingCart />}
              title="Orders"
              to="/dashboardlayout/orders"
            />
            <NavItem
              icon={<FaBox />}
              title="Sản phẩm"
              to="/dashboardlayout/products"
            />
            <NavItem
              icon={<FaBlog />}
              title="Blogs"
              to="/dashboardlayout/blogs"
            />
            <NavItem
              icon={<FaTags />}
              title="Khuyến mãi"
              to="/dashboardlayout/promotions"
            />
            <NavItem
              icon={<FaFileAlt />}
              title="Báo cáo"
              to="/dashboardlayout/reports"
            />
            <NavItem
              icon={<FaCalendarAlt />}
              title="Sự kiện"
              to="/dashboardlayout/events"
            />
            <NavItem
              icon={<FaCog />}
              title="Cài đặt"
              to="/dashboardlayout/settings"
            />
          </ul>
        </nav>
      </aside>
    </>
  );
};

// Component NavItem với hiệu ứng hover và active
const NavItem = ({ icon, title, to }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 
        ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-300 hover:bg-gray-700 hover:scale-105"
        }`
      }
    >
      <div className="text-2xl">{icon}</div>
      <span className="text-lg lg:block md:hidden sm:hidden">{title}</span>
    </NavLink>
  </li>
);

export default Sidebar;
