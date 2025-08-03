import { configureStore } from "@reduxjs/toolkit";
import { conversationApi } from "@/store/api/conversationApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [conversationApi.reducerPath]: conversationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(conversationApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
