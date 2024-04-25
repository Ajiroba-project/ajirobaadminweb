import {create} from 'zustand';

export const useStore = create((set) => ({
  headingText: 'User Details',
  isNavbarOpen: false,
  setHeadingText: (text) => set({ headingText: text }),
  toggleNavbar: () => set((state) => ({ isNavbarOpen: !state.isNavbarOpen })),
}));



export const useAuthStore =create((set)=>({
  isLoggedIn: false,
  setLoggedIn: (loggedIn)=>set({isLoggedIn: !isLoggedIn}),
  user: null,
  setUser:(user)=>set({user}),
  
}));