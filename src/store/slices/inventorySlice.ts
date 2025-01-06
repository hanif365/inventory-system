import { StateCreator } from "zustand";
import { InventoryItem, UpdateInventoryItem } from "@/types/inventory";
import { produce } from "immer";

export interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
}

export interface InventoryActions {
  fetchInventory: () => Promise<void>;
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (
    id: number,
    updates: UpdateInventoryItem
  ) => Promise<void>;
  deleteInventoryItem: (id: number) => Promise<void>;
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

  updateInventoryItem: async (id, updates) => {
    // const currentState = get();

    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update item");

      set(
        produce((state) => {
          const itemIndex = state.items.findIndex(
            (item: InventoryItem) => item.id === id
          );
          if (itemIndex !== -1) {
            state.items[itemIndex] = {
              ...state.items[itemIndex],
              ...updates,
              updated_at: new Date().toISOString(),
            };
          }
        })
      );
    } catch (error) {
      console.error("Error updating item:", error);
      set(
        produce((state) => {
          state.error = "Failed to update item";
        })
      );
    }
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

  deleteInventoryItem: async (id) => {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete item");

      set(
        produce((state) => {
          state.items = state.items.filter(
            (item: InventoryItem) => item.id !== id
          );
        })
      );
    } catch (error) {
      console.error("Error deleting item:", error);
      set(
        produce((state) => {
          state.error = "Failed to delete item";
        })
      );
    }
  },
});
