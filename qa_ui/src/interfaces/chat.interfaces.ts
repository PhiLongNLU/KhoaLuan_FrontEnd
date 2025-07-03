// src/interfaces/chat.interfaces.ts

export interface UserDto {
  userId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  senderType: 'User' | 'LLM';
  content: string;
  timestamp: Date;
}

export interface CreateMessageDto {
  conversationId: string;
  content: string;
}

export interface ConversationDto {
  id: string;
  userId: string;
  title: string;
  messages: MessageDto[]; // Lưu ý: Chúng ta sẽ không lưu messages trực tiếp trong ConversationDto khi serialize
  createdAt: Date;
  lastUpdated: Date;
}

export interface CreateConversationDto {
  title?: string;
}

// Interface để lưu Conversation Meta-data (không có messages bên trong)
export interface ConversationMetaDto {
    id: string;
    userId: string;
    title: string;
    createdAt: Date;
    lastUpdated: Date;
}