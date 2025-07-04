import { ConversationMetaDto } from "../interfaces/chat.interfaces";

const CONVERSATIONS_KEY = "chat_conversations_meta";

class ConversationLocalStorageService {
  /**
   * Lấy tất cả siêu dữ liệu cuộc trò chuyện của người dùng.
   * @param userId ID của người dùng.
   * @returns Mảng các ConversationMetaDto.
   */
  getConversations(userId: string): ConversationMetaDto[] {
    try {
      const storedData = localStorage.getItem(CONVERSATIONS_KEY);
      if (storedData) {
        const allConversations: ConversationMetaDto[] = JSON.parse(storedData);
        // Lọc theo userId nếu cần, hoặc giả định chỉ có một user
        return allConversations.filter((conv) => conv.userId === userId);
      }
    } catch (error) {
      console.error("Lỗi khi tải cuộc trò chuyện từ localStorage:", error);
    }
    return [];
  }

  /**
   * Thêm hoặc cập nhật siêu dữ liệu của một cuộc trò chuyện.
   * @param conversationMeta Siêu dữ liệu cuộc trò chuyện cần thêm/cập nhật.
   */
  saveConversation(conversationMeta: ConversationMetaDto): void {
    try {
      const allConversations = this.getConversations(conversationMeta.userId);
      const existingIndex = allConversations.findIndex(
        (c) => c.id === conversationMeta.id
      );

      if (existingIndex > -1) {
        // Cập nhật cuộc trò chuyện hiện có
        allConversations[existingIndex] = conversationMeta;
      } else {
        // Thêm cuộc trò chuyện mới vào đầu danh sách
        allConversations.unshift(conversationMeta);
      }
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(allConversations));
    } catch (error) {
      console.error("Lỗi khi lưu cuộc trò chuyện vào localStorage:", error);
    }
  }

  /**
   * Lấy một cuộc trò chuyện cụ thể bằng ID.
   * Lưu ý: Phương thức này chỉ lấy siêu dữ liệu. Tin nhắn được quản lý riêng.
   * @param userId ID của người dùng.
   * @param conversationId ID của cuộc trò chuyện.
   * @returns ConversationMetaDto hoặc null nếu không tìm thấy.
   */
  getConversationById(
    userId: string,
    conversationId: string
  ): ConversationMetaDto | null {
    const allConversations = this.getConversations(userId);
    return allConversations.find((conv) => conv.id === conversationId) || null;
  }

  /**
   * Xóa một cuộc trò chuyện và tất cả tin nhắn liên quan.
   * @param userId ID của người dùng.
   * @param conversationId ID của cuộc trò chuyện cần xóa.
   */
  deleteConversation(userId: string, conversationId: string): void {
    try {
      let allConversations = this.getConversations(userId);
      allConversations = allConversations.filter(
        (conv) => conv.id !== conversationId
      );
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(allConversations));

      // Cũng xóa các tin nhắn liên quan
      localStorage.removeItem(`chat_messages_${conversationId}`);
    } catch (error) {
      console.error("Lỗi khi xóa cuộc trò chuyện từ localStorage:", error);
    }
  }
}

export const conversationLocalStorageService =
  new ConversationLocalStorageService();
