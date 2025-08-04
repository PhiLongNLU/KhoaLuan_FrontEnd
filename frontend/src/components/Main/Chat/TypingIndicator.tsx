import React from 'react'

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 py-2 px-3">
      <div className="flex space-x-1">
        <span className="dot" aria-label="typing dot" />
        <span className="dot" aria-label="typing dot" />
        <span className="dot" aria-label="typing dot" />
      </div>
      <style jsx>{`
        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #999;
          margin: 0 2px;
          animation: bounce 1s infinite ease-in-out;
        }
        .dot:nth-child(2) {
          animation-delay: 0.15s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          30% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default TypingIndicator
