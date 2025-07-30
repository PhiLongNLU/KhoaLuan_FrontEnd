interface Conversation {
  id: string;
  userId: string;
  title: string;
  modelId: string;
  createdAt: Date;
  lastUpdated: Date;
}

export default Conversation;
