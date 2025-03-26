"use client";
import React, { Suspense } from "react";
// import { Header } from '../component/Header'

import { userProfile } from "@/store/store";
import { useRouter } from "next/navigation";
// import useAuthMiddleware from '@/hooks/useAuth'
import AuthMiddleware from "@/hooks/useAuth";
import PageLayout from "../components/Layout/PageLayout";
import { Profile } from "../userprofile/components/profile";
import { PhotoUpload } from "../userprofile/components/PhotoUpload";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import { UserDetails } from "../dashboard/components/UserDetails";
import { LiveChat } from "../dashboard/components/LiveChat";

const LiveChatParent = () => {
  const router = useRouter();

  /*  useAuthMiddleware(router) */
  useAuthMiddleware(router);

  const profile = userProfile((state) => state.profile);

  return (
    <PageLayout>
      <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-20 flex justify-center items-center sticky top-0 z-20  ">
        <h1 className="xl:text-2xl 2xl:text-2xl md:text-2xl text-base  leading-tight tracking-tight font-Poppins">
         Live Chat
        </h1>
      </div>
      <section className="px-12 py-12 -z-10">
     {/*    <Profile />

        {profile && <PhotoUpload />} */}
     <LiveChat />
      </section>
    </PageLayout>
  );
};


export default function Page() {
  return (
    <Suspense>
      <div>
        <LiveChatParent />
      </div>
    </Suspense>
  );
}
