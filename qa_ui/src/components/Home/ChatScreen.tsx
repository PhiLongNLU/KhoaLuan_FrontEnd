import React, { useEffect, useState } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import axios from "axios";
import { ConversationDto, CreateMessageDto, MessageDto } from "../../interfaces/chat.interfaces";

const ChatScreen: React.FC = () => {
  const NEST_API_URL = import.meta.env.VITE_NEST_API_URL;
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

  const [messages, setMessages] = useState<
    { text: string; isUser: boolean; id?: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeChat = async () => {
      const storedConversationId = localStorage.getItem(
        "currentConversationId"
      );

      if (storedConversationId) {
        const storedMessages = localStorage.getItem(
          `conversation_${storedConversationId}_messages`
        );
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
          setCurrentConversationId(storedConversationId);
        } else await createNewConversation();
      } else await createNewConversation();
    };

    initializeChat();
  }, []);

  const createNewConversation = async () => {
    try {
        const response = await axios.post<ConversationDto>(
          `${NEST_API_URL}/chat/new`
        );
      const newConversation = response.data;
      setCurrentConversationId(newConversation.id);
      localStorage.setItem("currentConversationId", newConversation.id);
      setMessages([
        {
          text: `Chào mừng bạn đến với cuộc trò chuyện mới! ID: ${newConversation.id}`,
          isUser: false,
        },
      ]);
      // Lưu trữ siêu dữ liệu cuộc trò chuyện (nếu cần)
      localStorage.setItem(`conversation_${newConversation.id}_meta`, JSON.stringify(newConversation));
    } catch (error) {
      console.error("Lỗi khi tạo cuộc trò chuyện mới:", error);
      setMessages([
        { text: "Rất tiếc, không thể tạo cuộc trò chuyện mới.", isUser: false },
      ]);
    }
  };

  // Hàm xử lý việc gửi tin nhắn
  const handleSendMessage = async (msg: string) => {
    if (!msg.trim() || isLoading || !currentConversationId) {
      return; // Không gửi tin nhắn rỗng hoặc khi đang tải hoặc không có conversation ID
    }

    // Thêm tin nhắn của người dùng vào state ngay lập tức
    const userMessage = { text: msg, isUser: true, id: Date.now().toString() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true); // Đặt trạng thái đang tải

    try {
      const createMessageDto: CreateMessageDto = {
        conversationId: currentConversationId,
        content: msg,
      };

      const response = await axios.post<MessageDto[]>(
        `${NEST_API_URL}/chat/message`,
        createMessageDto
      );

      const [receivedUserMessage, llmMessage] = response.data;

      setMessages((prevMessages) => {
        // Tìm và cập nhật tin nhắn người dùng để đảm bảo có ID từ backend
        // Hoặc chỉ thêm tin nhắn LLM và tin nhắn user đã thêm trước đó là đủ
        const updatedMessages = prevMessages.map((m) =>
          m.text === userMessage.text && m.isUser && !m.id
            ? { ...m, id: receivedUserMessage.id }
            : m
        );
        return [
          ...updatedMessages,
          { text: llmMessage.content, isUser: false, id: llmMessage.id },
        ];
      });

      // Lưu trữ tin nhắn vào Local Storage
      const updatedAllMessages = [
        ...messages,
        userMessage,
        { text: llmMessage.content, isUser: false, id: llmMessage.id },
      ];
      localStorage.setItem(
        `conversation_${currentConversationId}_messages`,
        JSON.stringify(updatedAllMessages)
      );
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Rất tiếc, có lỗi xảy ra khi xử lý tin nhắn của bạn.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false); // Kết thúc trạng thái đang tải
    }
  };

  return (
    <div className="w-3/4 h-screen bg-white flex flex-col items-center justify-center relative">
      <h1 className="text-3xl font-bold text-gray-700">Weather Dynamics</h1>
      <div className="w-[100%] max-w-7/10 h-[500px] flex flex-col overflow-y-auto">
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 mt-20">
            Bắt đầu cuộc trò chuyện mới!
          </div>
        )}
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg.text} isUser={msg.isUser} />
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
