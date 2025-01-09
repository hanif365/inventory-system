"use client";

import { useSession } from "next-auth/react";
import { Loading } from "@/components/shared/Loading";
import Link from "next/link";

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Inventory Management System</h1>
      <p className="text-xl mb-8 text-gray-600">
        Welcome to our inventory management solution
      </p>
      <div className="space-x-4">
        <Link
          href="/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </Link>
      </div>
    </div>
  );
}


export default function Home() {
  const { status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  return <HomePage />;
}
