
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";

type AuthState = {
  user: User | null;
};

function getSavedUser(): User | null {
  try {
    const savedUser = sessionStorage.getItem("currentUser");
    return savedUser ? (JSON.parse(savedUser) as User) : null;
  } catch {
    return null;
  }
}

const initialState: AuthState = {
  user: getSavedUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUser, clearUser, updateUser } = authSlice.actions;
export default authSlice.reducer;
