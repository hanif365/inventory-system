import { StateCreator } from "zustand";
import { InventoryItem } from "@/types/inventory";
import { produce } from "immer";

export interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
}

export interface InventoryActions {
  fetchInventory: () => Promise<void>;
  addInventoryItem: (item: InventoryItem) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export type InventorySlice = InventoryState & InventoryActions;

export const createInventorySlice: StateCreator<InventorySlice> = (
  set,
  get
) => ({
  // Initial state
  items: [],
  loading: false,
  error: null,

  // Actions
  fetchInventory: async () => {
    if (get().loading) return;

    set(
      produce((state) => {
        state.loading = true;
        state.error = null;
      })
    );
    try {
      const response = await fetch("/api/inventory");
      const result = await response.json();
      set(
        produce((state) => {
          state.items = result.data;
          state.loading = false;
        })
      );
    } catch (error) {
      console.error("Error fetching inventory:", error);
      set(
        produce((state) => {
          state.error = "Failed to fetch inventory items";
          state.loading = false;
        })
      );
    }
  },

  addInventoryItem: (item) => {
    set(
      produce((state) => {
        state.items = [item, ...state.items];
      })
    );
  },

  setError: (error) =>
    set(
      produce((state) => {
        state.error = error;
      })
    ),
  setLoading: (loading) =>
    set(
      produce((state) => {
        state.loading = loading;
      })
    ),
});
