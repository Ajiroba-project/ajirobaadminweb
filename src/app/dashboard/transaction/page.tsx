"use client";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/nav-store";

import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import { useEffect } from "react";
import PageLayout from "@/app/components/Layout/PageLayout";
import { Transaction } from "../components/Transaction";


const Page = () => {
  const router = useRouter();
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  const headingText = useStore((state) => state.headingText);
    useAuthMiddleware(router);

    const setNavbarOpen = useStore((state) => state.setNavbarOpen);


    useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setNavbarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setNavbarOpen]);

  return (


<section>

    <PageLayout>

       <div style={{

        }} className={` ${isNavbarOpen ? "" : ""}  `}>
            <Transaction />

        </div>
    </PageLayout>

</section>




  );
};

export default Page;
