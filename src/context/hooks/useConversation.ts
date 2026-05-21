import { create } from "zustand";

export type Message = any; // replace later with real backend type

type ConversationStore = {
  selectedConversation: any | null;
  setSelectedConversation: (selectedConversation: any | null) => void;

  messages: Message[];
  setMessage: (messages: Message[]) => void;

  messagePage: number;
  setMessagePage: (page: number) => void;

  hasMoreMessages: boolean;
  setHasMoreMessages: (hasMore: boolean) => void;

  prependMessages: (newMessages: Message[]) => void;
};

const useConversation = create<ConversationStore>((set, get) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),

  messages: [],
  setMessage: (messages) => set({ messages }),

  messagePage: 1,
  setMessagePage: (messagePage) => set({ messagePage }),

  hasMoreMessages: true,
  setHasMoreMessages: (hasMoreMessages) => set({ hasMoreMessages }),

  prependMessages: (newMessages) =>
    set((state) => ({
      messages: [...newMessages, ...state.messages],
    })),
}));

export default useConversation;