
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ShoppingItem } from "../../types";
import { apiUrl } from "../../services/api";

const API_URL = apiUrl("items");

type ItemsState = {
  items: ShoppingItem[];
  loading: boolean;
  error: string | null;
};

type CreateItemInput = {
  listId: string;
  userId: string;
  name: string;
  quantity: number;
  category: string;
  notes: string;
  image?: string;
};

type UpdateItemInput = {
  id: string;
  name: string;
  quantity: number;
  category: string;
  notes: string;
  image?: string;
  purchased: boolean;
};

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
};

async function checkResponse(response: Response) {
  if (!response.ok) {
    throw new Error("The request failed. Please try again.");
  }
  return response;
}

export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async (listId: string) => {
    const response = await fetch(
      `${API_URL}?listId=${encodeURIComponent(listId)}`,
    );
    await checkResponse(response);
    return (await response.json()) as ShoppingItem[];
  },
);

export const createItem = createAsyncThunk(
  "items/createItem",
  async (input: CreateItemInput) => {
    const now = new Date().toISOString();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        name: input.name.trim(),
        notes: input.notes.trim(),
        image: input.image?.trim() || "",
        purchased: false,
        createdAt: now,
      }),
    });

    await checkResponse(response);
    return (await response.json()) as ShoppingItem;
  },
);

export const updateItem = createAsyncThunk(
  "items/updateItem",
  async (input: UpdateItemInput) => {
    const { id, ...changes } = input;

    const response = await fetch(apiUrl("items", id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...changes,
        name: changes.name.trim(),
        notes: changes.notes.trim(),
        image: changes.image?.trim() || "",
      }),
    });

    await checkResponse(response);
    return (await response.json()) as ShoppingItem;
  },
);

export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async (id: string) => {
    const response = await fetch(apiUrl("items", id), {
      method: "DELETE",
    });

    await checkResponse(response);
    return id;
  },
);

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    clearItems(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Could not load items.";
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createItem.rejected, (state, action) => {
        state.error = action.error.message ?? "Could not add item.";
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.error = action.error.message ?? "Could not update item.";
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.id !== action.payload,
        );
        state.error = null;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.error = action.error.message ?? "Could not delete item.";
      });
  },
});

export const { clearItems } = itemsSlice.actions;
export default itemsSlice.reducer;
