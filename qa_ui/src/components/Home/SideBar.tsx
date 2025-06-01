import React, {JSX} from "react";
import { Search, Plus, MessageSquare, Lightbulb, Film } from "lucide-react";
import {loadUser} from "../../store/authSlice.ts";

interface ChatItemProps {
    title: string;
    icon: JSX.Element;
    isBold?: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({ title, icon, isBold }) => {
    return (
        <div className={`flex items-center gap-2 text-gray-700 px-4 py-2 hover:bg-gray-200 rounded-lg cursor-pointer ${isBold ? "font-bold" : ""}`}>
            {icon}
            <span className="truncate">{title}</span>
        </div>
    );
};

const Sidebar: React.FC = () => {
    const user = loadUser();

    return (
        <aside className="w-1/4 h-screen bg-pink-100 p-4 flex flex-col justify-between rounded-tl-3xl">
            {/* Header */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-pink-500 text-white flex items-center justify-center rounded-full">
                            😊
                        </div>
                        <h1 className="text-xl font-bold">AnyChat</h1>
                    </div>
                    <Search className="w-5 h-5 text-gray-600 cursor-pointer" />
                </div>

                {/* New Chat Button */}
                <button className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2 mb-4">
                    <Plus className="w-5 h-5" />
                    New chat
                </button>

                {/* Chat List */}
                <div>
                    <p className="text-sm text-gray-500 px-4 mb-2">Today</p>
                    <ChatItem title="Helpful AI Ready" icon={<MessageSquare className="w-5 h-5" />} />
                    <ChatItem title="Greenhouse Effect Expla..." icon={<Lightbulb className="w-5 h-5" />} />
                    <ChatItem title="Movie Streaming Help" icon={<Film className="w-5 h-5" />} />

                    <p className="text-sm text-gray-500 px-4 mt-4 mb-2">Previous 7 days</p>
                    <ChatItem title="Web Design Workflow" icon={<MessageSquare className="w-5 h-5" />} />
                    <ChatItem title="Photo generation" icon={<MessageSquare className="w-5 h-5" />} />
                    <ChatItem title="Cats eat grass" icon={<MessageSquare className="w-5 h-5" />} />
                    <ChatItem title="Weather Dynamics" icon={<MessageSquare className="w-5 h-5" />} isBold />
                </div>
            </div>

            {/* User Info */}
            <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={user.user?.picture} alt="User Avatar" className="w-10 h-10 rounded-full hover:cursor-pointer hover:bg-grey-200" />
                    <div>
                        <p className="font-bold">Emily</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                </div>
            </div>

            {/* Upgrade Button */}
            <button className="w-full bg-pink-200 text-pink-700 py-2 mt-3 rounded-lg font-semibold">
                Upgrade to Pro →
            </button>
        </aside>
    );
};

export default Sidebar;
