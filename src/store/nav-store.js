import { create } from 'zustand';
import Cookies from 'js-cookie';

export const useStore = create((set) => ({
  headingText: 'User Details',
  isNavbarOpen: false,
  setNavbarOpen: (value) => set({ isNavbarOpen: value }),
  subcategoryOpen: false,
  categoryOpen: false,
  createsubcategory: false,

  setHeadingText: (text) => set({ headingText: text }),
  toggleNavbar: () => set((state) => ({ isNavbarOpen: !state.isNavbarOpen })),
  toggleSubcategory: () => set((state) => ({ subcategoryOpen: !state.subcategoryOpen })),
  togglecategory: () => set((state) => ({ categoryOpen: !state.categoryOpen })),
  setCategoryOpen: (value) => set({ categoryOpen: value }),
  setCratesubcategory: (value) => set({ createsubcategory: value }),
}));



export const useCategoryButtonClickStore = create((set) => ({
  createCategory: false,
  categoryopen: false,
  createsubcategory: false,
  subcategoryopen: false,

  // Toggle createsubcategory based on createsubcategory state
  setCreatesubcategory: () => set(state => ({ createsubcategory: !state.createsubcategory })),

  // Set subcategoryopen directly
  setSubcategoryopen: (value) => set({ subcategoryopen: value }),

  // Set categoryopen directly
  setCategoryopen: (value) => set({ categoryopen: value }),

  // Toggle createCategory based on createCategory state
  setCreateCategory: () => set(state => ({ createCategory: !state.createCategory })),
}));






export const useAuthStore = create((set, get) => ({
  isLoggedIn: !!Cookies.get('token'), // Check if token cookie exists on initialization
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

export const useNewProductStore = create((set) => ({
  product: null,
  setproduct: (product) => set({ product })

}));