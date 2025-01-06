"use client";

import { useEffect, useReducer } from "react";
import { useInventoryStore } from "@/store/store";
import { UpdateInventoryItem } from "@/types/inventory";

type State = {
  editingId: number | null;
  editForm: UpdateInventoryItem;
};

type Action =
  | { type: "SET_EDITING"; id: number; form: UpdateInventoryItem }
  | { type: "UPDATE_FORM"; updates: Partial<UpdateInventoryItem> }
  | { type: "RESET" };

const initialState: State = {
  editingId: null,
  editForm: {},
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_EDITING":
      return {
        editingId: action.id,
        editForm: action.form,
      };
    case "UPDATE_FORM":
      return {
        ...state,
        editForm: { ...state.editForm, ...action.updates },
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function InventoryList() {
  const {
    items,
    fetchInventory,
    updateInventoryItem,
    deleteInventoryItem,
  } = useInventoryStore();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleEdit = (id: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      dispatch({
        type: "SET_EDITING",
        id,
        form: {
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
        },
      });
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateInventoryItem(id, state.editForm);
      dispatch({ type: "RESET" });
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleCancel = () => {
    dispatch({ type: "RESET" });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteInventoryItem(id);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Inventory Items</h2>
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow">
            {state.editingId === item.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={state.editForm.name ?? ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FORM",
                      updates: { name: e.target.value },
                    })
                  }
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={state.editForm.description ?? ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FORM",
                      updates: { description: e.target.value },
                    })
                  }
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={state.editForm.quantity ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      dispatch({
                        type: "UPDATE_FORM",
                        updates: {
                          quantity: value === "" ? null : Number(value),
                        },
                      });
                    }
                  }}
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={state.editForm.price ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      dispatch({
                        type: "UPDATE_FORM",
                        updates: { price: value === "" ? null : Number(value) },
                      });
                    }
                  }}
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
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
