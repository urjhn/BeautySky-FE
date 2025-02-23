import { createContext, useState, useContext, useEffect } from "react";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  // Sử dụng URL ảnh trực tiếp thay vì import
  const initialEvents = JSON.parse(localStorage.getItem("events")) || [
    {
      id: 1,
      img: "/hero/hero01.png", // Đường dẫn tĩnh đến ảnh
      title: "Giảm giá lên đến 50% trên tất cả",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: 2,
      img: "/hero/hero02.png",
      title: "Giảm 30% trên tất cả",
      description: "Ai đó đang ở đó? Lorem ipsum dolor sit amet.",
    },
    {
      id: 3,
      img: "/hero/hero03.png",
      title: "Mua 1 tặng 1 chỉ hôm nay!",
      description: "Cơ hội vàng để sở hữu sản phẩm yêu thích.",
    },
    {
      id: 4,
      img: "/hero/hero04.png",
      title: "Giảm sốc 70% trong 24 giờ",
      description: "Nhanh tay đặt hàng kẻo lỡ!",
    },
    {
      id: 5,
      img: "/hero/hero05.png",
      title: "Hàng ngàn ưu đãi khi đăng ký thành viên",
      description: "Tham gia ngay để nhận voucher đặc biệt.",
    },
  ];

  const [events, setEvents] = useState(initialEvents);

  // Cập nhật localStorage khi events thay đổi
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const addEvent = (event) => {
    const newEvent = { ...event, id: events.length + 1 };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent }}
    >
      {children}
    </EventContext.Provider>
  );
};

// Custom Hook để sử dụng EventContext
export const useEvent = () => useContext(EventContext);
