'use client';

/**
 * Global error boundary – catches errors in root layout.
 * Renders a minimal HTML shell so the user always sees something.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', padding: 24 }}>
        <div style={{ maxWidth: 480, margin: '40px auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.25rem', color: '#1f2937' }}>Something went wrong</h1>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>
            Try again or refresh the page. If the problem continues, check your connection.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '10px 20px',
              backgroundColor: '#F25E26',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
