"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { InventoryList } from "@/components/Inventory/InventoryList";
import { Loading } from "@/components/shared/Loading/Loading";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function InventoryListPage() {
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)]">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" style={{ zIndex: -1 }}>
        <div className="absolute inset-0 opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {isLoading ? (
          <div className="w-full max-w-4xl mx-auto">
            <div className="h-12 w-64 mx-auto mb-8 bg-white/10 animate-pulse rounded-lg"></div>
            <div className="h-[600px] bg-white/10 animate-pulse rounded-xl"></div>
          </div>
        ) : (
          <>
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold mb-8 text-white text-center"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Inventory Items
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <InventoryList />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}