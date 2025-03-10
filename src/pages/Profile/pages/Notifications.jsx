import { useNotifications } from "../../../context/NotificationContext";
import { FaCheckCircle } from "react-icons/fa";

const Notifications = () => {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 md:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">🔔 Thông báo</h2>
      {notifications.length === 0 ? (
        <p>Không có thông báo nào.</p>
      ) : (
        <ul className="space-y-2 sm:space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-3 sm:p-4 border rounded-lg ${
                notification.isRead ? "bg-gray-200" : "bg-blue-100"
              }`}
            >
              <p className="text-sm sm:text-base">{notification.message}</p>
              <small className="text-gray-500 text-xs sm:text-sm">
                {notification.createdAt}
              </small>
              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="mt-2 sm:mt-0 sm:ml-4 text-sm sm:text-base text-green-600 hover:text-green-800 flex items-center"
                >
                  <FaCheckCircle className="mr-1" /> Đánh dấu đã đọc
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
