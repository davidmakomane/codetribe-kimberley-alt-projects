
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "../../types";

type UiState = {
  loading: boolean;
  notifications: Notification[];
};

const initialState: UiState = {
  loading: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.push(action.payload);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

export const { setLoading, addNotification, removeNotification } =
  uiSlice.actions;

export default uiSlice.reducer;
