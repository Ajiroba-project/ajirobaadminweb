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
import { parseISO, format } from "date-fns";
import { h1 } from "framer-motion/m";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";



const CustomerReview = ({ data }: any) => {
    // Step 2: Adding state to filter reviews by stars
    const [selectedStars, setSelectedStars] = useState<number | null>(null);

    // Step 1: Sort stars from highest to lowest
    const sortedRatings = [...data?.rating_counts].sort(
      (a: { stars: number }, b: { stars: number }) => b.stars - a.stars
    );

    // Step 2: Filter reviews based on the selected star count
    const filteredReviews = selectedStars
      ? data?.reviews.filter(
        (review: any) => review.rating === selectedStars
      )
      : data?.reviews;


    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 2; // Number of reviews per page

    const totalReviews = filteredReviews.length;
    const totalPages = Math.ceil(totalReviews / reviewsPerPage);

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);


    const handlePageClick = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };




    return (


      <>
      
      <div className="">
        <div>
          <h1 className="text-[#353131] font-Poppins font-medium text-lg text-center 2xl:text-start xl:text-start lg:text-start md:text-start">
            Customer Review
          </h1>
        </div>

    

        <div className="flex 2xl:flex-row xl:flex-row lg:flex-row md:flex-row flex-col 2xl:items-start xl:items-start lg:items-start md:items-start items-center gap-12 mt-8">
          <div className=" 2xl:w-1/2 xl:w-1/2 lg:w-1/2 md:w-1/2 w-auto">

            <p className="flex mt-4 items-center text-[#111111] text-sm gap-1">
              {Array.from(
                {
                  length: data?.product_reviews?.average_ratings,
                },
                (_, index) => (
                  <span key={index}>
                    <FaStar className="text-[#F25E26]" />
                  </span>
                )
              )}
              <span className="ml-4 text-[#2A2A2A] font-Poppins text-[8px] font-normal">
                ({data?.product_reviews?.total_reviews}) Reviews
              </span>
            </p>


            {sortedRatings.map(
              (
                item: { stars: number; customers: number },
                index: number
              ) => (
                <div key={index} className="flex gap-4 items-center py-2">
                  <div>
                    <span className="font-Poppins text-[16px] text-[#353131]">
                      {item.stars} stars
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-[#E84526] h-2.5 rounded-full"
                        style={{
                          width: `${item.customers}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <small className="font-Poppins text-[16px] text-[#353131]">
                      {item.customers}
                    </small>
                  </div>
                </div>
              )
            )}


            <div className="mt-4">
              <p>Filter By:</p>
            </div>


            <div className="flex gap-2 flex-wrap">

              {sortedRatings.map((item: { stars: number }) => (
                <button
                  key={item.stars}
                  onClick={() => setSelectedStars(item.stars)}
                  className={`font-Poppins text-[16px] border border-[#D2D2D2] mt-4 px-4 py-2 text-sm ${selectedStars === item.stars
                    ? "bg-[#F25E26] text-white font-bold"
                    : "bg-white text-black font-normal"
                    } rounded`}
                >
                  {item.stars} Star
                </button>
              ))}


              <button
                onClick={() => setSelectedStars(null)}
                className={`font-Poppins text-[16px] border border-[#D2D2D2] mt-4 px-4 py-2 text-sm ${selectedStars === null
                  ? "bg-[#F25E26] text-white font-bold"
                  : "bg-white text-black font-normal"
                  } rounded`}
              >
                All Stars
              </button>
            </div>

          </div>

          <div className=" 2xl:w-1/2 xl:w-1/2 lg:w-1/2 md:w-1/2 w-auto">
            {currentReviews.map((item: any, key: number) => {
              const date = item?.date_created ? parseISO(item.date_created) : null;
              const formattedDate = date
                ? format(date, "dd/MM/yyyy")
                : "Invalid Date";

              return (
                <div key={key} className="flex gap-2">
                  <div className="">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL_IMG}${item?.user?.profile_image}`}
                      height={40}
                      width={40}
                      alt="Profile Image"
                      className="rounded-full object-cover"
                      style={{ borderRadius: "50%" }}
                    />
                  </div>

                  <div className="mb-8 flex-1">
                    <p className="text-[#2A2A2A] text-[16px] font-Poppins font-bold">{`${item.user.first_name}  ${item.user.last_name} `}</p>
                    <p className="flex mt-4 items-center text-[#2A2A2A] font-Poppins text-sm gap-1">
                      {Array.from({ length: item?.rating }, (_, index) => (
                        <span key={index}>
                          <FaStar className="text-[#F25E26]" />
                        </span>
                      ))}

                      {formattedDate}
                    </p>
                    <p className="font-Poppins font-normal text-[13px]">
                      {item.comment}
                    </p>
                  </div>
                </div>
              );
            })}


            <div className="flex justify-end mt-4">
              <h1 className=" text-center 4 text-[#E84526]" >Pages</h1>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;

                return (
                  <div key={index} className="flex " >
                    <h1
                      key={pageNumber}
                      onClick={() => handlePageClick(pageNumber)}
                      className={` px-2 cursor-pointer ${currentPage === pageNumber
                        /*   ? "bg-[#F25E26] text-white font-bold"
                          : "bg-white text-black border border-gray-300" */
                        ? " text-[#353131] font-bold"
                        : " text-[#353131]"
                        }`}
                    >
                      {pageNumber}
                    </h1>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </>
     
    );
  };

export default function ProductDetailsAuctionPage() {
    // Mock data (replace with real data fetching logic)
    const params = useParams();

    const router = useRouter();
    useAuthMiddleware(router);

    const id = params?.id;


    const [userToken, setUserToken] = useState(Cookies.get("token"));

    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/view_admin_product/${id}`;

    // let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/view_admin_auction/${id}`;

    const {
        data: prodInfo,
        isLoading: prodLoading,
        error: prodError,
    } = useGetDatanew(url, "get_prod_details", userToken || " ");

    // console.log(prodInfo?.data?.product_reviews?.total_reviews, 'prodInfo?.data?.product_reviews?.total_reviews')

    if (prodLoading) {
        return <Loading />;
    }



    //  console.log(prodInfo?.data?.product_info, 'product_infooo')

    if (
      prodInfo?.data &&
      typeof prodInfo.data === 'object' &&
      Object.keys(prodInfo.data).length === 0
    ) {
      return (
<>

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


            <div className="flex items-center justify-center h-full w-full py-10">
          <h1 className="text-center font-Poppins text-lg font-semibold">
          No data returned. Possible API issue.
          </h1>
        </div>
            </div>
</>

        
      
      );
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
                        <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">Product Summary </h2>
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
                                        src={`${process.env.NEXT_PUBLIC_BASE_URL_IMG}/media/${prodInfo?.data?.product_info?.images[0]}`}
                                        alt={`Product Image`}
                                        width={220}
                                        height={220}
                                        className="object-contain rounded"
                                    />
                                </div>
                                <div className="relative opacity-35 sm:ml-4 mt-4 sm:mt-0">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BASE_URL_IMG}/media/${prodInfo?.data?.product_info?.images[0]}`}
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


            <div style={{ width: '100', maxWidth: '75%' }}>
            {Number(prodInfo?.data?.product_reviews?.total_reviews) >= 1 && (
        <CustomerReview data={prodInfo?.data} />
      )}
            </div>

        </div>
    );
}