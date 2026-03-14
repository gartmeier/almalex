import type { Message } from "~/types/messages";

export type Chat = {
  id: string;
  messages: Message[];
  createdAt: string;
};

const STORAGE_KEY = "almalex_chats";

function getStorage(): Record<string, Chat> {
  try {
    let data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function setStorage(chats: Record<string, Chat>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error("Failed to save chats:", error);
  }
}

export function saveChat(chat: Chat) {
  let chats = getStorage();
  chats[chat.id] = chat;
  setStorage(chats);
}

export function loadChat(chatId: string): Chat | null {
  let chats = getStorage();
  return chats[chatId] || null;
}

export function deleteChat(chatId: string) {
  let chats = getStorage();
  delete chats[chatId];
  setStorage(chats);
}

export function listChats(): Chat[] {
  let chats = getStorage();
  return Object.values(chats).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
