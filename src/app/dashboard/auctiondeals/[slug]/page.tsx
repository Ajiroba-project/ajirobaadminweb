"use client";
import PageLayout from "@/app/components/Layout/PageLayout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Products } from "@/app/static-data";
import { ProductsCard } from "../../components/ProductsCard";
import Cookies from "js-cookie";
import { useGetDatanew } from "@/hooks/useGetData";
import { toast } from "react-toastify";
import Loading from "@/app/components/Loading";
import { AuctionsCard } from "../../components/AuctionsCard";
import { desc } from "framer-motion/m";

interface PageProps {
  params: any;
}

function Page({ params }: PageProps) {
  const product_id = params.slug;

  const router = useRouter();

  const [userToken, setUserToken] = useState(Cookies.get("token"));

  let url = `/api/fetchauction?product_id=${product_id}`;

  const {
    data: prodInfo,
    isLoading: prodLoading,
    error: prodError,
  } = useGetDatanew(url, "get_prod_details", userToken || " ");



  const transformedData = prodInfo?.data?.data?.auction_details?.map((item: {
    description: string; ticket_number: any, product_id: any; ticket_price: any; quantity: any; name: any; price: number; discount: number; images: any[]; auction_details: any[], average_ratings: any; total_reviews: any;
  }) => ({
    id: prodInfo?.data?.data?.ticket_number,
    name: prodInfo?.data?.data?.auction,
    cost_price: item?.price && item?.price?.toFixed(2) || 0,
    ticket_price: prodInfo?.data?.data?.ticket_price && parseFloat(Number(prodInfo?.data?.data?.ticket_price)?.toFixed(2)) || 0,
    weight: `${item?.quantity}KG` || 'N/A',
    description: prodInfo?.data?.data?.auction || 'N/A',
    images: item?.images?.map((img: any) => ({
      auction: item?.product_id,
      image: img
    })),
    auction_details: {
      average_ratings: item?.average_ratings || 0,
      total_reviews: item?.total_reviews || 0
    }
  }));




  if (prodLoading) {
    return <Loading />
  }

  return (
    <PageLayout>
      <div>


        {
          prodInfo?.data?.status === "failed" ? (
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-[#E84526] text-lg">{prodInfo?.data?.message}</h1>
              <h1 onClick={() => router.back()} className="text-[#FFFFFF] mt-2 cursor-pointer rounded-lg border bg-gray-600 p-2 font-Poppins text-sm ">Back</h1>
            </div>
          )

            :




            <>


              <section className="flex flex-col bg-[#F6F6F6] px-8">
                <div className="flex items-center justify-between py-8">
                  <p onClick={() => router.back()} className="text-[#E84526] text-base">Back</p>
                  <h1 className="text-base 2xl:text-[20px] lg:text-[20px] md:text-[20px] xl:text-[20px] font-semibold font-Poppins mx-auto">
                    Customer Transaction Details
                  </h1>
                  <div className="w-20"></div>
                </div>
              </section>

              <section className="flex flex-col  px-8">
                <div className="flex items-center justify-between ">
                  <div className="w-20"></div>
                  <Image
                    src={`https://staging.ajiroba.ng/v1${prodInfo?.data?.data?.profile_image}`}
                    className=" rounded-full border-4 border-[#F25E26]"
                    width={100}
                    height={100}
                    alt="icon"
                  />
                  <div className="rounded-lg border border-[#E84526] py-4 px-4">
                    <h1>Ticket Number</h1>
                    <small className="text-[#E84526] text-sm">{prodInfo?.data?.data?.ticket_number}</small>
                  </div>
                </div>
              </section>

              <section className="px-8 mt-8">
                <div className="py-4 px-4 border rounded-lg">
                  <h1 className="text-[#111111] font-Poppins text-base font-semibold mb-4">
                    Customer details
                  </h1>
                  <div className="">
                    <p className="font-Poppins text-sm text-[#2A2A2A]">{prodInfo?.data?.data?.name} </p>
                    <p className="font-Poppins text-sm text-[#2A2A2A]">
                      {prodInfo?.data?.data?.email}{" "}
                    </p>
                    <p className="font-Poppins text-sm text-[#2A2A2A]">
                      {prodInfo?.data?.data?.address}
                    </p>
                    <p className="font-Poppins text-sm text-[#2A2A2A]"> {prodInfo?.data?.data?.phone}</p>

                  </div>
                </div>
              </section>

              <section className="px-8 mt-8 ">

                <div className="py-4 px-4 border rounded-lg ">
                  <h1 className="text-[#111111] font-Poppins text-base font-semibold mb-4">
                    Product details
                  </h1>



                  <AuctionsCard cardInfo={transformedData} />

                </div>




              </section>

              <section className="px-8 mt-8">
                <div className="py-4 px-4 border rounded-lg">
                  <h1 className="text-[#111111] font-Poppins text-base font-semibold mb-4">
                    Payment
                  </h1>
                  <div className="flex gap-16 flex-wrap py-2">
                    <div className="w-1/2">
                      <h1>Amount Due</h1>
                    </div>

                    <div>
                      <p className=" text-base font-semibold">₦ {prodInfo?.data?.data?.items_price}</p>
                    </div>
                  </div>


                  <div className="flex items-center  gap-16 flex-wrap py-2">
                    <div className="w-1/2">
                      <h1>Delivery</h1>
                    </div>

                    <div>
                      <p className=" text-base font-semibold">₦ {prodInfo?.data?.data?.delivery_fee}</p>
                    </div>
                  </div>

                  <div className="flex items-center  gap-16 flex-wrap py-2">
                    <div className="w-1/2">
                      <h1>Amount Due</h1>
                    </div>

                    <div>
                      <p className=" text-base font-semibold">₦  {prodInfo?.data?.data?.total_price}</p>
                    </div>
                  </div>


                  <div className="flex items-center  gap-16 flex-wrap py-2 mt-8">
                    <div className="w-1/2">
                      <h1 className="text-[#111111] font-Poppins text-base font-semibold mb-4">Status</h1>
                    </div>

                    <div>
                      <p className=" text-base font-semibold rounded-full bg-[#E7F6EC] py-4 px-4 text-[#036B26] font-Poppins">{prodInfo?.data?.data?.status || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </section>


            </>
        }




      </div>
    </PageLayout>
  );
}

export default Page;
