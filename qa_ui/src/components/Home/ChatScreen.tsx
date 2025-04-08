import React, { useState } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

const ChatScreen: React.FC = () => {
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
        { text: "Why does the weather not just stay the same?", isUser: true },
        {
            text: "The two main reasons why the weather does not stay the same are:\n\n" +
                "1. **Atmospheric Dynamics:** The Earth's atmosphere is constantly in motion due to various factors like air circulation, pressure systems, and the interaction of different air masses. These dynamic processes lead to continuous changes in weather patterns.\n\n" +
                "2. **Solar Influence:** The Sun is the primary driver of weather patterns on Earth. Solar radiation heats the Earth unevenly, creating high and low-pressure areas, influencing the movement of air masses.",
            isUser: false,
        },
    ]);

    const handleSendMessage = (msg: string) => {
        setMessages([...messages, { text: msg, isUser: true }]);
    };

    return (
        <div className="w-3/4 h-screen bg-white flex flex-col items-center justify-center relative">
            <h1 className="text-3xl font-bold text-gray-700">Weather Dynamics</h1>
            <div className="w-[100%] max-w-7/10 h-[500px] flex flex-col overflow-y-auto">
                {messages.map((msg, index) => (
                    <ChatBubble key={index} message={msg.text} isUser={msg.isUser} />
                ))}
            </div>
            <ChatInput onSend={handleSendMessage} />
        </div>
    );
};

export default ChatScreen;
