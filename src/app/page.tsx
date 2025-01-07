
'use client'
import {useAuthStore} from '@/store/nav-store';
import { useRouter } from 'next/navigation'
import {useEffect} from "react";
import useAuthMiddleware from "@/hooks/useAuthMiddleware"

export default function Home() {
  const router = useRouter()
  useAuthMiddleware(router)

  return (
    <main className="flex">
    <h1>Admin Page</h1>
    </main>
  );
}
