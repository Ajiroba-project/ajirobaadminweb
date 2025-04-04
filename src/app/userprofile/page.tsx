'use client'
import React, { Suspense } from 'react'
// import { Header } from '../component/Header'
// import { Profile } from './components/profile'
import { PhotoUpload } from "./components/PhotoUpload"
import { userProfile } from "@/store/store"
import { useRouter } from 'next/navigation'
// import useAuthMiddleware from '@/hooks/useAuth'
import AuthMiddleware from '@/hooks/useAuth'
import PageLayout from '../components/Layout/PageLayout'
import { Profile } from './components/profile'

const ProfilePage = () => {
  const router = useRouter()

  /*  useAuthMiddleware(router) */
  AuthMiddleware(router)

  const profile = userProfile(state => state.profile)

  return (


    <PageLayout>

      <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-20 flex justify-center items-center sticky top-0 z-20  ">
        <h1 className="xl:text-2xl 2xl:text-2xl md:text-2xl text-base  leading-tight tracking-tight font-Poppins">Profile</h1>
      </div>
      <section className='px-12 py-12 -z-10'>



        <Profile />

        {profile && <PhotoUpload />}

      </section>




    </PageLayout>




  )
}

// export default Page

export default function Page() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <div >

        <ProfilePage />

      </div>
    </Suspense>
  )
}
