import { useNotifications } from "../../../context/NotificationContext";
import { FaCheckCircle } from "react-icons/fa";

const Notifications = () => {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🔔 Thông báo</h2>
      {notifications.length === 0 ? (
        <p>Không có thông báo nào.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 border rounded-lg ${
                notification.isRead ? "bg-gray-200" : "bg-blue-100"
              }`}
            >
              <p>{notification.message}</p>
              <small className="text-gray-500">{notification.createdAt}</small>
              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="ml-4 text-green-600 hover:text-green-800 flex items-center"
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
