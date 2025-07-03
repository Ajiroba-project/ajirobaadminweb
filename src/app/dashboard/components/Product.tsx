import React, { useState } from "react";
import { useStore } from "@/store/nav-store";
import { ProductList } from "./ProductList"
import { AuctionList } from "./AuctionList";
import { DefaultButton } from "@/app/components/Button";


export const Product = () => {
  const [active, setActive] = useState(0);
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);

  return (
    <section
      className={`my-10 px-20 ${isNavbarOpen ? "justify-center items-center " : ""
        } flex-col flex`}
    >
      <div className="flex justify-between flex-wrap gap-4 items-center mb-4">
        <div className="flex">
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

        <div>
          {
            active === 0 ?

              <DefaultButton
                text={'Completed Transactions'}
                type="submit"
                handleClick={() => null}
                className=" bg-[#EB5017] text-white p-3 text-sm  hover:bg-[#F25E26] hover:text-white rounded-lg"
              />
              :

              <DefaultButton
                text={'Auction Completed'}
                type="submit"
                handleClick={() => null}
                className=" bg-[#EB5017] text-white p-3 text-sm  hover:bg-[#F25E26] hover:text-white rounded-lg"
              />
          }
        </div>
      </div>

      {active == 0 ? <ProductList /> : <AuctionList />}
    </section>
  );
};
