
'use client'
import {useAuthStore} from '@/store/nav-store';
import { useRouter } from 'next/navigation'
import {useEffect} from "react";
import useAuthMiddleware from "@/hooks/useAuthMiddleware"

export default function Home() {
  const router = useRouter()
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  useAuthMiddleware(isLoggedIn, router)

  return (
    <main className="flex">  
    </main>
  );
}
