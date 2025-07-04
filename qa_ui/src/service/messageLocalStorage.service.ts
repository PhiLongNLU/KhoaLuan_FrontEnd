import { MessageDto } from "../interfaces/chat.interfaces";

// Hàm helper để tạo key duy nhất cho từng cuộc trò chuyện
const getMessagesKey = (conversationId: string) =>
  `chat_messages_${conversationId}`;

class MessageLocalStorageService {
  /**
   * Lấy tất cả tin nhắn cho một cuộc trò chuyện cụ thể.
   * @param conversationId ID của cuộc trò chuyện.
   * @returns Mảng các MessageDto.
   */
  getMessages(conversationId: string): MessageDto[] {
    try {
      const storedData = localStorage.getItem(getMessagesKey(conversationId));
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error(
        `Lỗi khi tải tin nhắn cho cuộc trò chuyện ${conversationId} từ localStorage:`,
        error
      );
    }
    return [];
  }

  /**
   * Thêm một hoặc nhiều tin nhắn mới vào cuộc trò chuyện.
   * @param conversationId ID của cuộc trò chuyện.
   * @param newMessages Mảng các MessageDto cần thêm.
   */
  addMessages(conversationId: string, newMessages: MessageDto[]): void {
    try {
      const currentMessages = this.getMessages(conversationId);
      const updatedMessages = [...currentMessages, ...newMessages];
      localStorage.setItem(
        getMessagesKey(conversationId),
        JSON.stringify(updatedMessages)
      );
    } catch (error) {
      console.error(
        `Lỗi khi thêm tin nhắn vào cuộc trò chuyện ${conversationId} trong localStorage:`,
        error
      );
    }
  }

  /**
   * Xóa tất cả tin nhắn của một cuộc trò chuyện.
   * (Thường được gọi khi cuộc trò chuyện bị xóa)
   * @param conversationId ID của cuộc trò chuyện.
   */
  clearMessages(conversationId: string): void {
    try {
      localStorage.removeItem(getMessagesKey(conversationId));
    } catch (error) {
      console.error(
        `Lỗi khi xóa tin nhắn cho cuộc trò chuyện ${conversationId} từ localStorage:`,
        error
      );
    }
  }
}

export const messageLocalStorageService = new MessageLocalStorageService();
