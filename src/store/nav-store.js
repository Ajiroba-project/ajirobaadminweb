import {create} from 'zustand';
import Cookies from 'js-cookie';

export const useStore = create((set) => ({
  headingText: 'User Details',
  isNavbarOpen: false,
  
  setHeadingText: (text) => set({ headingText: text }),
  toggleNavbar: () => set((state) => ({ isNavbarOpen: !state.isNavbarOpen })),
}));

export const useAuthStore = create((set, get) => ({
  isLoggedIn: !!Cookies.get('token'), // Check if auth_token cookie exists on initialization
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),

  user: null,
  setUser: (user) => set({ user }),
  
  setAuthCookie: (token, expirationDate) => {
    Cookies.set('token', token, {
      expires: expirationDate,
      sameSite: 'strict', // Additional security measure
    });
    set({ isLoggedIn: true }); // Update isLoggedIn state
  },
  clearAuthCookies: () => {
    Cookies.remove('token');
    set({ isLoggedIn: false, user: null }); // Update isLoggedIn and user state
  },
}));

export const useNewProductStore = create((set)=>({
product: null,
setproduct: (product)=>set({product})

}));