
'use client'
import {useAuthStore} from '@/store/nav-store';
import { useRouter } from 'next/navigation'
import {useEffect} from "react"

export default function Home() {
  const router = useRouter()
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)


  useEffect(()=>{
    if (!isLoggedIn){
      router.replace('/signin')
    }
    else{
      router.replace('/dashboard')
    }
  }, [isLoggedIn, router])


  
  return (
    <main className="flex">  
    </main>
  );
}
