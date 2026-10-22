
const API_URL = "http://localhost:3001/users";

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


import { verifyPassword } from "./passwordService";

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
