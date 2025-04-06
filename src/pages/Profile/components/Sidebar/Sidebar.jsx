import {
  FaChartBar,
  FaUsers,
  FaSignOutAlt,
  FaCreditCard,
  FaShieldAlt,
  FaBell,
  FaSpa,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { useUsersContext } from "../../../../context/UserContext";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

const Sidebar = () => {
  const { user: authUser, logout } = useAuth();
  const { users, fetchUsers } = useUsersContext();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    Swal.fire({
      title: 'Đăng xuất',
      text: 'Bạn có chắc chắn muốn đăng xuất?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy',
      background: '#fff',
      customClass: {
        container: 'font-sans'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: 'Đã đăng xuất',
          text: 'Đăng xuất thành công!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          background: '#fff',
          customClass: {
            container: 'font-sans'
          }
        }).then(() => {
          navigate("/login");
        });
      }
    });
  };

  return (
    <>
      {/* Hamburger menu button for mobile */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <aside className={`
        fixed lg:sticky lg:top-0
        w-72 bg-gradient-to-b from-blue-50 to-blue-100 
        min-h-screen max-h-screen overflow-y-auto
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        z-40
      `}>
        <div className="flex flex-col min-h-screen">
          {/* Header - Sticky */}
          <div className="sticky top-0 z-10 bg-gradient-to-b from-blue-50 to-blue-100 pt-6 px-6 pb-3">
            <h2 className="text-3xl font-bold text-center text-blue-800">
              Profile
            </h2>
          </div>

          {/* Main Content */}
          <div className="flex-1 px-6 space-y-6 pb-6">
            {/* User Info Section */}
            <div className="text-center bg-white rounded-xl p-6 shadow-md mt-3">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-600">
                {currentUser?.fullName?.[0] || "G"}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {currentUser?.fullName || "Guest"}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                {currentUser?.email || "No email available"}
              </p>
              
              {/* Thêm phần hiển thị điểm tích lũy */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <i className="fas fa-star text-yellow-400"></i>
                    <span className="font-medium text-gray-700">Điểm tích lũy</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {currentUser?.point || 0} điểm
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Tích điểm để nhận ưu đãi
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1">
              <ul className="space-y-2">
                <NavItem icon={<FaUsers />} title="Profile" to="/profilelayout" />
                <NavItem
                  icon={<FaChartBar />}
                  title="Orders"
                  to="/profilelayout/historyorder"
                />
                <NavItem
                  icon={<FaSpa />}
                  title="Lộ trình của bạn"
                  to="/profilelayout/my-routines"
                />
              </ul>
            </nav>
          </div>

          {/* Logout Button - Fixed at bottom */}
          <div className="sticky bottom-0 bg-gradient-to-b from-blue-50 to-blue-100 p-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 
                         rounded-lg cursor-pointer transition-all duration-300 
                         text-red-600 hover:bg-red-50 hover:shadow-md
                         active:transform active:scale-95"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
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
            ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm"
        }`
      }
    >
      <div className="text-xl">{icon}</div>
      <span className="font-medium">{title}</span>
    </NavLink>
  </li>
);

export default Sidebar;
