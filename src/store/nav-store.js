import {create} from 'zustand';

const useStore = create((set) => ({
  headingText: 'User Details',
  isNavbarOpen: false,
  setHeadingText: (text) => set({ headingText: text }),
  toggleNavbar: () => set((state) => ({ isNavbarOpen: !state.isNavbarOpen })),
}));

export default useStore