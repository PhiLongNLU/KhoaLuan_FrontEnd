export interface Conversation {
  id: string;
  userId: string;
  title: string;
  modelId: string;
  createdAt: Date;
  lastUpdated: Date;
}

export interface ConversationSimple  {
  id: string;
  title: string;
}
