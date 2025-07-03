import React, { useState } from "react";
import { useStore } from "@/store/nav-store";
import { ProductList } from "./ProductList"
import { AuctionList } from "./AuctionList";


export const Product = () => {
  const [active, setActive] = useState(0);
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);

  return (
    <section
      className={`my-10 px-20 ${isNavbarOpen ? "justify-center items-center " : ""
        } flex-col flex`}
    >
      <div className="flex items-center">
        {/*  <div
          className={`${
            active == 0 ? "bg-[#FCDFD4]" : ""
          } border-2 border-gray-100 p-3 text-sm rounded-lg cursor-pointer w-[10em] `}
          onClick={() => setActive(0)}
        >
          Regular
        </div>
        <div
          className={`${
            active == 1 ? "bg-[#FCDFD4]" : ""
          } border-2 border-gray-100 p-3 text-sm rounded-lg cursor-pointer w-[10em] `}
          onClick={() => setActive(1)}
        >
          Auction
        </div> */}

        <div className={` flex  items-center mb-4  `}>
          <div
            className={`${active == 0 ? "bg-[#FCDFD4]" : ""
              } border-2 border-gray-100 p-4 text-sm rounded-lg cursor-pointer w-[14em] `}
            onClick={() => setActive(0)}
          >
            Regular
          </div>
          <div
            className={`${active == 1 ? "bg-[#FCDFD4]" : ""
              } border-2 border-[#D2D2D2]] p-4 text-sm rounded-lg cursor-pointer w-[14em] `}
            onClick={() => setActive(1)}
          >
            Auction
          </div>


        </div>

      </div>

      {active == 0 ? <ProductList /> : <AuctionList />}
    </section>
  );
};
