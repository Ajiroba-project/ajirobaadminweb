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

interface PageProps {
  params: any;
}

function Page({ params }: PageProps) {
  const product_id = params.slug;

  //  console.log(product_id);
  const router = useRouter();


  /*       const params = useParams();
  const productId = params.slug; */


  const [userToken, setUserToken] = useState(Cookies.get("token"));

  let url = `/api/fetchproduct?product_id=${product_id}`;


  const {
    data: prodInfo,
    isLoading: prodLoading,
    error: prodError,
  } = useGetDatanew(url, "get_prod_details", userToken || " ");



const transformedData = prodInfo?.data?.data?.products_details?.map((item: { product_id: any; ticket_price: any; quantity: any; name: any; price: number; discount: number; images: any[]; average_ratings: any; total_reviews: any; }) => ({
    id: item.product_id,
    name: item.name,
    cost_price: item.price.toFixed(2), // Convert to string with 2 decimal places
    ticket_price: item?.ticket_price && parseFloat(item?.ticket_price?.toFixed(2)) || 0, // Convert to number
    weight: `${item?.quantity}KG`, // Default value
    images: item.images.map((img: any) => ({
        auction: item.product_id,
    /*     image: `auction_images/${img.split('/').pop()}`  */
    image: img
    })),
    product_reviews: {
        average_ratings: item?.average_ratings || 0, // Random rating between 3.0 - 5.0
        total_reviews:item?.total_reviews || 0 // Random number of reviews (1 - 50)
    }
}));

//  console.log(transformedData, 'trasnformedData');





// useEffect(() => {
//   if (prodInfo?.data?.status === "failed") {
//     toast.error(`${prodInfo?.data?.message}`, {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//       onClose: () => router.back(),
//     });
//   }
// }, [prodInfo]);


if (prodLoading) {
  return <Loading/>
}

  return (
    <PageLayout>
      <div>


      {

 prodInfo?.data?.status === "failed" ? (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-[#E84526] text-lg">{prodInfo?.data?.message}</h1>
                <h1 onClick={()=> router.back()} className="text-[#FFFFFF] mt-2 cursor-pointer rounded-lg border bg-gray-600 p-2 font-Poppins text-sm ">Back</h1>
            </div>
        )

:
<>

  <section className="flex flex-col bg-[#F6F6F6] px-8">
          <div className="flex items-center justify-between py-8">
            <p onClick={()=> router.back()} className="text-[#E84526] text-base">Back</p>
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
              src={`https://ajiroba.onrender.com${prodInfo?.data?.data?.profile_image}`}
              className=" rounded-full border-4 border-[#F25E26]"
              width={100}
              height={100}
              alt="icon"
            />
            <div className="rounded-lg border border-[#E84526] py-4 px-4">
              <h1>Order Code</h1>
              <small className="text-[#E84526] text-sm">{prodInfo?.data?.data?.order_id}</small>
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



            <ProductsCard cardInfo={transformedData } />

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
                    <p className=" text-base font-semibold">N {prodInfo?.data?.data?.items_price}</p>
                </div>
            </div>


            <div className="flex items-center  gap-16 flex-wrap py-2">
                  <div className="w-1/2">
                    <h1>Delivery</h1>
                </div>

                    <div>
                    <p className=" text-base font-semibold">N {prodInfo?.data?.data?.delivery_fee}</p>
                </div>
            </div>

             <div className="flex items-center  gap-16 flex-wrap py-2">
          <div className="w-1/2">
                    <h1>Amount Due</h1>
                </div>

                    <div>
                    <p className=" text-base font-semibold">N {prodInfo?.data?.data?.total_price}</p>
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
