'use client';

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center p-8" role="status" aria-label="Loading dashboard">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F25E26] border-t-transparent" />
    </div>
  );
}
