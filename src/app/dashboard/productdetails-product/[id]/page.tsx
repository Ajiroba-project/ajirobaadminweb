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
    const params = useParams();

    const router = useRouter();

    const id = params?.id;



    const [userToken, setUserToken] = useState(Cookies.get("token"));

    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/view_admin_product/${id}`;

    const {
        data: prodInfo,
        isLoading: prodLoading,
        error: prodError,
    } = useGetDatanew(url, "get_prod_details", userToken || " ");




    if (prodLoading) {
        return <Loading />;
    }



    console.log(prodInfo?.data?.product_info, 'product_infooo')


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
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info.category}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Sub category:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info.subcategory}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Product Name:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info.product_name}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Weight:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info.weight}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Uploaded By:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info.uploaded_by}</span>
                                </div>
                            </div>
                            {/* Middle Column */}
                            <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Selling Price:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info?.selling_price !== undefined && prodInfo?.data?.product_info?.selling_price !== null
                                        ? `₦${Number(prodInfo.data.product_info.selling_price).toLocaleString('en-NG', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}`
                                        : 'N/A'
                                    }</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Cost Price:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info?.cost_price !== undefined && prodInfo?.data?.product_info?.cost_price !== null
                                        ? `₦${Number(prodInfo.data.product_info.cost_price).toLocaleString('en-NG', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}`
                                        : 'N/A'
                                    }</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Discount:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info?.discount !== undefined && prodInfo?.data?.product_info?.discount !== null
                                        ? `₦${Number(prodInfo.data.product_info.discount).toLocaleString('en-NG', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}`
                                        : 'N/A'
                                    }</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Profit:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info?.profit !== undefined && prodInfo?.data?.product_info?.profit !== null
                                        ? `₦${Number(prodInfo.data.product_info.profit).toLocaleString('en-NG', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}`
                                        : 'N/A'
                                    }</span>
                                </div>
                            </div>
                            {/* Right Column */}
                            <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
                                <div className="flex items-center gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Product ID:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info?.product_no}</span>
                                    <span className="ml-2 w-3 h-3 rounded-full bg-green-500 inline-block" />
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Total unit sold:</span>
                                    <span className="font-semibold text-[#F25E26]">{prodInfo?.data?.product_info?.unit_sold}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Total Revenue :</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.data?.product_info?.total_revenue !== undefined && prodInfo?.data?.product_info?.total_revenue !== null
                                        ? `₦${Number(prodInfo.data.product_info.total_revenue).toLocaleString('en-NG', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}`
                                        : 'N/A'
                                    }</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Total Profit:</span>
                                    <span className="font-semibold text-[#F25E26]">{prodInfo?.data?.product_info?.total_profit !== undefined && prodInfo?.data?.product_info?.total_profit !== null
                                        ? `₦${Number(prodInfo.data.product_info.total_profit).toLocaleString('en-NG', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}`
                                        : 'N/A'
                                    }</span>
                                </div>

                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Unit in Store:</span>
                                    <span className="font-semibold text-[#F25E26]">{prodInfo?.data?.product_info?.unit_in_store}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* Product Summary Section */}
            <div className="w-full flex justify-center items-center mt-8 px-2" style={{ width: '100', maxWidth: '75%' }}>
                <div className="w-full">
                    <h2 className="text-black text-xl md:text-2xl font-semibold mb-6">Product Summary</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left: Product Info Card */}
                        {/*   <div className="border rounded-xl p-8 bg-white flex flex-col justify-between h-full">
                            <h3 className="text-2xl font-semibold mb-2"> {prodInfo?.data?.product_info.product_name}</h3>
                            <div className="text-3xl font-bold text-[#222] mb-1"> {prodInfo?.data?.product_info?.ticket_price !== undefined && prodInfo?.data?.product_info?.ticket_price !== null
                                ? `₦${Number(prodInfo.data.product_info.ticket_price).toLocaleString('en-NG', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}`
                                : 'N/A'
                            }</div>
                            <div className="text-[#7B7B7B] text-lg mb-4">Ticket Price</div>
                            <hr className="my-4" />
                            <div className="mb-2 text-base text-[#7B7B7B]">Quantity Available: <span className="text-[#222] font-semibold">{prodInfo?.data?.product_info?.quantity}</span></div>
                            <div className="mb-2 text-base text-[#7B7B7B]">Weight: <span className="text-[#222] font-semibold">{prodInfo?.data?.product_info?.weight}</span></div>
                            <hr className="my-4" />
                            <div className="text-base text-[#7B7B7B] mb-1">Delivery Estimation</div>
                            <div className="text-lg font-bold text-[#222]">{prodInfo?.data?.product_info?.delivery_estimation}</div>
                        </div> */}



                        <div className=" rounded-lg border p-3 border-[#504D4D]  w-auto mt-8 xl:mt-0 lg:mt-0 md:mt-0 2xl:mt-0 container justify-center flex flex-wrap xl:block md:block lg:block 2xl:block">
                            <div className="">
                                <h1 className="text-[#111111] text-[20px]  font-Poppins font-medium ">
                                    {prodInfo?.data?.product_info?.product_name}
                                </h1>
                                <p className="flex mt-4 items-center text-[#111111] text-sm gap-1">
                                    {Array.from(
                                        {
                                            /*  length: prodInfo?.data?.product_info?.average_ratings, */
                                            length: 4
                                        },
                                        (_, index) => (
                                            <span key={index}>
                                                <FaStar className="text-[#f3e43a]" />
                                            </span>
                                        ),
                                    )}
                                    <span className="ml-4 text-[#2A2A2A] font-Poppins text-[8px] font-normal">
                                        ({prodInfo?.data?.product_info?.total_reviews || 4}) Reviews
                                    </span>
                                </p>
                                <h1 className="text-[#111111] text-2xl mt-2 font-semibold font-Poppins ">
                                    {prodInfo?.data?.product_info?.discount !== undefined && prodInfo?.data?.product_info?.discount !== null
                                        ? `₦${Number(prodInfo.data.product_info.discount).toLocaleString('en-NG', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}`
                                        : 'N/A'
                                    }
                                </h1>
                                <h1 className="text-[#504D4D] font-medium font-Poppins text-lg mt-2 line-through ">
                                    {prodInfo?.data?.product_info?.selling_price !== undefined && prodInfo?.data?.product_info?.selling_price !== null
                                        ? `₦${Number(prodInfo.data.product_info.selling_price).toLocaleString('en-NG', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}`
                                        : 'N/A'
                                    }
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
                        <div className=" rounded-xl flex flex-col  justify-center min-h-[350px] py-8">
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