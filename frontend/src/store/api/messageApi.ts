import { Message, MessageSimple } from "@/types/message";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { create } from "domain";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    /**
     * Get message ids in conversation
     */
    getMessageIds: builder.query<string[], string>({
      query: (conversationId) => ({
        url: `/messages/conversation/${conversationId}/ids`,
        method: "GET",
      }),
      providesTags: ["Message"],
      transformResponse: (response: any) => {
        return response.data;
      },
    }),

    /**
     * Get messages in conversation
     */
    getMessages: builder.query<Message[], string>({
      query: (conversationId) => ({
        url: `/messages/conversation/${conversationId}`,
        method: "GET",
      }),
      providesTags: ["Message"],
      transformResponse: (response: any) => {
        return response.data.map((msg: any) => ({
          id: msg.id,
          conversationId: msg.conversation,
          role: msg.sender_type === "User" ? "user" : "ai",
          content: msg.content,
          createdAt: new Date(msg.created_at),
        }));
      },
    }),

    getMessage: builder.query<Message, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: "GET",
      }),
      providesTags: ["Message"],
      transformResponse: (response: any) => {
        const msg = response.data;
        return {
          id: msg.id,
          conversationId: msg.conversation,
          role: msg.sender_type === "User" ? "user" : "ai",
          content: msg.content,
          createdAt: new Date(msg.created_at),
        };
      },
    }),

    createMessage: builder.mutation<Message, MessageSimple>({
      query: (body) => ({
        url: "/messages/",
        method: "POST",
        body: {
          conversation_id: body.conversationId,
          sender_type: body.role === "user" ? "User" : "Bot",
          content: body.content,
        },
      }),
      invalidatesTags: ["Message"],
      transformResponse: (response: any) => {
        const msg = response.data;
        return {
          id: msg.id,
          conversationId: msg.conversation,
          role: msg.sender_type === "User" ? "user" : "ai",
          content: msg.content,
          createdAt: new Date(msg.created_at),
        };
      },
    }),

    deleteMessage: builder.mutation<void, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});

export const {
  useGetMessageIdsQuery,
  useGetMessagesQuery,
  useCreateMessageMutation,
  useDeleteMessageMutation,
  useGetMessageQuery,
} = messageApi;
