import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import ChatboxIcon from '../../components/ChatBox/ChatboxIcon';
import { companyInfo } from '../../utils/companyInfo';

// Di chuyển hàm formatTime lên đầu component
const formatTime = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

// Tách riêng logic xử lý câu hỏi
const processQuery = (query) => {
  query = query.toLowerCase().trim();
  
  // Xử lý các câu chào
  if (query.includes('xin chào') || query.includes('hello') || query.includes('hi')) {
    return "Xin chào! Tôi có thể giúp gì cho bạn? Bạn có thể hỏi tôi về sản phẩm, dịch vụ, hoặc thông tin của Sky Beauty.";
  }

  // Xử lý từ khóa chính
  const keywordMap = {
    'giới thiệu': ['giới thiệu', 'về sky beauty', 'sky beauty là gì', 'công ty'],
    'địa chỉ': ['địa chỉ', 'cửa hàng', 'chi nhánh', 'ở đâu', 'trụ sở'],
    'liên hệ': ['liên hệ', 'số điện thoại', 'email', 'hotline', 'gọi'],
    'sản phẩm': ['sản phẩm', 'bán những gì', 'có những gì', 'danh mục'],
    'thương hiệu': ['thương hiệu', 'hãng', 'brand', 'nhãn hiệu'],
    'tích điểm': ['tích điểm', 'thành viên', 'member', 'điểm thưởng', 'ưu đãi thành viên'],
    'khuyến mãi': ['khuyến mãi', 'giảm giá', 'ưu đãi', 'sale', 'voucher'],
    'thanh toán': ['thanh toán', 'trả tiền', 'payment', 'cod', 'ví điện tử'],
    'giao hàng': ['giao hàng', 'vận chuyển', 'ship', 'delivery'],
    'đổi trả': ['đổi trả', 'hoàn tiền', 'bảo hành', 'trả hàng'],
    'dịch vụ': ['dịch vụ', 'tư vấn', 'hỗ trợ', 'chăm sóc khách hàng'],
    'chứng nhận': ['chứng nhận', 'giải thưởng', 'thành tựu', 'iso'],
    'blog': ['blog', 'tips', 'hướng dẫn', 'review', 'chia sẻ'],
    'mạng xã hội': ['mạng xã hội', 'facebook', 'instagram', 'tiktok', 'youtube']
  };

  // Tìm kiếm thông tin phù hợp
  for (const [category, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      try {
        switch (category) {
          case 'giới thiệu':
            return companyInfo.split('Giới thiệu:')[1].split('Chi tiết:')[0].trim();
          case 'địa chỉ':
            return companyInfo.split('Thông tin liên hệ:')[1].split('Hotline')[0].trim();
          case 'liên hệ':
            return companyInfo.split('Thông tin liên hệ:')[1].split('Danh mục sản phẩm chính:')[0].trim();
          case 'sản phẩm':
            return companyInfo.split('Danh mục sản phẩm chính:')[1].split('Hệ thống tích điểm thành viên:')[0].trim();
          case 'thương hiệu':
            return companyInfo.split('Các thương hiệu nổi bật:')[1].split('Kết nối với chúng tôi:')[0].trim();
          case 'tích điểm':
            return companyInfo.split('Hệ thống tích điểm thành viên:')[1].split('Chương trình khuyến mãi:')[0].trim();
          case 'khuyến mãi':
            return companyInfo.split('Chương trình khuyến mãi:')[1].split('Phương thức thanh toán:')[0].trim();
          case 'thanh toán':
            return companyInfo.split('Phương thức thanh toán:')[1].split('Chính sách giao hàng:')[0].trim();
          case 'giao hàng':
            return companyInfo.split('Chính sách giao hàng:')[1].split('Chính sách đổi trả:')[0].trim();
          case 'đổi trả':
            return companyInfo.split('Chính sách đổi trả:')[1].split('Dịch vụ khách hàng:')[0].trim();
          case 'dịch vụ':
            return companyInfo.split('Dịch vụ khách hàng:')[1].split('Chứng nhận và Giải thưởng:')[0].trim();
          case 'chứng nhận':
            return companyInfo.split('Chứng nhận và Giải thưởng:')[1].split('Blog làm đẹp:')[0].trim();
          case 'blog':
            return companyInfo.split('Blog làm đẹp:')[1].split('Kết nối với chúng tôi:')[0].trim();
          case 'mạng xã hội':
            return companyInfo.split('Kết nối với chúng tôi:')[1].split('Tại Sky Beauty')[0].trim();
          default:
            return null;
        }
      } catch (error) {
        console.error(`Error processing ${category}:`, error);
        return null;
      }
    }
  }

  // Xử lý các danh mục sản phẩm cụ thể
  const productCategories = {
    'chăm sóc da': ['chăm sóc da', 'skincare', 'mặt nạ', 'serum', 'tẩy trang', 'sữa rửa mặt', 'toner', 'kem dưỡng', 'chống nắng'],
    'trang điểm': ['trang điểm', 'makeup', 'son môi', 'phấn', 'kem nền', 'mascara', 'kẻ mắt', 'che khuyết điểm'],
    'chăm sóc cơ thể': ['chăm sóc cơ thể', 'body', 'sữa tắm', 'kem dưỡng thể', 'xịt thơm', 'tẩy tế bào chết'],
    'chăm sóc tóc': ['chăm sóc tóc', 'dầu gội', 'dầu xả', 'serum tóc', 'mặt nạ tóc', 'xịt dưỡng tóc']
  };

  for (const [category, keywords] of Object.entries(productCategories)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      try {
        const categoryContent = companyInfo.split(`${category}:`)[1].split(/\d\./)[1];
        return categoryContent ? categoryContent.trim() : null;
      } catch (error) {
        console.error(`Error processing product category ${category}:`, error);
        return null;
      }
    }
  }

  // Trả về câu trả lời mặc định nếu không tìm thấy thông tin phù hợp
  // return "Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về: thông tin công ty, sản phẩm, khuyến mãi, chính sách, dịch vụ, hoặc các thương hiệu của chúng tôi.";
};

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "model",
      text: "Xin chào! Tôi là trợ lý AI của BeautySky. Tôi có thể giúp gì cho bạn?",
      time: formatTime(new Date())
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);
  const inputRef = useRef();

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Click outside to close emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowEmoji(false);
  };

  const onEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  // Hàm gọi API
  const generateResponse = async (history) => {
    try {
      const lastMessage = history[history.length - 1].text;
      
      // Thử xử lý locally trước
      const localResponse = processQuery(lastMessage);
      if (localResponse) {
        return localResponse;
      }

      // Nếu không có câu trả lời local, gọi API
      const messages = history.map(({ role, text }) => ({
        role: role === 'user' ? 'user' : 'model',
        parts: [{ text: text }]
      }));

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        })
      };

      const response = await fetch(import.meta.env.VITE_API_KEY_CHAT, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts?.[0]?.text || 
             "Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi rõ hơn được không?";

    } catch (error) {
      console.error("Chat API Error:", error);
      return "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const userMessage = {
        role: "user",
        text: newMessage.trim(),
        time: formatTime(new Date())
      };

      // Cập nhật UI với tin nhắn người dùng
      setChatHistory(prev => [...prev, userMessage]);
      setNewMessage('');

      // Hiển thị trạng thái đang nhập
      const loadingMessage = {
        role: "model",
        text: "Đang nhập...",
        time: formatTime(new Date()),
        isTyping: true
      };
      setChatHistory(prev => [...prev, loadingMessage]);

      // Gọi API
      const aiResponse = await generateResponse([...chatHistory, userMessage]);

      // Cập nhật UI với response
      setChatHistory(prev => [
        ...prev.filter(msg => !msg.isTyping),
        {
          role: "model",
          text: aiResponse,
          time: formatTime(new Date())
        }
      ]);

    } catch (error) {
      console.error("Chat error:", error);
      // Hiển thị lỗi trong chat
      setChatHistory(prev => [
        ...prev.filter(msg => !msg.isTyping),
        {
          role: "model",
          text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
          time: formatTime(new Date())
        }
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={chatBoxRef}>
      {/* Chat Button với animation pulse */}
      <button
        onClick={toggleChat}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                 text-white rounded-full p-3 shadow-lg transform hover:scale-110 
                 transition-all duration-300 animate-bounce hover:animate-none"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" 
               className="h-6 w-6 transform rotate-0 hover:rotate-90 transition-transform duration-300" 
               fill="none" 
               viewBox="0 0 24 24" 
               stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <ChatboxIcon />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full" />
          </div>
        )}
      </button>

      {/* Chat Window với animation slide-in */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-2xl border border-gray-200
                      transform transition-all duration-300 animate-slideIn">
          {/* Header với gradient động */}
          <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 bg-animate-gradient
                        text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full absolute top-0 animate-ping opacity-75"></div>
                </div>
                <h3 className="font-bold text-lg">AI Trợ lý BeautySky</h3>
              </div>
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Online</span>
            </div>
          </div>

          {/* Messages với scroll smooth và hover effects */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50 scroll-smooth">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                } animate-fadeIn`}
              >
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg transform transition-all duration-300
                    ${message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none hover:shadow-lg hover:-translate-y-1'
                      : 'bg-white text-gray-700 rounded-bl-none shadow-md hover:shadow-lg hover:-translate-y-1'
                    }`}
                >
                  {message.role === 'model' && !message.isTyping && (
                    <div className="flex items-center gap-2 mb-1 border-b border-gray-200 pb-1">
                      <div className="animate-bounce">
                        <ChatboxIcon />
                      </div>
                      <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        AI Assistant
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input section với modern design */}
          <form onSubmit={handleSubmit} className="border-t p-4 bg-white rounded-b-lg">
            <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg relative">
              <button
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
                className="text-gray-500 hover:text-gray-700 transition-colors transform hover:scale-110 p-2"
              >
                <span className="text-xl">😊</span>
              </button>
              
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-2 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              />
              
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg
                         hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 
                         transition-all duration-300 flex items-center gap-1 shadow-md"
              >
                <span>Gửi</span>
                <svg xmlns="http://www.w3.org/2000/svg" 
                     className="h-4 w-4 animate-slideRight" 
                     fill="none" 
                     viewBox="0 0 24 24" 
                     stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cập nhật phần Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-20 right-0 z-50 shadow-xl rounded-lg">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            autoFocusSearch={false}
            emojiStyle={EmojiStyle.NATIVE}
            height={400}
            width={300}
            searchPlaceHolder="Tìm emoji..."
            lazyLoadEmojis={true}
            previewConfig={{
              defaultCaption: "Chọn emoji",
              defaultEmoji: "1f60a"
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ChatBox;