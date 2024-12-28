"use client";
import { useRouter } from "next/navigation";
import { HeaderTitle } from "./components/HeaderTitle";
import { SideNav } from "@/app/components/SideNav";
import { Header } from "@/app/components/Header";
import { useStore } from "@/store/nav-store";
import { UserDetails } from "./components/UserDetails";
import { Upload } from "./components/Upload";
import { Product } from "./components/Product";
import { Categories } from "./components/Categories";
import { Transaction } from "./components/Transaction";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import { useEffect } from "react";

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
    <section className="flex">
       <div className={`${isNavbarOpen ? "hidden" : "block"} `}>
        <SideNav />
      </div>





      <div className="flex-auto relative ">
        <Header />
        <HeaderTitle />
        {/*  */}
        <div className={`mt-18 ${isNavbarOpen ? "" : "ml-18"}  `}>
          {headingText === "User Details" ? (
            <UserDetails />
          ) : headingText === "Upload" ? (
            <Upload />
          ) : headingText === "Product" ? (
            <Product />
          ) : headingText === "Category" ? (
            <Categories />
          ) : (
            <Transaction />
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;
