import React, { useState } from "react";
import { Send } from "lucide-react";

const ChatInput: React.FC<{ onSend: (msg: string) => void }> = ({ onSend }) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim() !== "") {
            onSend(message);
            setMessage("");
        }
    };

    return (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[80%] max-w-xl">
            <div className="relative">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask anything..."
                    className="w-full p-3 pl-4 pr-12 text-gray-900 bg-white border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600"
                    onClick={handleSend}
                >
                    <Send className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
