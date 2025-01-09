"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { InventoryForm } from "@/components/inventory/InventoryForm";
import { Loading } from "@/components/shared/Loading";

export default function AddInventoryPage() {
  const { status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Inventory Item</h1>
      <InventoryForm />
    </div>
  );
} 