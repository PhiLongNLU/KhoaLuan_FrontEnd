import axiosInstance from "@/lib/api";
import { ConversationSimple } from "@/types/conversation";

class ConversationService {
  private static instance: ConversationService;

  public static getInstance() {
    if (!ConversationService.instance)
      ConversationService.instance = new ConversationService();
    return ConversationService.instance;
  }

  public getConversations = async (): Promise<ConversationSimple[]> => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      try {
        const response = await axiosInstance.get("/conversations/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.data;
      } catch (error: any) {
        console.error(error);
      }
      return [];
    } else {
      throw new Error("No token found");
    }
  };

  public createConversation = async (): Promise<ConversationSimple> => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      try {
        const response = await axiosInstance.post(
          "/conversations/",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return {
          id: response.data.data.id,
          title: response.data.data.title,
        };
      } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
      }
    } else {
      throw new Error("No token found");
    }
  };
}

export default ConversationService;
