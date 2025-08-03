import { ConversationSimple } from "@/types/conversation";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const conversationApi = createApi({
  reducerPath: "conversationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    prepareHeaders: (headers, { getState }) => {
      const token = sessionStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Conversation"],
  endpoints: (builder) => ({
    getConversations: builder.query<ConversationSimple[], void>({
      query: () => "/conversations/",
      providesTags: ["Conversation"],
      transformResponse: (response: any) => {
        const raw: {
          _id: string;
          title: string;
        }[] = response.data || [];

        return raw.map((c) => ({
          id: c._id?.toString() ?? "",
          title: c.title,
        }));
      },
    }),
    createConversation: builder.mutation<
      ConversationSimple,
      { title?: string }
    >({
      query: (body) => ({
        url: "/conversations/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Conversation"],
      transformResponse: (response: any) => {
        return response.data;
      },
    }),
    deleteConversation: builder.mutation<void, string>({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Conversation"],
    }),
    renameConversation: builder.mutation<
      ConversationSimple,
      { conversationId: string; title: string }
    >({
      query: ({ conversationId, title }) => ({
        url: `/conversations/${conversationId}`,
        method: "PUT",
        body: { title },
      }),
      invalidatesTags: ["Conversation"],
      transformErrorResponse: (response: any) => {
        return response.data;
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useDeleteConversationMutation,
  useRenameConversationMutation,
} = conversationApi;
