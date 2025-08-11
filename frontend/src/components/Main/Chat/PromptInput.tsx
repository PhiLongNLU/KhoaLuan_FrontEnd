import { Icon } from '@iconify/react/dist/iconify.js';
import clsx from 'clsx';
import React, { useState } from 'react'

interface PromptInputProps {
    onSendMessage: (message: string) => void;
}

const PromptInput = ({ onSendMessage }: PromptInputProps) => {

    const iconSize = 25

    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim() !== "") {
            onSendMessage(message.trim());
            setMessage("");
        }
    };

    return (
        <div className={clsx(
            "w-full flex items-center justify-between",
            "px-5 py-3 border border-gray-300 rounded-full shadow-lg"
        )}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything..."
                className="bg-red-200 flex-grow focus:outline-none text-gray-900 bg-white"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <div
                className="cursor-pointer"
                onClick={handleSend}
            >
                <Icon icon={"mynaui:send-solid"} width={iconSize} height={iconSize} />
            </div>
        </div>
    )
}

export default PromptInput