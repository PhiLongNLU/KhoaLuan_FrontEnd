import React from "react";

interface ChatBubbleProps {
    message: string;
    isUser?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser }) => {
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
            <div
                className={`p-3 rounded-lg max-w-lg ${
                    isUser
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-black rounded-bl-none shadow-md"
                }`}
            >
                {message}
            </div>
        </div>
    );
};

export default ChatBubble;
