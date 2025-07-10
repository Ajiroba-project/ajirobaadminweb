import React, { useState } from "react";
import { useStore } from "@/store/nav-store";
import { ProductList } from "./ProductList";
import { AuctionList } from "./AuctionList";
import { RegularCompleted } from "./RegularCompleted";
import { DefaultButton } from "@/app/components/Button";
import { useRouter } from "next/navigation";
import { AuctionListCompleted } from "./AuctionListCompleted";

export const Redemption = () => {
  const [active, setActive] = useState(0);
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);

  const router = useRouter();

  return (
    <section
      className={` ${
        isNavbarOpen ? "justify-center items-center " : ""
      } flex-col flex`}
    >
      <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-32 flex justify-center items-center sticky top-0 ">
        <h1 className="text-center xl:text-2xl 2xl:text-2xl md:text-2xl text-base  leading-tight tracking-tight font-Poppins">
          Delivery Product Redemption
        </h1>
      </div>

      <div className=" my-10 px-20">
    
      </div>
    </section>
  );
};
