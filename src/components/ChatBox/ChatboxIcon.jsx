const ChatboxIcon = () => {
    return (
      <div className="relative w-8 h-8">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <path 
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.5 21L6.39139 20.3385C6.77579 20.2358 7.18293 20.2952 7.54009 20.4707C8.88097 21.1385 10.3928 21.5142 12 21.5142C13.6072 21.5142 15.119 21.1385 16.4599 20.4707C16.8171 20.2952 17.2242 20.2358 17.6086 20.3385L21.5 21L20.8229 17.6006C20.72 17.2161 20.7791 16.8088 20.9565 16.4525C21.6244 15.1116 22 13.5997 22 12" 
            stroke="url(#chatGradient)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  export default ChatboxIcon;