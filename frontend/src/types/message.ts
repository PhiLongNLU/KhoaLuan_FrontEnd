export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "ai";
  content: string;
  createdAt: Date;
}

export interface MessageSimple {
  conversationId: string,
  role: "user" | "ai",
  content: string,
}
