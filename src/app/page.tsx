import { InventoryForm } from "@/components/inventory/InventoryForm";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Inventory Management System</h1>
      <InventoryForm />
    </div>
  );
}
