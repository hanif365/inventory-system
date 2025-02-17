export interface InventoryItem {
  id: number;
  name: string;
  description: string;
  quantity: number | null;
  price: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateInventoryItem = Omit<
  InventoryItem,
  "id" | "created_at" | "updated_at"
>;

export type UpdateInventoryItem = Partial<Omit<CreateInventoryItem, 'name'>>;
