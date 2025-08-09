"use client";

import React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message = (error as any)?.response?.data?.message || error.message || "Something went wrong.";

  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center px-4">
      <h2 className="text-lg font-semibold text-red-600 mb-2">Failed to load report</h2>
      <p className="text-sm text-gray-600 mb-4 text-center max-w-md">{message}</p>
      <button
        onClick={() => reset()}
        className="rounded-md bg-[#f25e26] px-4 py-2 text-white text-sm hover:bg-[#d63918]"
      >
        Try again
      </button>
    </div>
  );
}


