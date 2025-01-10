"use client";
import { useRouter } from "next/navigation";
// import { HeaderTitle } from "./components/HeaderTitle";
import { SideNav } from "@/app/components/SideNav";
import { Header } from "@/app/components/Header";
import { useStore } from "@/store/nav-store";
// import { UserDetails } from "./components/UserDetails";
// import { Upload } from "./components/Upload";
// import { Product } from "./components/Product";
// import { Categories } from "./components/Categories";
// import { Transaction } from "./components/Transaction";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import { useEffect } from "react";
import { section } from "framer-motion/client";
import PageLayout from "@/app/components/Layout/PageLayout";
import { UserDetails } from "../components/UserDetails";
import { Upload } from "../components/Upload";
import { Product } from "../components/Product";
import { Categories } from "../components/Categories";
// import PageLayout from "../components/Layout/PageLayout";
// import Analytics from "./components/Analytics";

const Page = () => {
  const router = useRouter();
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  const headingText = useStore((state) => state.headingText);
    useAuthMiddleware(router);

    const setNavbarOpen = useStore((state) => state.setNavbarOpen);


    useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setNavbarOpen(false); // Automatically close navbar on larger screens
      }
    };

    // Set up resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setNavbarOpen]);

  return (


<section>

    <PageLayout>

       <div style={{

        }} className={` ${isNavbarOpen ? "" : ""}  `}>
            <Categories />
         {/*  {headingText === "User Details" ? (
            <UserDetails />
          ) : headingText === "Upload" ? (
            <Upload />
          ) : headingText === "Product" ? (
            <Product />
          ) : headingText === "Category" ? (
            <Categories />
          ) : headingText === "Analytics" ? (
            <Analytics />
          ) : headingText === "Transaction" ? (
          <Transaction />
          )

          : (
            <Transaction />
          )} */}
        </div>
    </PageLayout>

</section>




  );
};

export default Page;
