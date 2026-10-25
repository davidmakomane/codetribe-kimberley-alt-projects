
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ShoppingList } from "../../types";
import { apiUrl } from "../../services/api";

const API_URL = apiUrl("shoppingLists");

type ListsState = {
  lists: ShoppingList[];
  loading: boolean;
  error: string | null;
};

type CreateListInput = {
  userId: string;
  name: string;
  description: string;
  category: string;
};

type UpdateListInput = {
  id: string;
  name: string;
  description: string;
  category: string;
  shareToken?: string;
};

const initialState: ListsState = {
  lists: [],
  loading: false,
  error: null,
};

async function checkResponse(response: Response) {
  if (!response.ok) {
    throw new Error("The request failed. Please try again.");
  }
  return response;
}

// READ: load a user's lists from JSON Server
export const fetchLists = createAsyncThunk(
  "shoppingLists/fetchLists",
  async (userId: string) => {
    const response = await fetch(
      `${API_URL}?userId=${encodeURIComponent(userId)}`
    );
    await checkResponse(response);
    return (await response.json()) as ShoppingList[];
  }
);

// CREATE: save a new list
export const createList = createAsyncThunk(
  "shoppingLists/createList",
  async (input: CreateListInput) => {
    const now = new Date().toISOString();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        name: input.name.trim(),
        description: input.description.trim(),
        category: input.category,
        createdAt: now,
        updatedAt: now,
      }),
    });

    await checkResponse(response);
    return (await response.json()) as ShoppingList;
  }
);

// UPDATE: edit a list
export const updateList = createAsyncThunk(
  "shoppingLists/updateList",
  async (input: UpdateListInput) => {
    const response = await fetch(`${API_URL}/${encodeURIComponent(input.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name.trim(),
        description: input.description.trim(),
        category: input.category,
        ...(input.shareToken ? { shareToken: input.shareToken } : {}),
        updatedAt: new Date().toISOString(),
      }),
    });

    await checkResponse(response);
    return (await response.json()) as ShoppingList;
  }
);

// DELETE: remove a list
export const deleteList = createAsyncThunk(
  "shoppingLists/deleteList",
  async (id: string) => {
    const itemsResponse = await fetch(`${apiUrl("items")}?listId=${encodeURIComponent(id)}`);
    await checkResponse(itemsResponse);
    const items = (await itemsResponse.json()) as Array<{ id: string }>;
    await Promise.all(items.map(async (item) => {
      const response = await fetch(apiUrl("items", item.id), { method: "DELETE" });
      await checkResponse(response);
    }));
    const response = await fetch(apiUrl("shoppingLists", id), { method: "DELETE" });
    await checkResponse(response);
    return id;
  }
);

const shoppingListsSlice = createSlice({
  name: "shoppingLists",
  initialState,
  reducers: {
    clearLists(state) {
      state.lists = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Could not load lists.";
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.lists.unshift(action.payload);
        state.error = null;
      })
      .addCase(createList.rejected, (state, action) => {
        state.error = action.error.message ?? "Could not create list.";
      })
      .addCase(updateList.fulfilled, (state, action) => {
        const index = state.lists.findIndex(
          (list) => list.id === action.payload.id
        );
        if (index !== -1) state.lists[index] = action.payload;
        state.error = null;
      })
      .addCase(updateList.rejected, (state, action) => {
        state.error = action.error.message ?? "Could not update list.";
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        state.lists = state.lists.filter(
          (list) => list.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.error = action.error.message ?? "Could not delete list.";
      });
  },
});

export const { clearLists } = shoppingListsSlice.actions;
export default shoppingListsSlice.reducer;
