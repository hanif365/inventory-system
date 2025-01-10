/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useReducer, useState } from "react";
import { useInventoryStore } from "@/store/store";
import { UpdateInventoryItem } from "@/types/inventory";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { items, fetchInventory, updateInventoryItem, deleteInventoryItem } =
    useInventoryStore();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [actionFeedback, setActionFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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
          description: item.description,
          quantity: item.quantity,
          price: item.price,
        },
      });
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const { ...updateData } = state.editForm;
      await updateInventoryItem(id, updateData);
      dispatch({ type: "RESET" });
      setActionFeedback({
        message: "Item updated successfully!",
        type: "success",
      });
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (error) {
      setActionFeedback({ message: "Failed to update item", type: "error" });
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  const handleCancel = () => {
    dispatch({ type: "RESET" });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteInventoryItem(id);
      setActionFeedback({
        message: "Item deleted successfully!",
        type: "success",
      });
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (error) {
      console.error("Error deleting item:", error);
      setActionFeedback({ message: "Failed to delete item", type: "error" });
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 sm:mt-6 md:mt-8"
    >
      {actionFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
            actionFeedback.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {actionFeedback.message}
        </motion.div>
      )}
      <div className="flex justify-end px-4 sm:px-6 lg:px-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/inventory/add")}
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium shadow-md text-sm sm:text-base"
        >
          Add New Item
        </motion.button>
      </div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 md:mt-10 px-4 sm:px-6 lg:px-8"
        style={{ alignItems: "start" }}
      >
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow overflow-hidden transition-all duration-300 hover:shadow-[0_3px_8px_rgba(8,_112,_184,_0.3)]"
              layout
            >
              {item.image_url && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative h-36 sm:h-48 w-full"
                >
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              )}
              <motion.div className="p-3 sm:p-4">
                {state.editingId === item.id ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-2"
                  >
                    <input
                      type="text"
                      value={item.name ?? ""}
                      disabled
                      className="w-full border rounded-lg px-2 sm:px-3 py-1 bg-gray-50 text-sm sm:text-base"
                    />
                    <textarea
                      value={state.editForm.description ?? ""}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_FORM",
                          updates: { description: e.target.value },
                        })
                      }
                      className="w-full border rounded-lg px-2 sm:px-3 py-1 focus:ring-2 focus:ring-indigo-500 resize-none text-sm sm:text-base"
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
                      className="w-full border rounded-lg px-2 sm:px-3 py-1 focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      value={state.editForm.price ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          dispatch({
                            type: "UPDATE_FORM",
                            updates: {
                              price: value === "" ? null : Number(value),
                            },
                          });
                        }
                      }}
                      className="w-full border rounded-lg px-2 sm:px-3 py-1 focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                    />
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUpdate(item.id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-1 rounded-lg font-medium shadow-md text-sm sm:text-base"
                      >
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCancel}
                        className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 sm:px-4 py-1 rounded-lg font-medium shadow-md text-sm sm:text-base"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div layout>
                    <motion.h3
                      className="text-lg sm:text-xl font-semibold text-gray-800 mb-2"
                      layout
                    >
                      {item.name}
                    </motion.h3>
                    <motion.p
                      className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4"
                      layout
                    >
                      {item.description}
                    </motion.p>
                    <motion.div
                      className="flex justify-between mb-3 sm:mb-4 text-xs sm:text-sm"
                      layout
                    >
                      <span className="bg-indigo-100 text-indigo-800 px-2 sm:px-3 py-1 rounded-full">
                        Qty: {item.quantity}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full">
                        £ {Number(item.price)}
                      </span>
                    </motion.div>
                    <motion.div className="flex gap-2" layout>
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#3B82F6" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(item.id)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-1 rounded-lg font-medium shadow-md text-sm sm:text-base transition-colors duration-200"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#EF4444" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 py-1 rounded-lg font-medium shadow-md text-sm sm:text-base transition-colors duration-200"
                      >
                        Delete
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
