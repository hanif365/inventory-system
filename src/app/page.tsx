"use client";

import { useSession } from "next-auth/react";
import { Loading } from "@/components/shared/Loading/Loading";
import HomePage from "@/components/Homepage/Homepage";

export default function Home() {
  const { status } = useSession();

  // Show loading spinner while checking authentication status
  if (status === "loading") {
    return (
      <div className="mt-16">
        <Loading />
      </div>
    );
  }

  // Render homepage once authentication status is determined
  return <HomePage />;
}
