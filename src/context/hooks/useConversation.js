import { create } from "zustand";

const useConversation = create((set, get) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  
  messages: [],
  setMessage: (messages) => set({ messages }),
  
  // Nuevos estados para paginación
  messagePage: 1,
  setMessagePage: (page) => set({ messagePage: page }),
  
  hasMoreMessages: true,
  setHasMoreMessages: (hasMore) => set({ hasMoreMessages: hasMore }),
  
  // Método para agregar mensajes al principio (mensajes más antiguos)
  prependMessages: (newMessages) => set((state) => ({
    messages: [...newMessages, ...state.messages]
  })),
}));
export default useConversation;
