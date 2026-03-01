'use client';

import { useEffect } from 'react';

/**
 * Root error boundary – catches runtime errors and shows a fallback.
 * Helps users on flaky networks or when something goes wrong.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-800">Something went wrong</h1>
      <p className="max-w-md text-center text-sm text-gray-600">
        This can happen on a slow or unstable connection. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-[#F25E26] px-4 py-2 text-sm font-medium text-white hover:bg-[#E84526] focus:outline-none focus:ring-2 focus:ring-[#F25E26] focus:ring-offset-2"
      >
        Try again
      </button>
    </div>
  );
}
