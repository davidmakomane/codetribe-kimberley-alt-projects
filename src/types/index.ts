
export type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  cellNumber: string;
};

export type ShoppingList = {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  shareToken?: string;
};

export type ShoppingItem = {
  id: string;
  listId: string;
  userId: string;
  name: string;
  quantity: number;
  category: string;
  notes: string;
  image?: string;
  purchased: boolean;
  createdAt: string;
};

export type Notification = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};
