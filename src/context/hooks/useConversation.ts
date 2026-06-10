import { create } from "zustand";

export type Message = any; // replace later with real backend type

// useConversation.ts
type ConversationStore = {
  selectedConversation: any | null;
  setSelectedConversation: (selectedConversation: any | null) => void;

  sidebarOpen: boolean;
  setSidebarOpen: (setSidebarOpen: boolean | any) => void;

  conversations: any[];                              
  setConversations: (c: any[]) => void; 

  // reply a message
  replyTo: any | null;
  setReplyTo: (msg: any | null) => void;
               
  prependConversation: (c: any) => void;             

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

  sidebarOpen: false,
  setSidebarOpen: () => set((state) => ({sidebarOpen: !state.sidebarOpen})),

  conversations: [],                                
  setConversations: (conversations) => set({ conversations }),
  prependConversation: (conversation) =>            
    set((state) => {
      const exists = state.conversations.find(c => c._id === conversation._id)
      if (exists) return state
      return { conversations: [conversation, ...state.conversations] }
    }),

  // reply a message
  replyTo: null,
  setReplyTo: (replyTo) => set({ replyTo }),

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