"use client";

import { useEffect } from 'react';
import { useInventoryStore } from '@/store/store';

export function InventoryList() {
  const { items, loading, error, fetchInventory } = useInventoryStore();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Inventory Items</h2>
      <div className="grid gap-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="border p-4 rounded-lg shadow"
          >
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-gray-600">{item.description}</p>
            <div className="mt-2 flex justify-between">
              <span>Quantity: {item.quantity}</span>
              <span>Price: ${Number(item.price).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}