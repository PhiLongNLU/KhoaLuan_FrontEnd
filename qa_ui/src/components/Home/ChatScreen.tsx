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
    try {
      const response = await axiosInstance.post<ConversationDto>(`/chat/new`, {
        title: initialMessageContent.substring(0, 50) + "...",
      });
      console.log("userId: ", userId);
      const newConversationMeta: ConversationMetaDto = {
        id: response.data.id,
        userId: response.data.userId,
        title: response.data.title,
        createdAt: response.data.createdAt,
        lastUpdated: response.data.lastUpdated,
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

      // Tải lại danh sách cuộc trò chuyện trong Sidebar (nếu Sidebar cũng lấy từ store, không thì cần cơ chế khác)
      // Hiện tại Sidebar sẽ tự tải lại khi user thay đổi, hoặc có thể dispatch một action riêng để Sidebar lắng nghe
      // For now, let's assume Sidebar re-renders when conversationList changes, or user reloads page.
      // A more robust solution might involve another Redux slice for global conversation list.
      dispatch(trigglerConversationsReload());

      return newConversationMeta.id; // Trả về ID của cuộc trò chuyện mới
    } catch (error) {
      console.error("Lỗi khi tạo cuộc trò chuyện mới:", error);
      // Xử lý lỗi: Hiển thị thông báo cho người dùng
      dispatch(
        addMessagesToCurrentChat([
          {
            id: uuidv4(),
            conversationId: "temp",
            senderType: "LLM",
            content: "Rất tiếc, không thể tạo cuộc trò chuyện mới.",
            timestamp: new Date().toISOString(),
          },
        ])
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý việc gửi tin nhắn
  const handleSendMessage = async (msg: string) => {
    if (!msg.trim() || isLoading || !currentUser?.id) {
      return;
    }

    let conversationToUseId = currentConversationId;

    // Nếu chưa có conversationId, tạo cuộc trò chuyện mới
    if (!conversationToUseId) {
      const newConvId = await createNewConversation(currentUser.id, msg);
      if (newConvId) {
        conversationToUseId = newConvId;
      } else {
        return; // Không thể tạo cuộc trò chuyện mới, dừng lại
      }
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
    setIsLoading(true);

    try {
      const createMessageDto: CreateMessageDto = {
        conversationId: conversationToUseId,
        content: msg,
      };

      const response = await axios.post<MessageDto[]>(
        `${NEST_API_URL}/chat/new`,
        createMessageDto
      );
      console.log("response: ", response);

      const [receivedUserMessage, llmMessage] = response.data;
      console.log(response.data);

      const messagesToDispatch: MessageDto[] = [];
      messagesToDispatch.push({
        ...receivedUserMessage,
        timestamp: receivedUserMessage.timestamp,
      });
      messagesToDispatch.push({
        ...llmMessage,
        timestamp: llmMessage.timestamp,
      });

      // Cập nhật tin nhắn người dùng với ID thật và thêm tin nhắn LLM vào Redux store
      dispatch(addMessagesToCurrentChat(messagesToDispatch));

      // Lưu trữ tin nhắn vào Local Storage thông qua service
      // Lấy lại tin nhắn sau khi đã thêm vào Redux store để đảm bảo đồng bộ
      const updatedMessagesForLocalStorage = [
        ...currentMessages,
        ...messagesToDispatch,
      ];
      messageLocalStorageService.clearMessages(conversationToUseId); // Xóa cũ
      messageLocalStorageService.addMessages(
        conversationToUseId,
        updatedMessagesForLocalStorage
      ); // Lưu mới

      // Cập nhật lastUpdated của cuộc trò chuyện trong localStorage
      if (currentConversationMeta) {
        const updatedConversationMeta = {
          ...currentConversationMeta,
          lastUpdated: new Date().toISOString(),
        };
        conversationLocalStorageService.saveConversation(
          updatedConversationMeta
        );
        // Cập nhật Redux store để Sidebar có thể re-render với thông tin mới
        dispatch(updateCurrentConversationMeta(updatedConversationMeta));
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
