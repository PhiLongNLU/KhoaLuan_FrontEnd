import React, { useEffect, useState } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import axios from "axios";
import {
  ConversationDto,
  ConversationMetaDto,
  CreateMessageDto,
  MessageDto,
} from "../../interfaces/chat.interfaces";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessagesToCurrentChat,
  setCurrentConversation,
  trigglerConversationsReload,
  updateCurrentConversationMeta,
} from "../../store/chatSlice";
import { conversationLocalStorageService } from "../../service/conversationLocalStorage.service";
import { messageLocalStorageService } from "../../service/messageLocalStorage.service";
import { v4 as uuidv4 } from "uuid";

const NEST_API_URL = import.meta.env.VITE_NEST_API_URL;

const axiosInstance = axios.create({
  baseURL: NEST_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const ChatScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentConversationId = useSelector(
    (state: RootState) => state.chat.currentConversationId
  );
  const currentMessages = useSelector(
    (state: RootState) => state.chat.currentMessages
  );
  const currentConversationMeta = useSelector(
    (state: RootState) => state.chat.currentConversationMeta
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialChat, setIsInitialChat] = useState<boolean>(true);

  useEffect(() => {
    if (currentConversationId) {
      // Khi ID được chọn (không phải null), setIsInitialChat = false
      setIsInitialChat(false);
      // Tin nhắn đã được tải vào Redux store bởi Sidebar khi chọn
    } else {
      // Khi ID là null (cuộc trò chuyện mới hoặc chưa chọn), setIsInitialChat = true
      setIsInitialChat(true);
      // Clear tin nhắn hiển thị
      dispatch(addMessagesToCurrentChat([])); // Clear currentMessages
    }
  }, [currentConversationId, dispatch]);

  const createNewConversation = async (
    userId: string,
    initialMessageContent: string
  ) => {
    setIsLoading(true);

    const newConversationMeta: ConversationMetaDto = {
      id: uuidv4(), // Tạo ID duy nhất ở frontend
      userId: userId,
      title:
        initialMessageContent.substring(0, 50) +
        (initialMessageContent.length > 50 ? "..." : ""), // Lấy 50 ký tự đầu làm tiêu đề
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    // Lưu cuộc trò chuyện mới vào localStorage
    conversationLocalStorageService.saveConversation(newConversationMeta);

    // Cập nhật Redux store với cuộc trò chuyện mới
    dispatch(
      setCurrentConversation({
        conversationMeta: newConversationMeta,
        messages: [],
      })
    );
    dispatch(trigglerConversationsReload());

    setIsLoading(false);
    return newConversationMeta;
  };

  // Hàm xử lý việc gửi tin nhắn
  const handleSendMessage = async (msg: string) => {
    if (!msg.trim() || isLoading || !currentUser?.id) {
      return;
    }

    let conversationToUseId = currentConversationId;
    let conversationMetaToUse = currentConversationMeta;

    // Nếu chưa có conversationId, tạo cuộc trò chuyện mới
    if (!conversationToUseId) {
      const newConv = await createNewConversation(currentUser.id, msg);
      conversationToUseId = newConv.id;
      conversationMetaToUse = newConv;
    }
    console.log("conversationToUseId: ", conversationToUseId);

    const userMessage: MessageDto = {
      id: `temp-${Date.now()}`, // ID tạm thời cho tin nhắn người dùng
      conversationId: conversationToUseId,
      senderType: "User",
      content: msg,
      timestamp: new Date().toISOString(),
    };

    // Thêm tin nhắn người dùng vào Redux store
    dispatch(addMessagesToCurrentChat([userMessage]));
    // Thêm tin nhắn người dùng vào localStorage
    messageLocalStorageService.addMessages(conversationToUseId, [userMessage]);

    setIsLoading(true);

    try {
      const createMessageDto: CreateMessageDto = {
        conversationId: conversationToUseId,
        content: msg,
      };

      const response = await axios.post<MessageDto[]>(
        `${NEST_API_URL}/chat/message`,
        createMessageDto
      );
      console.log("response: ", response);

      const llmMessage = response.data.find((m) => m.senderType === "LLM");

      if (llmMessage) {
        // Cập nhật tin nhắn người dùng với ID thật và thêm tin nhắn LLM vào Redux store
        dispatch(addMessagesToCurrentChat([llmMessage]));

        messageLocalStorageService.addMessages(
          conversationToUseId,
          [llmMessage]
        );
      }

      // Cập nhật lastUpdated của cuộc trò chuyện trong localStorage
      if (conversationMetaToUse) {
        const updatedConversationMeta = {
          ...conversationMetaToUse,
          lastUpdated: new Date().toISOString(),
          title: conversationMetaToUse.title || (msg.substring(0, 50) + (msg.length > 50 ? "..." : "")),
        };
        conversationLocalStorageService.saveConversation(
          updatedConversationMeta
        );
        // Cập nhật Redux store để Sidebar có thể re-render với thông tin mới
        dispatch(updateCurrentConversationMeta(updatedConversationMeta));
        dispatch(trigglerConversationsReload())
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      dispatch(
        addMessagesToCurrentChat([
          {
            id: `error-${Date.now()}`,
            conversationId: conversationToUseId,
            senderType: "LLM",
            content: "Rất tiếc, có lỗi xảy ra khi xử lý tin nhắn của bạn.",
            timestamp: new Date().toISOString(),
          },
        ])
      );
    } finally {
      setIsLoading(false);
    }
  };

  const displayMessages = currentMessages;

  return (
    <div className="w-3/4 h-screen bg-white flex flex-col items-center justify-center relative">
      <h1 className="text-3xl font-bold text-gray-700">
        {currentConversationMeta
          ? currentConversationMeta.title
          : "Bắt Đầu Cuộc Trò Chuyện Mới"}
      </h1>
      <div className="w-[100%] max-w-7/10 h-[500px] flex flex-col overflow-y-auto">
        {displayMessages.length === 0 && !isLoading && !isInitialChat && (
          <div className="text-center text-gray-500 mt-20">
            Không có tin nhắn nào trong cuộc trò chuyện này.
          </div>
        )}

        {displayMessages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg.content}
            isUser={msg.senderType === "User"}
          />
        ))}
        {isLoading && (
          <ChatBubble
            message="LLM đang gõ..."
            isUser={false}
            isLoading={true}
          />
        )}
      </div>
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatScreen;
