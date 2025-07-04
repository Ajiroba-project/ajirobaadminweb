import React, { useState } from "react";
import { useStore } from "@/store/nav-store";
import { ProductList } from "./ProductList"
import { AuctionList } from "./AuctionList";
import { RegularCompleted } from "./RegularCompleted";
import { DefaultButton } from "@/app/components/Button";
import { useRouter } from "next/navigation";
import { AuctionListCompleted } from "./AuctionListCompleted";


export const Product = () => {
  const [active, setActive] = useState(0);
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);

  const router = useRouter();

  return (
    <section
      className={` ${isNavbarOpen ? "justify-center items-center " : ""
        } flex-col flex`}
    >

      {
        (active === 0 || active === 1) ?




          <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-32 flex justify-center items-center sticky top-0 ">
            <h1 className="text-center xl:text-2xl 2xl:text-2xl md:text-2xl text-base  leading-tight tracking-tight font-Poppins">Product Details</h1>
          </div>



          : active === 2 ?


            <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-32 flex flex-col justify-center items-center sticky top-0">
              <h1 className="text-center xl:text-2xl 2xl:text-2xl md:text-2xl text-base  leading-tight tracking-tight font-Poppins">Regular Product Transaction</h1>
              <p className="self-start ml-4 text-sm font-Poppins text-[#EB5017] cursor-pointer" onClick={() => setActive(0)} >Back</p>
            </div>
            : <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-32 flex flex-col justify-center items-center sticky top-0">
              <h1 className="text-center xl:text-2xl 2xl:text-2xl md:text-2xl text-base  leading-tight tracking-tight font-Poppins"> Product Details</h1>
              <p className="self-start ml-4 text-sm font-Poppins text-[#EB5017] cursor-pointer" onClick={() => setActive(1)} >Back</p>
            </div>
      }


      <div className="flex justify-between flex-wrap gap-4 items-center mb-4 my-10 px-20">





        <div className="flex">
          {
            (active === 0 || active === 1) && (
              <>

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

              </>
            )
          }

          {
            active === 2 && (
              <div
                className={`${active == 2 ? "bg-[#FCDFD4]" : ""
                  } border-2 border-gray-100 p-4 text-sm rounded-lg cursor-pointer w-[14em] `}
                onClick={() => setActive(0)}
              >
                Regular
              </div>
            )
          }

          {
            active === 3 && (
              <div
                className={`${active == 3 ? "bg-[#FCDFD4]" : ""
                  } border-2 border-gray-100 p-4 text-sm rounded-lg cursor-pointer w-[14em] `}
                onClick={() => setActive(0)}
              >
                Auction Completed
              </div>
            )
          }

        </div>

        <div>

          {(active === 0 || active === 1) && (
            active === 0 ?
              <DefaultButton
                text={'Completed Transactions'}
                type="submit"
                handleClick={() => setActive(2)}
                className=" bg-[#EB5017] text-white p-3 text-sm  hover:bg-[#F25E26] hover:text-white rounded-lg"
              />
              :
              <DefaultButton
                text={'Auction Completed'}
                type="submit"
                handleClick={() => setActive(3)}
                className=" bg-[#EB5017] text-white p-3 text-sm  hover:bg-[#F25E26] hover:text-white rounded-lg"
              />
          )}

        </div>
      </div>

      <div className=" my-10 px-20">
        {active === 0 ? <ProductList /> : active === 1 ? <AuctionList /> : active === 2 ? <RegularCompleted /> : <AuctionListCompleted />}
      </div>
    </section>
  );
};
