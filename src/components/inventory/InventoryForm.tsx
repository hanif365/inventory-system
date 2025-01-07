"use client";

import { useRef, useReducer, useEffect, useState } from "react";
import { useInventoryStore } from "@/store/store";
import { CreateInventoryItem, InventoryItem } from "@/types/inventory";

type FormState = CreateInventoryItem & {
  imageFile: File | null;
};

type FormAction =
  | {
      type: "SET_FIELD";
      field: keyof CreateInventoryItem;
      value: string | number | null;
    }
  | { type: "SET_IMAGE"; file: File | null }
  | { type: "RESET" };

const initialState: FormState = {
  name: "",
  description: "",
  quantity: null,
  price: null,
  image_url: null,
  imageFile: null,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_IMAGE":
      return { ...state, imageFile: action.file };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function InventoryForm() {
  const { addInventoryItem, updateInventoryItem } = useInventoryStore();
  const [state, dispatch] = useReducer(formReducer, initialState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [isNewItem, setIsNewItem] = useState(true);

  useEffect(() => {
    // Fetch existing item names
    const fetchNames = async () => {
      try {
        const response = await fetch("/api/inventory");
        const result = await response.json();
        const names = result.data.map((item: InventoryItem) => item.name);
        setExistingNames(names);
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    };

    fetchNames();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = null;

      if (state.imageFile) {
        const formData = new FormData();
        formData.append("image", state.imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error("Failed to upload image");
        const imageData = await uploadResponse.json();
        imageUrl = imageData.url;
      }

      const response = await fetch("/api/inventory");
      const result = await response.json();
      const existingItem = result.data.find(
        (item: InventoryItem) =>
          item.name.toLowerCase() === state.name.toLowerCase()
      );

      if (existingItem) {
        const updatedItem = {
          description: state.description,
          price: state.price,
          quantity: (existingItem.quantity || 0) + (state.quantity || 0),
          image_url: imageUrl || existingItem.image_url,
        };

        await updateInventoryItem(existingItem.id, updatedItem);
      } else {
        const createResponse = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...state,
            image_url: imageUrl,
          }),
        });

        if (!createResponse.ok)
          throw new Error("Failed to create item in inventory");

        const createResult = await createResponse.json();
        addInventoryItem({
          ...state,
          id: createResult.data.id,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        setExistingNames((prev) => [...prev, state.name]);
      }

      dispatch({ type: "RESET" });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <div className="mt-1 space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="newItem"
              checked={isNewItem}
              onChange={() => setIsNewItem(true)}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <label htmlFor="newItem" className="text-sm text-gray-700">
              New Item
            </label>

            <input
              type="radio"
              id="existingItem"
              checked={!isNewItem}
              onChange={() => setIsNewItem(false)}
              className="ml-4 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <label htmlFor="existingItem" className="text-sm text-gray-700">
              Existing Item
            </label>
          </div>

          {isNewItem ? (
            <input
              type="text"
              value={state.name}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "name",
                  value: e.target.value,
                })
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          ) : (
            <select
              value={state.name}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "name",
                  value: e.target.value,
                })
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select an item</option>
              {existingNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={state.description || ""}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "description",
              value: e.target.value,
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          type="number"
          value={state.quantity || ""}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "quantity",
              value: e.target.value ? Number(e.target.value) : null,
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          value={state.price || ""}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "price",
              value: e.target.value ? Number(e.target.value) : null,
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            dispatch({ type: "SET_IMAGE", file });
          }}
          ref={fileInputRef}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {state.imageFile && (
        <div className="mt-2">
          <img
            src={URL.createObjectURL(state.imageFile)}
            alt="Preview"
            className="w-32 h-32 object-cover rounded"
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Item
      </button>
    </form>
  );
}
