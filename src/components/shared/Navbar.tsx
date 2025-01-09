"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export function Navbar() {
  const { data: session, status } = useSession();

  const getLastName = (fullName?: string) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    return names[names.length - 1];
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="rounded-full"
              />
              {/* <span className="ml-2 text-xl font-bold text-gray-800">
                Inventory System
              </span> */}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {status === "authenticated" && (
              <>
                <Link
                  href="/inventory/dashboard"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  Dashboard
                </Link>
              </>
            )}
            {status === "authenticated" ? (
              <>
                <span className="text-gray-700">
                  Welcome, {getLastName(session?.user?.name || "")}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
