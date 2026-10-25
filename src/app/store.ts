
import { configureStore } from "@reduxjs/toolkit";
import itemsReducer from "../features/items/itemsSlice";
import authReducer from "../features/auth/authSlice";
import uiReducer from "../features/ui/uiSlice";

import shoppingListsReducer from "../features/shoppingLists/shoppingListsSlice";


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shoppingLists: shoppingListsReducer,
    ui: uiReducer,
    items: itemsReducer,
  },
});
