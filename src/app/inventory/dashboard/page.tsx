import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Link
          href="/inventory/add"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Add New Item</h2>
          <p className="text-gray-600">Add new items to your inventory</p>
        </Link>
        <Link
          href="/inventory/list"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">View Inventory</h2>
          <p className="text-gray-600">Manage your existing inventory items</p>
        </Link>
      </div>
    </div>
  );
}
