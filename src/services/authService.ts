
import { apiUrl } from "./api";
import { hashPassword, verifyPassword } from "./passwordService";

const API_URL = apiUrl("users");

export type NewUser = {
  name: string;
  surname: string;
  email: string;
  cellNumber: string;
  passwordHash: string;
  passwordSalt: string;
};

export async function registerUser(user: NewUser) {
  // Check whether the email is already registered.
  const response = await fetch(
    `${API_URL}?email=${encodeURIComponent(user.email)}`
  );

  if (!response.ok) {
    throw new Error("Could not check the email address.");
  }

  const existingUsers = await response.json();

  if (existingUsers.length > 0) {
    throw new Error("This email address is already registered.");
  }

  // Save the new user.
  const createResponse = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!createResponse.ok) {
    throw new Error("Registration failed. Please try again.");
  }

  return createResponse.json();
}

export async function updateUserProfile(user: Pick<SavedUser, "id" | "name" | "surname" | "email" | "cellNumber">) {
  const duplicateResponse = await fetch(`${API_URL}?email=${encodeURIComponent(user.email)}`);
  if (!duplicateResponse.ok) throw new Error("Could not verify the email address.");
  const matches = (await duplicateResponse.json()) as SavedUser[];
  if (matches.some((match) => match.id !== user.id)) throw new Error("This email address is already registered.");

  const response = await fetch(`${API_URL}/${encodeURIComponent(user.id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: user.name, surname: user.surname, email: user.email, cellNumber: user.cellNumber }),
  });
  if (!response.ok) throw new Error("Could not save your profile.");
  return response.json() as Promise<SavedUser>;
}

export async function updateUserPassword(userId: string, currentPassword: string, newPassword: string) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(userId)}`);
  if (!response.ok) throw new Error("Could not load the account.");
  const user = (await response.json()) as SavedUser;
  if (!(await verifyPassword(currentPassword, user.passwordSalt, user.passwordHash))) {
    throw new Error("Current password is incorrect.");
  }
  const hashedPassword = await hashPassword(newPassword);
  const updateResponse = await fetch(`${API_URL}/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hashedPassword),
  });
  if (!updateResponse.ok) throw new Error("Could not update your password.");
}


export type SavedUser = {
  id: string;
  name: string;
  surname: string;
  email: string;
  cellNumber: string;
  passwordHash: string;
  passwordSalt: string;
};

export async function loginUser(email: string, password: string) {
  const response = await fetch(
    `${API_URL}?email=${encodeURIComponent(email.trim().toLowerCase())}`
  );

  if (!response.ok) {
    throw new Error("Could not contact the server.");
  }

  const users: SavedUser[] = await response.json();
  const user = users[0];

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isValid = await verifyPassword(
    password,
    user.passwordSalt,
    user.passwordHash
  );

  if (!isValid) {
    throw new Error("Invalid email or password.");
  }

  return user;
}
