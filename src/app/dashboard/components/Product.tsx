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
    <section className={`${isNavbarOpen ? "justify-center items-center" : ""} flex-col flex`}>
      {/* Header Section - Responsive */}
      {active === 0 || active === 1 ? (
        <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-16 lg:h-20 xl:h-24 z-10 flex justify-center items-center sticky top-0">
          <h1 className="text-base lg:text-lg xl:text-xl 2xl:text-2xl leading-tight tracking-tight font-Poppins text-center px-4">
            Product Details
          </h1>
        </div>
      ) : active === 2 ? (
        <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-20 lg:h-24 xl:h-32 flex flex-col justify-center items-center sticky top-0 px-4">
          <h1 className="text-base lg:text-lg xl:text-xl 2xl:text-2xl leading-tight tracking-tight font-Poppins text-center mb-2">
            Regular Product Transaction
          </h1>
          <p 
            className="text-sm font-Poppins text-[#EB5017] cursor-pointer hover:text-[#F25E26] transition-colors duration-200" 
            onClick={() => setActive(0)}
          >
            Back
          </p>
        </div>
      ) : (
        <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-20 lg:h-24 xl:h-32 flex flex-col justify-center items-center sticky top-0 px-4">
          <h1 className="text-base lg:text-lg xl:text-xl 2xl:text-2xl leading-tight tracking-tight font-Poppins text-center mb-2">
            Product Details
          </h1>
          <p 
            className="text-sm font-Poppins text-[#EB5017] cursor-pointer hover:text-[#F25E26] transition-colors duration-200" 
            onClick={() => setActive(1)}
          >
            Back
          </p>
        </div>
      )}

      {/* Navigation and Button Section - Responsive */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 my-6 lg:my-10 px-4 lg:px-8 xl:px-20">
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full lg:w-auto">
          {(active === 0 || active === 1) && (
            <>
              <div
                className={`${
                  active === 0 ? "bg-[#FCDFD4] border-[#E84526]" : "border-gray-200 hover:border-gray-300"
                } border-2 p-3 lg:p-4 text-sm rounded-lg cursor-pointer w-full sm:w-48 lg:w-56 xl:w-64 text-center transition-all duration-200 hover:bg-[#FCDFD4] hover:bg-opacity-50`}
                onClick={() => setActive(0)}
              >
                Regular
              </div>

              <div
                className={`${
                  active === 1 ? "bg-[#FCDFD4] border-[#E84526]" : "border-gray-200 hover:border-gray-300"
                } border-2 p-3 lg:p-4 text-sm rounded-lg cursor-pointer w-full sm:w-48 lg:w-56 xl:w-64 text-center transition-all duration-200 hover:bg-[#FCDFD4] hover:bg-opacity-50`}
                onClick={() => setActive(1)}
              >
                Auction
              </div>
            </>
          )}

          {active === 2 && (
            <div
              className={`${
                active === 2 ? "bg-[#FCDFD4] border-[#E84526]" : "border-gray-200 hover:border-gray-300"
              } border-2 p-3 lg:p-4 text-sm rounded-lg cursor-pointer w-full sm:w-48 lg:w-56 xl:w-64 text-center transition-all duration-200 hover:bg-[#FCDFD4] hover:bg-opacity-50`}
              onClick={() => setActive(0)}
            >
              Regular
            </div>
          )}

          {active === 3 && (
            <div
              className={`${
                active === 3 ? "bg-[#FCDFD4] border-[#E84526]" : "border-gray-200 hover:border-gray-300"
              } border-2 p-3 lg:p-4 text-sm rounded-lg cursor-pointer w-full sm:w-48 lg:w-56 xl:w-64 text-center transition-all duration-200 hover:bg-[#FCDFD4] hover:bg-opacity-50`}
              onClick={() => setActive(0)}
            >
              Auction Completed
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full lg:w-auto">
          {(active === 0 || active === 1) && (
            active === 0 ? (
              <DefaultButton
                text={'Completed Transactions'}
                type="submit"
                handleClick={() => setActive(2)}
                className="w-full lg:w-auto bg-[#EB5017] text-white p-3 lg:p-3 text-sm hover:bg-[#F25E26] hover:text-white rounded-lg transition-colors duration-200"
              />
            ) : (
              <DefaultButton
                text={'Auction Completed'}
                type="submit"
                handleClick={() => setActive(3)}
                className="w-full lg:w-auto bg-[#EB5017] text-white p-3 lg:p-3 text-sm hover:bg-[#F25E26] hover:text-white rounded-lg transition-colors duration-200"
              />
            )
          )}
        </div>
      </div>

      {/* Content Section - Responsive */}
      <div className="my-6 lg:my-10 px-4 lg:px-8 xl:px-20">
        {active === 0 ? (
          <ProductList />
        ) : active === 1 ? (
          <AuctionList />
        ) : active === 2 ? (
          <RegularCompleted />
        ) : (
          <AuctionListCompleted />
        )}
      </div>
    </section>
  );
};
