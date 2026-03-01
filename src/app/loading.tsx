'use client';

/**
 * Root loading UI – shown when navigating or when the app is loading on slow networks.
 * Keeps users informed instead of a blank screen.
 */
export default function RootLoading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#F6F6F6]"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#F25E26] border-t-transparent" />
      <p className="text-sm font-medium text-gray-600">Loading…</p>
    </div>
  );
}
