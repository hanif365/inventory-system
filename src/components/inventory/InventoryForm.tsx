"use client";

import { useReducer } from 'react';
import { CreateInventoryItem } from '@/types/inventory';

type FormState = CreateInventoryItem;
type FormAction = 
  | { type: 'SET_FIELD'; field: keyof CreateInventoryItem; value: string | number }
  | { type: 'RESET' };

const initialState: FormState = {
  name: '',
  description: '',
  quantity: 0,
  price: 0
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function InventoryForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });

      if (!response.ok) throw new Error('Failed to create item');
      
      dispatch({ type: 'RESET' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={state.name}
          onChange={(e) => dispatch({
            type: 'SET_FIELD',
            field: 'name',
            value: e.target.value
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          value={state.description}
          onChange={(e) => dispatch({
            type: 'SET_FIELD',
            field: 'description',
            value: e.target.value
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          value={state.quantity}
          onChange={(e) => dispatch({
            type: 'SET_FIELD',
            field: 'quantity',
            value: Number(e.target.value)
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          min="0"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          value={state.price}
          onChange={(e) => dispatch({
            type: 'SET_FIELD',
            field: 'price',
            value: Number(e.target.value)
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          min="0"
          step="0.01"
          required
        />
      </div>
      
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Item
      </button>
    </form>
  );
} 