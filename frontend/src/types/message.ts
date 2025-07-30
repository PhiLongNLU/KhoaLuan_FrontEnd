interface Message {
  id: string;
  conversationId: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default Message;
