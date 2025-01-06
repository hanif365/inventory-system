"use client";

import { useState, useEffect } from "react";
import { useInventoryStore } from "@/store/store";
import { UpdateInventoryItem } from "@/types/inventory";

export function InventoryList() {
  const { items, loading, error, fetchInventory, updateInventoryItem } =
    useInventoryStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<UpdateInventoryItem>({});

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleEdit = (id: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      setEditForm({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      });
      setEditingId(id);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateInventoryItem(id, editForm);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Inventory Items</h2>
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow">
            {editingId === item.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editForm.name ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={editForm.description ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  type="number"
                  value={editForm.quantity ?? ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      quantity: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  type="number"
                  value={editForm.price ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: Number(e.target.value) })
                  }
                  className="w-full border rounded px-2 py-1"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(item.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <div className="mt-2 flex justify-between">
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: ${Number(item.price)}</span>
                </div>
                <button
                  onClick={() => handleEdit(item.id)}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
