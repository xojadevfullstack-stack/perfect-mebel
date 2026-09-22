import type { Context, SessionFlavor } from "grammy";
import type { Conversation, ConversationFlavor } from "@grammyjs/conversations";

export interface SessionData {
  language?: "uz" | "ru" | "en";
  currentCategory?: string;
  currentPage?: number;
}

export type MyContext = Context & ConversationFlavor & SessionFlavor<SessionData>;

export type MyConversation = Conversation<MyContext>;

export interface ApplyItemContext {
  type: "product" | "collection" | "general";
  id?: string;
  title: string;
  details?: string;
  images?: string[];
}
