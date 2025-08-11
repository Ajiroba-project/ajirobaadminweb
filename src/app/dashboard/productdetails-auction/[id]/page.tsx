"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import bgImg from "@/app/asset/analytics.svg"; // Use a local asset as a background image
import { ProfileHeader } from "@/app/components/Header";
import rice from '@/app/asset/image/rice3.jpeg'
import { useState } from "react";
import Cookies from "js-cookie";
import { useGetDatanew } from "@/hooks/useGetData";
import { FaStar } from "react-icons/fa6";
import Loading from "@/app/components/Loading";

export default function ProductDetailsAuctionPage() {
    // Mock data (replace with real data fetching logic)
    // Mock data (replace with real data fetching logic)
    const params = useParams();

    const router = useRouter();

    const id = params?.id;



    const [userToken, setUserToken] = useState(Cookies.get("token"));

    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/view_admin_auction/${id}`;

    const {
        data: prodInfo,
        isLoading: prodLoading,
        error: prodError,
    } = useGetDatanew(url, "get_prod_details", userToken || " ");

    // console.log(prodInfo?.data?.product_info, 'product_infooo')




    if (prodLoading) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-100 w-full flex flex-col items-center font-poppins"  >
            <div className="w-full bg-gray-100" style={{ width: '100', maxWidth: '80%' }}>
                <div className="flex flex-col" >
                    <ProfileHeader />
                    <div className="flex items-center justify-between w-full">
                        <p
                            className="text-[#F25E26] underline cursor-pointer mt-2 mb-0  p-4 lg:px-14 px-7 "
                            onClick={() => router.back()}
                        >
                            Back
                        </p>
                        <h1 className="text-lg md:text-xl lg:text-2xl py-2 mb-6 font-semibold text-center flex-1">Products Details</h1>
                        <span className="w-24" /> {/* Spacer for symmetry */}
                    </div>
                </div>
            </div>

            {/* Product Summary Card */}
            <div className="w-full flex justify-center items-center mt-8 px-2" style={{ width: '100', maxWidth: '75%' }}>
                <div
                    className="relative rounded-tl-xl rounded-tr-xl overflow-hidden shadow-lg"
                    style={{ width: '100%', maxWidth: '100%', marginLeft: 0, marginRight: 0 }}
                >
                    {/* Background image */}
                    <Image
                        src={require('@/app/asset/image/auctionproductdetailsbanner.jpg')}
                        alt="Product Summary Background"
                        fill
                        style={{ objectFit: 'cover', zIndex: 1 }}
                        className="absolute inset-0"
                        priority
                    />
                    {/* Overlay for darkening background */}
                    <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
                    {/* Card Content */}
                    <div className="relative z-20 p-4 md:p-8 flex flex-col">
                        <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">Product Summary</h2>
                        <div className="bg-[#FFF3EE] rounded-xl flex flex-col md:flex-row justify-between items-stretch p-4 md:p-8 gap-6 flex-wrap">
                            {/* Left Column */}
                            <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Category:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info?.category}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Sub category:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info?.subcategory}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Product Name:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info?.product_name}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Weight:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info?.weight}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Uploaded By:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info?.uploaded_by}</span>
                                </div>
                            </div>
                            {/* Middle Column */}
                            <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Date of Raffle:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info?.date_of_raffle}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Time:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info?.time_of_raffle}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Duration:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info?.duration || 'N/A'}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Total no of bidders:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info.bidders}</span>
                                </div>
                            </div>
                            {/* Right Column */}
                            <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
                                <div className="flex items-center gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Product ID:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info.product_no}</span>
                                    <span className="ml-2 w-3 h-3 rounded-full bg-green-500 inline-block" />
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">No of tickets sold:</span>
                                    <span className="font-semibold text-[#F25E26]">{prodInfo?.data?.product_info.no_of_tickets_sold}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Ticket amount:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info.ticket_amount}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Total amount:</span>
                                    <span className="font-semibold text-[#F25E26]">{prodInfo?.data?.product_info.total_amount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Auction Summary */}
            <div className="w-full flex justify-center items-center mt-8 px-2" style={{ width: '100', maxWidth: '75%' }}>
                <div className="w-full">
                    <h2 className="text-xl font-semibold mb-6 ml-2">Auction Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Revenue */}
                        <div className="flex border rounded-lg overflow-hidden bg-white">
                            <div className="bg-[#E5E5E5] flex items-center px-6 py-6 w-1/2 min-w-[120px] text-[#222] font-medium text-base md:text-lg">Revenue</div>
                            <div className="flex-1 flex items-center px-6 py-6 text-[#F25E26] font-semibold text-lg md:text-xl">{prodInfo?.data?.product_info?.auction_summary?.revenue}</div>
                        </div>
                        {/* RDA */}
                        <div className="flex border rounded-lg overflow-hidden bg-white">
                            <div className="bg-[#E5E5E5] flex items-center px-6 py-6 w-1/2 min-w-[120px] text-[#222] font-medium text-base md:text-lg">RDA</div>
                            <div className="flex-1 flex items-center px-6 py-6 text-[#F25E26] font-semibold text-lg md:text-xl">{prodInfo?.data?.product_info?.auction_summary?.rda}</div>
                        </div>
                        {/* ECA */}
                        <div className="flex border rounded-lg overflow-hidden bg-white">
                            <div className="bg-[#E5E5E5] flex items-center px-6 py-6 w-1/2 min-w-[120px] text-[#222] font-medium text-base md:text-lg">ECA</div>
                            <div className="flex-1 flex items-center px-6 py-6 text-[#F25E26] font-semibold text-lg md:text-xl">{prodInfo?.data?.product_info?.auction_summary?.eca}</div>
                        </div>
                        {/* No of Winners */}
                        <div className="flex border rounded-lg overflow-hidden bg-white">
                            <div className="bg-[#E5E5E5] flex items-center px-6 py-6 w-1/2 min-w-[120px] text-[#222] font-medium text-base md:text-lg">No of Winners</div>
                            <div className="flex-1 flex items-center px-6 py-6 text-[#F25E26] font-semibold text-lg md:text-xl">{prodInfo?.data?.product_info?.auction_summary?.no_of_winners}</div>
                        </div>
                    </div>
                </div>
            </div>




            {/* Product Summary Section */}
            <div className="w-full flex justify-center items-center mt-8 px-2" style={{ width: '100', maxWidth: '75%' }}>
                <div className="w-full">
                    <h2 className="text-black text-xl md:text-2xl font-semibold mb-6">Product Summary</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       


                        <div className=" rounded-lg border p-3 border-[#504D4D]  w-auto mt-8 xl:mt-0 lg:mt-0 md:mt-0 2xl:mt-0 container justify-center flex flex-wrap xl:block md:block lg:block 2xl:block">
                            <div className="">
                                <h1 className="text-[#111111] text-[20px]  font-Poppins font-medium ">
                                    {prodInfo?.data?.product_info?.product_name}
                                </h1>

                                <h1 className="text-[#111111] text-2xl mt-2 font-semibold font-Poppins ">
                                    {prodInfo?.data?.product_info?.ticket_amount}
                                </h1>
                                <h1 className=" font-medium font-Poppins text-sm mt-2  ">
                                    Ticket Price
                                </h1>

                                <hr className="my-4 border border-gray-300" />


                                <div className="mb-2 text-base text-[#7B7B7B]">Quantity Available: <span className="text-[#222] font-semibold">{prodInfo?.data?.product_info?.quantity}</span></div>

                                <p className="text-[#111111] text-base mt-4 ">Weight</p>

                                <h1 className="text-[#111111] font-Poppins text-base mt-2 font-bold">
                                    {prodInfo?.data?.product_info?.weight || "NA"}
                                </h1>

                                <hr className="my-4 border border-gray-300" />

                                <p className="text-[#111111] font-Poppins font-medium text-base mt-4 ">
                                    Delivery Estimation
                                </p>

                                <h1 className="text-[#111111] font-Poppins text-base mt-2 font-semibold">
                                    {prodInfo?.data?.product_info?.delivery_estimation || "NA"}
                                </h1>

                                <div className="flex justify-center items-center mt-4">
                                    {/* <button
                                        onClick={AddToCart}
                                        disabled={isAddingToCart}

                                        className="mt-4 px-12 text-sm font-normal font-Poppins rounded-lg bg-[#FCDFD4] py-2 transition delay-300 duration-300 ease-in-out hover:bg-[#E84526] hover:text-white hover:transition-all"
                                    >
                                        {isAddingToCart ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Adding to Cart...
                                            </div>
                                        ) : (
                                            'Add to Cart'
                                        )}
                                    </button> */}
                                </div>
                            </div>
                        </div>

                        {/* Right: Product Images */}
                        <div className="bg-black rounded-xl flex flex-col  justify-center min-h-[350px] py-8">
                            <div className="flex flex-wrap sm:flex-nowrap ">
                                <div className="relative mt-6 ">
                                    <Image
                                        src={`https://staging.ajiroba.ng/media/${prodInfo?.data?.product_info.images[0]}`}
                                        alt={`Product Image`}
                                        width={220}
                                        height={220}
                                        className="object-contain rounded"
                                    />
                                </div>
                                <div className="relative opacity-35 sm:ml-4 mt-4 sm:mt-0">
                                    <Image
                                        src={`https://staging.ajiroba.ng/media/${prodInfo?.data?.product_info.images[0]}`}
                                        alt={`Product Image`}
                                        width={220}
                                        height={220}
                                        className="object-contain rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="w-full flex justify-center items-center mt-8 px-2" style={{ width: '100', maxWidth: '75%' }}>
                <div className="w-full py-12">
                    <div className="">
                        <h1 className="text-[#363636] font-Poppins font-normal leading-[29px]">
                            {prodInfo?.data?.product_info?.description}
                        </h1>
                    </div>
                </div>
            </div>

        </div>
    );
}