"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./Navbar.css";
import { useState, useEffect } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getLastName = (fullName?: string) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    return names[names.length - 1];
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-24">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={60}
                height={60}
                className="rounded-full md:w-[80px] md:h-[80px]"
                priority
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "authenticated" && (
              <Link
                href="/inventory/dashboard"
                className={`text-[#0098A5] hover:text-[#0098A5]/80 px-3 py-1 rounded ${
                  pathname === "/inventory/dashboard"
                    ? "border-b-2 border-[#0098A5] font-bold"
                    : ""
                }`}
              >
                Dashboard
              </Link>
            )}
            {status === "authenticated" ? (
              <>
                <span className="text-gray-700">
                  Welcome, {getLastName(session?.user?.name || "")}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-500 hover:bg-red-700 text-[14px] lg:text-[16px] register_btn px-4 py-3 relative uppercase font-semibold tracking-wider leading-none overflow-hidden rounded-lg text-white cursor-pointer"
                >
                  <span className="absolute inset-0 bg-red-500"></span>
                  <span className="absolute inset-0 flex justify-center items-center font-bold">
                    Logout
                  </span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={`text-[#0098A5] hover:text-[#0098A5]/80 px-3 py-1 rounded ${
                    pathname === "/"
                      ? "border-b-2 border-[#0098A5] font-bold"
                      : ""
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/login"
                  className={`text-[#0098A5] hover:text-[#0098A5]/80 px-3 py-1 rounded ${
                    pathname === "/login"
                      ? "border-b-2 border-[#0098A5] font-bold"
                      : ""
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-[14px] lg:text-[16px] register_btn px-4 py-3 relative uppercase font-semibold tracking-wider leading-none overflow-hidden bg-[#0098A5] rounded-lg text-white cursor-pointer"
                >
                  <span className="absolute inset-0 bg-[#0055a5]"></span>
                  <span className="absolute inset-0 flex justify-center items-center font-bold">
                    Register
                  </span>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:hidden pb-4 transition-all duration-300 ease-in-out`}
          suppressHydrationWarning
        >
          <div className="flex flex-col space-y-3">
            {status === "authenticated" && (
              <Link
                href="/inventory/dashboard"
                className={`text-[#0098A5] hover:text-[#0098A5]/80 px-3 py-1 rounded ${
                  pathname === "/inventory/dashboard"
                    ? "border-b-2 border-[#0098A5] font-bold"
                    : ""
                }`}
              >
                Dashboard
              </Link>
            )}
            {status === "authenticated" ? (
              <>
                <span className="text-gray-700 px-3">
                  Welcome, {getLastName(session?.user?.name || "")}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-500 hover:bg-red-700 text-sm register_btn px-3 py-2 relative uppercase font-semibold tracking-wider leading-none overflow-hidden rounded-lg text-white cursor-pointer mx-3"
                >
                  <span className="absolute inset-0 bg-red-500"></span>
                  <span className="absolute inset-0 flex justify-center items-center font-bold">
                    Logout
                  </span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={`text-[#0098A5] hover:text-[#0098A5]/80 px-3 py-1 rounded ${
                    pathname === "/"
                      ? "border-b-2 border-[#0098A5] font-bold"
                      : ""
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/login"
                  className={`text-[#0098A5] hover:text-[#0098A5]/80 px-3 py-1 rounded ${
                    pathname === "/login"
                      ? "border-b-2 border-[#0098A5] font-bold"
                      : ""
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm register_btn px-3 py-2 relative uppercase font-semibold tracking-wider leading-none overflow-hidden bg-[#0098A5] rounded-lg text-white cursor-pointer mx-3"
                >
                  <span className="absolute inset-0 bg-[#0055a5]"></span>
                  <span className="absolute inset-0 flex justify-center items-center font-bold">
                    Register
                  </span>
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
