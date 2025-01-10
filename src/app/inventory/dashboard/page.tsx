"use client";

import Link from "next/link";
import { IoAdd } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  const iconVariants = {
    hover: {
      rotate: 360,
      scale: 1.2,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] mt-16">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" style={{ zIndex: -1 }}>
        <div className="absolute inset-0  opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {isLoading ? (
          <>
            <div className="h-12 w-64 mx-auto mb-8 bg-white/10 animate-pulse rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 bg-white/10 animate-pulse rounded-xl"></div>
              ))}
            </div>
          </>
        ) : (
          <>
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold mb-8 text-white text-center"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Inventory Dashboard
            </motion.h1>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={cardVariants}
                whileHover="hover"
              >
                <Link
                  href="/inventory/add"
                  className="block p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20"
                >
                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      className="w-16 h-16 bg-[#0098A5]/20 rounded-full flex items-center justify-center mb-4"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <IoAdd className="h-8 w-8 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-semibold mb-3 text-white group-hover:text-[#0098A5] transition-colors">
                      Add Item
                    </h2>
                    <p className="text-gray-200 text-sm sm:text-base">
                      Add new items to your inventory
                    </p>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
              >
                <Link
                  href="/inventory/list"
                  className="block p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20"
                >
                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      className="w-16 h-16 bg-[#0098A5]/20 rounded-full flex items-center justify-center mb-4"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <IoDocumentTextOutline className="h-8 w-8 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-semibold mb-3 text-white group-hover:text-[#0098A5] transition-colors">
                      View Inventory
                    </h2>
                    <p className="text-gray-200 text-sm sm:text-base">
                      Manage and monitor your existing inventory items
                    </p>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
