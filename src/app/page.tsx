"use client";

import dynamic from 'next/dynamic';
import { Providers } from './providers';
import { Loading } from '@/components/shared/Loading';

const InventoryForm = dynamic(
  () => import('@/components/inventory/InventoryForm').then(mod => mod.InventoryForm),
  { 
    ssr: false,
    loading: () => <Loading />
  }
);

const InventoryList = dynamic(
  () => import('@/components/inventory/InventoryList').then(mod => mod.InventoryList),
  { 
    ssr: false,
    loading: () => <Loading />
  }
);

export default function Home() {
  return (
    <Providers>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Inventory Management System</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            <InventoryForm />
          </div>
          <InventoryList />
        </div>
      </div>
    </Providers>
  );
}
