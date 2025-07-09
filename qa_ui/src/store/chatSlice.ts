import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageDto, ConversationMetaDto } from "../interfaces/chat.interfaces";

interface ChatState {
  currentConversationId: string | null;
  currentMessages: MessageDto[];
  currentConversationMeta: ConversationMetaDto | null;
  conversationsUpdatedFlag: number;
}

const initialState: ChatState = {
  currentConversationId: null,
  currentMessages: [],
  currentConversationMeta: null,
  conversationsUpdatedFlag: 0,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentConversation: (
      state,
      action: PayloadAction<{
        conversationMeta: ConversationMetaDto;
        messages: MessageDto[];
      } | null>
    ) => {
      if (action.payload) {
        state.currentConversationMeta = action.payload.conversationMeta;
        state.currentConversationId = action.payload.conversationMeta.id;
        state.currentMessages = action.payload.messages;
      } else {
        // Đặt lại trạng thái khi không có cuộc trò chuyện nào được chọn
        state.currentConversationMeta = null;
        state.currentConversationId = null;
        state.currentMessages = [];
      }
    },
    addMessagesToCurrentChat: (state, action: PayloadAction<MessageDto[]>) => {
      state.currentMessages.push(...action.payload);
    },
    // Action để cập nhật metadata của cuộc trò chuyện hiện tại (ví dụ: lastUpdated, title)
    updateCurrentConversationMeta: (
      state,
      action: PayloadAction<ConversationMetaDto>
    ) => {
      if (state.currentConversationMeta?.id === action.payload.id) {
        state.currentConversationMeta = action.payload;
      }
    },
    clearCurrentChat: (state) => {
      state.currentConversationMeta = null;
      state.currentConversationId = null;
      state.currentMessages = [];
    },
    trigglerConversationsReload: (state) => {
      state.conversationsUpdatedFlag += 1;
    },
  },
});

export const {
  setCurrentConversation,
  addMessagesToCurrentChat,
  updateCurrentConversationMeta,
  clearCurrentChat,
  trigglerConversationsReload,
} = chatSlice.actions;

export default chatSlice.reducer;
