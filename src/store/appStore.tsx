import { create } from "zustand";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  date: string;
}

interface Store {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  rows: Product[];
  setRows: (rows: Product[]) => void;
}

const useAppStore = create<Store>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  rows: [],
  setRows: (rows) => set({ rows }),
}));

export default useAppStore;
