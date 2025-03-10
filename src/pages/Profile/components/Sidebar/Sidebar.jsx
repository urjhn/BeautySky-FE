import {
  FaChartBar,
  FaUsers,
  FaSignOutAlt,
  FaCreditCard,
  FaShieldAlt,
  FaBell,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { useUsersContext } from "../../../../context/UserContext";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const { user: authUser, logout } = useAuth();
  const { users, fetchUsers } = useUsersContext();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      await fetchUsers();
      setIsLoading(false);
    };
    loadUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (authUser && users.length > 0) {
      const foundUser = users.find(
        (u) => u.email?.toLowerCase() === authUser.email?.toLowerCase()
      );
      if (foundUser) {
        setCurrentUser(foundUser);
      }
    }
  }, [authUser, users]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-blue-50 to-blue-100 p-6 flex flex-col space-y-6 h-screen shadow-xl">
      {/* Header */}
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">
        Profile
      </h2>

      {/* User Info Section */}
      <div className="text-center bg-white rounded-xl p-6 shadow-md">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-200 flex items-center justify-center">
          {currentUser?.fullName?.[0] || "G"}
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {currentUser?.fullName || "Guest"}
        </h2>
        <p className="text-gray-500 text-sm">
          {currentUser?.email || "No email available"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-3">
          <NavItem icon={<FaUsers />} title="Profile" to="/profilelayout" />
          <NavItem
            icon={<FaChartBar />}
            title="Orders"
            to="/profilelayout/historyorder"
          />
          <NavItem
            icon={<FaCreditCard />}
            title="Quản lý thanh toán"
            to="/profilelayout/payment"
          />
          <NavItem
            icon={<FaShieldAlt />}
            title="Bảo mật 2 lớp (2FA)"
            to="/profilelayout/security"
          />
          <NavItem
            icon={<FaBell />}
            title="Thông báo"
            to="/profilelayout/notifications"
          />

          {/* Logout Button */}
          <li
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 text-red-600 hover:bg-red-50 mt-8"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="font-medium">Logout</span>
          </li>
        </ul>
      </nav>
    </aside>
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
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
      }
    >
      <div className="text-xl">{icon}</div>
      <span className="font-medium">{title}</span>
    </NavLink>
  </li>
);

export default Sidebar;
