"use client";

import { useRef, useReducer, useEffect, useState } from "react";
import { useInventoryStore } from "@/store/store";
import { CreateInventoryItem, InventoryItem } from "@/types/inventory";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { addInventoryItem, updateInventoryItem } = useInventoryStore();
  const [state, dispatch] = useReducer(formReducer, initialState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [isNewItem, setIsNewItem] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      dispatch({ type: "SET_IMAGE", file });
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.imageFile && isNewItem) {
      showNotification("Please upload an image", "error");
      return;
    }

    setIsSubmitting(true);

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
        showNotification("Item updated successfully!", "success");
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
        showNotification("Item added successfully!", "success");
      }

      dispatch({ type: "RESET" });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("Failed to save item", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-[95%] sm:w-[98%] md:max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-lg shadow-lg space-y-4 sm:space-y-6 border border-blue-100"
    >
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2"
      >
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 md:col-span-2"
        >
          <label className="block text-base sm:text-lg font-semibold text-indigo-900 mb-2">
            Item Details
          </label>
          <motion.div className="p-3 sm:p-4 bg-white bg-opacity-70 backdrop-blur-sm rounded-lg space-y-3 sm:space-y-4 shadow-inner">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <motion.div className="flex items-center">
                <input
                  type="radio"
                  id="newItem"
                  checked={isNewItem}
                  onChange={() => setIsNewItem(true)}
                  className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600 focus:ring-indigo-500 outline-none"
                />
                <label
                  htmlFor="newItem"
                  className="ml-2 text-xs sm:text-sm font-medium text-indigo-700"
                >
                  New Item
                </label>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <input
                  type="radio"
                  id="existingItem"
                  checked={!isNewItem}
                  onChange={() => setIsNewItem(false)}
                  className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600 focus:ring-indigo-500 outline-none"
                />
                <label
                  htmlFor="existingItem"
                  className="ml-2 text-xs sm:text-sm font-medium text-indigo-700"
                >
                  Existing Item
                </label>
              </motion.div>
            </div>

            <div className="h-[38px] sm:h-[42px]">
              <AnimatePresence mode="wait">
                {isNewItem ? (
                  <motion.input
                    key="newItemInput"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    type="text"
                    value={state.name}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "name",
                        value: e.target.value,
                      })
                    }
                    placeholder="Enter item name"
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md border border-indigo-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-white bg-opacity-80"
                    required
                  />
                ) : (
                  <motion.select
                    key="existingItemSelect"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    value={state.name}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "name",
                        value: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md border border-indigo-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-white bg-opacity-80"
                    required
                  >
                    <option value="">Select an item</option>
                    {existingNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </motion.select>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-1 md:col-span-2"
        >
          <label className="block text-xs sm:text-sm font-medium text-indigo-700 mb-1">
            Description
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            value={state.description || ""}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "description",
                value: e.target.value,
              })
            }
            rows={4}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md border border-indigo-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none bg-white bg-opacity-80"
            placeholder="Enter item description"
          />
        </motion.div>

        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-1"
        >
          <label className="block text-xs sm:text-sm font-medium text-indigo-700 mb-1">
            Quantity
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="number"
            value={state.quantity || ""}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "quantity",
                value: e.target.value ? Number(e.target.value) : null,
              })
            }
            min="0"
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md border border-indigo-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-white bg-opacity-80"
            required
          />
        </motion.div>

        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.6 }}
          className="col-span-1"
        >
          <label className="block text-xs sm:text-sm font-medium text-indigo-700 mb-1">
            Price
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="number"
            value={state.price || ""}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "price",
                value: e.target.value ? Number(e.target.value) : null,
              })
            }
            min="0"
            step="0.01"
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md border border-indigo-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-white bg-opacity-80"
            required
          />
        </motion.div>

        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.7 }}
          className="col-span-1 md:col-span-2"
        >
          <label className="block text-xs sm:text-sm font-medium text-indigo-700 mb-1">
            Image
          </label>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-indigo-500 bg-indigo-50"
                : "border-indigo-300 hover:border-indigo-500"
            } bg-white bg-opacity-60`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-1 sm:space-y-2">
              <div className="text-indigo-600 text-sm sm:text-base">
                <p>Drag and drop an image here, or</p>
                <p className="text-indigo-700 font-medium">
                  click to select a file
                </p>
              </div>
              <p className="text-xs sm:text-sm text-indigo-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                dispatch({ type: "SET_IMAGE", file });
              }}
              ref={fileInputRef}
              className="hidden"
              required={isNewItem}
            />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {state.imageFile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="col-span-1 md:col-span-2"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-32 h-32 sm:w-40 sm:h-40"
              >
                <Image
                  src={URL.createObjectURL(state.imageFile)}
                  fill
                  alt="Preview"
                  className="rounded-lg object-cover shadow-md"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 text-xs sm:text-sm lg:text-base px-4 sm:px-6 py-3 sm:py-4 relative uppercase font-semibold tracking-wider leading-none overflow-hidden ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 cursor-pointer"
          } rounded-lg text-white transition-all duration-300 shadow-lg hover:shadow-xl`}
        >
          <span className="absolute inset-0 bg-white opacity-10"></span>
          <span className="relative z-10 flex items-center justify-center">
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Item Adding...
              </>
            ) : (
              "Add Item"
            )}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => router.push("/inventory/list")}
          disabled={isSubmitting}
          className={`text-xs sm:text-sm lg:text-base px-4 sm:px-6 py-3 sm:py-4 relative uppercase font-semibold tracking-wider leading-none overflow-hidden ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 cursor-pointer"
          } rounded-lg text-white transition-all duration-300 shadow-lg hover:shadow-xl`}
        >
          <span className="absolute inset-0 bg-white opacity-10"></span>
          <span className="relative z-10">Show List</span>
        </motion.button>
      </div>
    </motion.form>
  );
}
