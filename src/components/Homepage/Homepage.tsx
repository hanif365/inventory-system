import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import "./Homepage.css";

export default function HomePage() {
  const { status } = useSession();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };


  return (
    <div className="min-h-screen relative">
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <Image
          src="/inventory-bg.png"
          alt="Background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-800/80 to-indigo-900/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        ></motion.div>
      </motion.div>

      <motion.div 
        className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-5xl font-bold mb-4 text-white"
          variants={itemVariants}
        >
          Inventory Management System
        </motion.h1>
        <motion.p 
          className="text-xl text-white mb-8"
          variants={itemVariants}
        >
          Manage your inventory with ease and efficiency.
        </motion.p>

        <Link
          href={status === "authenticated" ? "/inventory/dashboard" : "/login"}
          className="text-[14px] lg:text-[16px] login_btn  px-6 py-4 relative  uppercase font-semibold tracking-wider leading-none overflow-hidden bg-[#0098A5] rounded-lg text-white cursor-pointer"
          type="button"
        >
          <span className="absolute inset-0 bg-[#0055a5]"></span>
          <span className="absolute inset-0 flex justify-center items-center font-bold">
            Get Started
          </span>
          Get Started
        </Link>
      </motion.div>
    </div>
  );
}
