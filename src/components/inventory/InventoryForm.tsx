"use client";

import { useReducer } from 'react';
import { CreateInventoryItem } from '@/types/inventory';
import { useInventoryStore } from '@/store/store';

type FormState = CreateInventoryItem;
type FormAction = 
  | { type: 'SET_FIELD'; field: keyof CreateInventoryItem; value: string | number | null }
  | { type: 'RESET' };

const initialState: FormState = {
  name: '',
  description: '',
  quantity: null,
  price: null
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
  const { addInventoryItem } = useInventoryStore();
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
      
      const result = await response.json();
      addInventoryItem({ 
        ...state, 
        id: result.data.id,
        created_at: result.data.created_at,
        updated_at: result.data.updated_at
      });
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
          className="mt-1 block w-full rounded-md border-2 border-red-500 shadow-sm"
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
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="text"
          value={state.quantity ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || /^\d+$/.test(value)) {
              dispatch({
                type: 'SET_FIELD',
                field: 'quantity',
                value: value === '' ? null : Number(value)
              });
            }
          }}
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm"
          required
        />
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="text"
          value={state.price ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || /^\d+$/.test(value)) {
              dispatch({
                type: 'SET_FIELD',
                field: 'price',
                value: value === '' ? null : Number(value)
              });
            }
          }}
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm"
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