"use client";
import { useRouter } from "next/navigation";
import { HeaderTitle } from "./component/HeaderTitle";
import { SideNav } from "@/app/component/SideNav";
import { Header } from "@/app/component/Header";
import { useStore } from "@/store/nav-store";
import { UserDetails } from "./component/UserDetails";
import { Upload } from "./component/Upload";
import { Product } from "./component/Product";
import { Categories } from "./component/Categories";
import { Transaction } from "./component/Transaction";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";

const Page = () => {
  const router = useRouter();
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  const headingText = useStore((state) => state.headingText);
  useAuthMiddleware(router);

  return (
    <section className="flex">
      <div className={`${isNavbarOpen ? "hidden" : ""} `}>
        <SideNav />
      </div>

      <div className="flex-auto relative ">
        <Header />
        <HeaderTitle /> {headingText === "Product"? "List": ""}
        {/*  */}
        <div className={`mt-18 ${isNavbarOpen ? "" : "ml-18"}  `}>
          {headingText === "User Details" ? (
            <UserDetails />
          ) : headingText === "Upload" ? (
            <Upload />
          ) : headingText === "Product" ? (
            <Product />
          ) : headingText === "Categories" ? (
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
