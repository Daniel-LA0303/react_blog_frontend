import { create } from "zustand";

const useConversation = create((set) => ({

  // states 

  // state conversation
  selectedConversation: null, // conversation selected
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }), // set selected conversation

  // state messgaes
  messages: [], // messages
  setMessage: (messages) => set({ messages }), // set messages

}));


export default useConversation;
