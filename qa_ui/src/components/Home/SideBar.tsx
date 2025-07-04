import React, { useEffect, useState } from "react";
import { Search, Plus, MessageSquare } from "lucide-react";
import { ConversationMetaDto } from "../../interfaces/chat.interfaces.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store.ts";
import { conversationLocalStorageService } from "../../service/conversationLocalStorage.service.ts";
import { messageLocalStorageService } from "../../service/messageLocalStorage.service.ts";
import {
  clearCurrentChat,
  setCurrentConversation,
  trigglerConversationsReload,
} from "../../store/chatSlice.ts";
import { v4 as uuidv4 } from "uuid";

interface ChatItemProps {
  conversation: ConversationMetaDto;
  onSelect: (conv: ConversationMetaDto) => void;
  onDelete: (convId: string, userId: string) => void;
  isSelected: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({
  conversation,
  onSelect,
  onDelete,
  isSelected,
}) => {
  const defaultIcon = <MessageSquare className="size-5" />;
  const title = conversation.title || "Cuộc trò chuyện không tiêu đề";

  return (
    <div
      className={`flex items-center gap-2 text-gray-700 px-4 py-2 hover:bg-gray-200 rounded-lg cursor-pointer ${
        isSelected ? "bg-gray-200 font-bold" : "hover:bg-gray-200"
      }`}
      onClick={() => onSelect(conversation)}
    >
      <div>
        {defaultIcon}
        <span className="truncate">{title}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(conversation.id, conversation.userId);
        }}
        className=""
      >
        X
      </button>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentConversationId = useSelector(
    (state: RootState) => state.chat.currentConversationId
  );
  const conversationsUpdatedFlag = useSelector(
    (state: RootState) => state.chat.conversationsUpdatedFlag
  );

  const [conversationList, setConversationList] = useState<
    ConversationMetaDto[]
  >([]);

  useEffect(() => {
    if (currentUser?.id) {
      loadUserConversations(currentUser.id);
    }
  }, [currentUser, conversationsUpdatedFlag]);

  const loadUserConversations = (userId: string) => {
    const loadedConversations =
      conversationLocalStorageService.getConversations(userId);
    loadedConversations.sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
    setConversationList(loadedConversations);
  };

  const handleSelectConversation = (conversation: ConversationMetaDto) => {
    const messages = messageLocalStorageService.getMessages(conversation.id);
    dispatch(
      setCurrentConversation({ conversationMeta: conversation, messages })
    );
  };

  const handleNewChat = () => {
    if (!currentUser?.id) {
      console.error("Không tìm thấy ID người dùng để tạo cuộc trò chuyện mới.");
      return;
    }
    const newConversation: ConversationMetaDto = {
      id: uuidv4(),
      userId: currentUser.id,
      title: "",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    conversationLocalStorageService.saveConversation(newConversation);

    // Cập nhật Redux store để hiển thị cuộc trò chuyện mới
    dispatch(
      setCurrentConversation({
        conversationMeta: newConversation,
        messages: [], // Cuộc trò chuyện mới chưa có tin nhắn nào
      })
    );

    // Kích hoạt cập nhật danh sách cuộc trò chuyện trong Sidebar
    dispatch(trigglerConversationsReload());
  };

  const handleDeleteConversation = (convId: string, userId: string) => {
    if (window.confirm("Bạn có chắc muốn xóa cuộc trò chuyện này?")) {
      conversationLocalStorageService.deleteConversation(userId, convId);
      messageLocalStorageService.clearMessages(convId);
      //   setConversationList((prev) => prev.filter((c) => c.id !== convId));
      dispatch(trigglerConversationsReload());

      if (currentConversationId === convId) {
        dispatch(clearCurrentChat());
      }
    }
  };

  if (!currentUser) return null;

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
        <button
          className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2 mb-4"
          onClick={handleNewChat}
        >
          <Plus className="w-5 h-5" />
          New chat
        </button>

        {/* Chat List */}
        <div className="flex-grow overflow-y-auto">
          {conversationList.length === 0 ? (
            <p className="text-sm text-gray-500 px-4">
              Chưa có cuộc trò chuyện nào.
            </p>
          ) : (
            conversationList.map((conv) => {
              return (
                <ChatItem
                  key={conv.id}
                  conversation={conv}
                  onSelect={handleSelectConversation}
                  onDelete={handleDeleteConversation}
                  isSelected={currentConversationId === conv.id}
                />
              );
            })
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.picture || "https://via.placeholder.com/40"}
            alt="User Avatar"
            className="size-10 rounded-full hover:cursor-pointer hover:bg-grey-200"
          />
          <div>
            <p className="font-bold">{currentUser.name || "Người dùng"}</p>
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
