import { create } from "zustand";

export type Message = any; // replace later with real backend type

// useConversation.ts
type ConversationStore = {
  selectedConversation: any | null;
  setSelectedConversation: (selectedConversation: any | null) => void;

  conversations: any[];                              // ✅ add
  setConversations: (c: any[]) => void;              // ✅ add
  prependConversation: (c: any) => void;             // ✅ add

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
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

  conversations: [],                                 // ✅
  setConversations: (conversations) => set({ conversations }),
  prependConversation: (conversation) =>             // ✅
    set((state) => {
      const exists = state.conversations.find(c => c._id === conversation._id)
      if (exists) return state
      return { conversations: [conversation, ...state.conversations] }
    }),

  messages: [],
  setMessage: (messages) => set({ messages }),
  messagePage: 1,
  setMessagePage: (messagePage) => set({ messagePage }),
  hasMoreMessages: true,
  setHasMoreMessages: (hasMoreMessages) => set({ hasMoreMessages }),
  prependMessages: (newMessages) =>
    set((state) => ({ messages: [...newMessages, ...state.messages] })),
}));
export default useConversation;