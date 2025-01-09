"use client";
import PageLayout from "@/app/components/Layout/PageLayout";
import Image from "next/image";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Products } from "@/app/static-data";
import { ProductsCard } from "../../components/ProductsCard";

interface PageProps {
  params: any;
}

function Page({ params }: PageProps) {
  const product_id = params.slug;

  /* console.log(product_id); */
  const router = useRouter();


const demodata = [
    {
        "id": "33446328-eb5c-4681-9429-224df9172394",
        "name": "Head Phone",
        "cost_price": "1500.00",
        "ticket_price": 1000.00,
        "weight": "1KG",
        "images": [
            {
                "auction": "33446328-eb5c-4681-9429-224df9172394",
                "image": "auction_images/Head_Phone.jpg"
            },
            {
                "auction": "33446328-eb5c-4681-9429-224df9172394",
                "image": "auction_images/Head_Phone_MBKLPNc.jpg"
            }
        ],
        "product_reviews": {
            "average_ratings": 4.5,
            "total_reviews": 10
        }
    },
    {
        "id": "225edcd3-5deb-42e9-a175-ac5ef5169489",
        "name": "Tecno POP 8 (BG6) 6.6\"",
        "cost_price": "115775.00",
        "ticket_price": 25000.00,
        "weight": "1",
        "images": [
            {
                "auction": "225edcd3-5deb-42e9-a175-ac5ef5169489",
                "image": "auction_images/1_8LLzfhg.jpg"
            },
            {
                "auction": "225edcd3-5deb-42e9-a175-ac5ef5169489",
                "image": "auction_images/1.jpg"
            }
        ],
        "product_reviews": {
            "average_ratings": 4.0,
            "total_reviews": 5
        }
    }
]

  return (
    <PageLayout>
      <div>
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
              src="https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg"
              className=" rounded-full border-4 border-[#F25E26]"
              width={100}
              height={100}
              alt="icon"
            />
            <div className="rounded-lg border border-[#E84526] py-4 px-4">
              <h1>Order Code</h1>
              <small className="text-[#E84526] text-sm">aji-2345-2024</small>
            </div>
          </div>
        </section>

        <section className="px-8 mt-8">
          <div className="py-4 px-4 border rounded-lg">
            <h1 className="text-[#111111] font-Poppins text-base font-semibold mb-4">
              Customer details
            </h1>
            <div className="">
              <p className="font-Poppins text-sm text-[#2A2A2A]"> Tania Joe </p>
              <p className="font-Poppins text-sm text-[#2A2A2A]">
                Taniajoe@gmail{" "}
              </p>
              <p className="font-Poppins text-sm text-[#2A2A2A]">
                1, Adeniyi Jones, Ikeja Lagos State
              </p>
              <p className="font-Poppins text-sm text-[#2A2A2A]">08190784320</p>
            </div>
          </div>
        </section>


         {/*  */}


         <section className="px-8 mt-8 ">

            <div className="py-4 px-4 border rounded-lg ">
  <h1 className="text-[#111111] font-Poppins text-base font-semibold mb-4">
              Product details
            </h1>



            <ProductsCard cardInfo={demodata } />

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
                    <p className=" text-base font-semibold">N6,000</p>
                </div>
            </div>


            <div className="flex items-center  gap-16 flex-wrap py-2">
                  <div className="w-1/2">
                    <h1>Delivery</h1>
                </div>

                    <div>
                    <p className=" text-base font-semibold">N500</p>
                </div>
            </div>

             <div className="flex items-center  gap-16 flex-wrap py-2">
          <div className="w-1/2">
                    <h1>Amount Due</h1>
                </div>

                    <div>
                    <p className=" text-base font-semibold">N6,500</p>
                </div>
            </div>


             <div className="flex items-center  gap-16 flex-wrap py-2 mt-8">
                 <div className="w-1/2">
                    <h1 className="text-[#111111] font-Poppins text-base font-semibold mb-4">Status</h1>
                </div>

                    <div>
                    <p className=" text-base font-semibold rounded-full bg-[#E7F6EC] py-4 px-4 text-[#036B26] font-Poppins">Confirmed</p>
                </div>
            </div>
          </div>
        </section>



      </div>
    </PageLayout>
  );
}

export default Page;
