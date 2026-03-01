import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-800">404 – Page not found</h1>
      <p className="text-sm text-gray-600">The page you’re looking for doesn’t exist or was moved.</p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-[#F25E26] px-4 py-2 text-sm font-medium text-white hover:bg-[#E84526] focus:outline-none focus:ring-2 focus:ring-[#F25E26] focus:ring-offset-2"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
