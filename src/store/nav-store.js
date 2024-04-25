import {create} from 'zustand';

export const useStore = create((set) => ({
  headingText: 'User Details',
  isNavbarOpen: false,
  setHeadingText: (text) => set({ headingText: text }),
  toggleNavbar: () => set((state) => ({ isNavbarOpen: !state.isNavbarOpen })),
}));

// interface MutationStore {
//   mutationData: any;
//   setMutationData: (data: any) => void;
// }

export const useMutationStore = create((set) => ({
  mutationData: null,
  setMutationData: (data) => set({ mutationData: data }),
}));