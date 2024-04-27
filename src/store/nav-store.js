import {create} from 'zustand';
import Cookies from 'js-cookie';

export const useStore = create((set) => ({
  headingText: 'User Details',
  isNavbarOpen: false,
  
  setHeadingText: (text) => set({ headingText: text }),
  toggleNavbar: () => set((state) => ({ isNavbarOpen: !state.isNavbarOpen })),
}));

export const useAuthStore =create((set)=>({
  isLoggedIn: false,
  setLoggedIn: (LoggedIn)=>set({isLoggedIn: LoggedIn}),
  user: null,
  setUser: (user)=>set({user}),
  setAuthCookie: (token, expirationDate)=>{
    Cookies.set('auth_token', token, {expires: expirationDate})
  },
  clearAuthCookies:()=>{
    Cookies.remove('auth_token');
  }
  
}));

export const useNewProductStore = create((set)=>({
product: null,
setproduct: (product)=>set({product})

}));