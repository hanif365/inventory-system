import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { InventorySlice, createInventorySlice } from './slices/inventorySlice';

export type StoreState = InventorySlice;

export const useInventoryStore = create<StoreState>()(
  devtools(
    persist(
      (...a) => ({
        ...createInventorySlice(...a)
      }),
      {
        name: 'inventory-storage'
      }
    ),
    {
      name: 'inventory-store'
    }
  )
);