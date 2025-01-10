"use client";

import { BounceLoader } from "react-spinners";

export function Loading() {
  return (
    <div className="flex items-center justify-center p-4 mt-10">
      <BounceLoader color="#00D1E3" size={80} />
    </div>
  );
}