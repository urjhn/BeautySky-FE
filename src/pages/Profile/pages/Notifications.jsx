import { useNotifications } from "../../../context/NotificationContext";
import { FaCheckCircle, FaTrash, FaBell } from "react-icons/fa";
import { motion } from "framer-motion";

const Notifications = () => {
  const { notifications, markAsRead, removeNotification } = useNotifications();

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6bbcfe] to-[#0272cd] p-4 md:p-6">
          <div className="flex items-center gap-3">
            <FaBell className="text-white text-2xl md:text-3xl" />
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Thông báo của bạn
            </h2>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4 md:p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <FaBell className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-gray-500">Chưa có thông báo nào</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <motion.li
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`group relative p-4 rounded-xl border transition-all duration-200 ${
                    notification.isRead
                      ? "bg-gray-50 border-gray-200"
                      : "bg-blue-50 border-blue-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className={`text-sm md:text-base ${
                        notification.isRead ? "text-gray-600" : "text-gray-800"
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.createdAt}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 
                                   hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <FaCheckCircle className="text-base" />
                          <span className="hidden sm:inline">Đánh dấu đã đọc</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 
                                 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash className="text-base" />
                        <span className="hidden sm:inline">Xóa</span>
                      </button>
                    </div>
                  </div>

                  {/* Progress bar for unread notifications */}
                  {!notification.isRead && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-100 rounded-b-xl">
                      <div className="h-full w-full bg-gradient-to-r from-blue-300 to-[#6bbcfe] 
                                  rounded-b-xl animate-pulse" />
                    </div>
                  )}
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with notification count */}
        {notifications.length > 0 && (
          <div className="border-t px-4 py-3 bg-gray-50">
            <p className="text-sm text-gray-600">
              Bạn có{" "}
              <span className="font-medium text-blue-600">
                {notifications.filter(n => !n.isRead).length}
              </span>{" "}
              thông báo chưa đọc
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
