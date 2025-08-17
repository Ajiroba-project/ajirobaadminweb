
'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to signin page as the default landing page
    router.replace('/signin')
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Redirecting to Sign In...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </main>
  );
}
