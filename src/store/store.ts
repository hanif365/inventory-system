import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { InventorySlice, createInventorySlice } from './slices/inventorySlice';

export type StoreState = InventorySlice;

export const useInventoryStore = create<StoreState>()(
  devtools(
    (...a) => ({
      ...createInventorySlice(...a)
    }),
    {
      name: 'inventory-store'
    }
  )
);