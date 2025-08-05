import { configureStore } from "@reduxjs/toolkit";
import { conversationApi } from "@/store/api/conversationApi";
import { messageApi } from "@/store/api/messageApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [conversationApi.reducerPath]: conversationApi.reducer,
      [messageApi.reducerPath]: messageApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(conversationApi.middleware)
        .concat(messageApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
