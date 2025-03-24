import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
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
    'giới thiệu': ['giới thiệu', 'về sky beauty', 'sky beauty là gì'],
    'địa chỉ': ['địa chỉ', 'cửa hàng', 'chi nhánh', 'ở đâu'],
    'liên hệ': ['liên hệ', 'số điện thoại', 'email', 'hotline'],
    'sản phẩm': ['sản phẩm', 'bán những gì', 'có những gì'],
    'thương hiệu': ['thương hiệu', 'hãng', 'brand'],
    'chính sách': ['chính sách', 'bảo hành', 'đổi trả', 'giao hàng'],
    'mạng xã hội': ['mạng xã hội', 'facebook', 'instagram', 'linkedin']
  };

  // Tìm kiếm thông tin phù hợp
  for (const [category, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      try {
        switch (category) {
          case 'giới thiệu':
            return companyInfo.split('Giới thiệu:')[1].split('Chi tiết:')[0].trim();
          case 'địa chỉ':
            return `Trụ sở chính: Lô E2a-7, Đường D1, Khu Công Nghệ Cao, Thủ Đức, TP.HCM`;
          case 'liên hệ':
            return companyInfo.split('Thông tin liên hệ:')[1].split('Danh mục sản phẩm chính:')[0].trim();
          case 'sản phẩm':
            return companyInfo.split('Danh mục sản phẩm chính:')[1].split('Các thương hiệu nổi bật:')[0].trim();
          case 'thương hiệu':
            return companyInfo.split('Các thương hiệu nổi bật:')[1].split('Kết nối với chúng tôi:')[0].trim();
          case 'chính sách':
            return companyInfo.split('Chính sách và dịch vụ:')[1].trim();
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
    'chăm sóc da': ['chăm sóc da', 'skincare', 'mặt nạ', 'serum'],
    'trang điểm': ['trang điểm', 'makeup', 'son môi', 'phấn'],
    'chăm sóc cơ thể': ['chăm sóc cơ thể', 'body', 'sữa tắm'],
    'chăm sóc tóc': ['chăm sóc tóc', 'dầu gội', 'dầu xả']
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

  return null;
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

  const onEmojiClick = (emojiObject) => {
    setNewMessage(prevInput => prevInput + emojiObject.emoji);
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
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                 text-white rounded-full p-3 shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <ChatboxIcon />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <h3 className="font-bold">AI Trợ lý BeautySky</h3>
            </div>
            <span className="text-sm">Online</span>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-700 rounded-bl-none shadow-md'
                  }`}
                >
                  {message.role === 'model' && !message.isTyping && (
                    <div className="flex items-center gap-2 mb-1">
                      <ChatboxIcon />
                      <span className="text-xs font-medium">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Emoji Picker */}
          {showEmoji && (
            <div className="absolute bottom-16 right-0">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width={300}
                height={400}
              />
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t p-4 bg-white rounded-b-lg">
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                😊
              </button>
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 
                         transition-colors duration-300 flex items-center gap-1"
              >
                <span>Gửi</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBox;