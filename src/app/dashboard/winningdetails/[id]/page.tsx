"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import bgImg from "@/app/asset/analytics.svg"; // Use a local asset as a background image
import { ProfileHeader } from "@/app/components/Header";
import rice from '@/app/asset/image/rice3.jpeg'
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useGetDatanew } from "@/hooks/useGetData";
import Loading from "@/app/components/Loading";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { CiBellOn, CiSearch } from "react-icons/ci";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaBell } from "react-icons/fa6";
import { Pagination } from "@/app/components/Pagination";
import { FaSearch } from "react-icons/fa";
import ModalComponent from "@/app/components/ModalComponent";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";


export default function ProductDetailsAuctionPage() {
    const params = useParams();
    const router = useRouter();
    useAuthMiddleware(router);
    const id = params?.id;
    const [userToken, setUserToken] = useState(Cookies.get("token"));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalUser, setModalUser] = useState(null); // To know which user triggered the modal (optional for future API)

    // Product details API
    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/view_admin_auction/${id}`;
    const {
        data: prodInfo,
        isLoading: prodLoading,
        error: prodError,
    } = useGetDatanew(url, "get_prod_details", userToken || " ");

    // User details API (replace with actual winners API if available)


// console.log(prodInfo, 'proddinfooo')

let urla = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/auction_product_winners/${prodInfo?.data?.product_info.product_no}`;
const {
    data: winnerInfo,
    isLoading: winnerLoading,
    error: winnerError,
} = useGetDatanew(urla, "get_prod_details", userToken || " ");

    //  console.log(winnerInfo?.data, 'winnerinfo')


    const {
        data: userDetails,
        isLoading: userLoading,
        error: userError,
    } = useGetDatanew(`/api/userdetails/`, "get_user_details", userToken || " ");

    // State for search and pagination
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Transform user data to match the card structure (mocking ticket/product fields for now)
    const users =
    winnerInfo?.data
      ?.flatMap((group: any, index: number) =>
        group.winners_info.map((user: any, i: number) => ({
          id: user.ticket_id || `${index}-${i}`,
          first_name: user.first_name || 'N/A',
          surname: user.last_name || 'N/A',
          email: user.email || 'N/A',
          phone: user.phone || 'N/A',
          address: user.address || 'N/A',
          profile_image: user.profile_picture || '/app/asset/user.png',
          ticket_number: user.ticket_id || '43529656',
          product_redeemed: user.product || 'N/A',
          redemption_status: user.redemption_status || 'Pending',
          notify: user.redemption_status === 'Pending',
        }))
      ).filter(
        (user: any, index: number, self: any) =>
          index === self.findIndex((u: any) => u.ticket_number === user.ticket_number)
      ) || [];
  
  

    // Filter users based on search
    const filteredUsers = users.filter((user: any) => {
        const val = search.toLowerCase();
        return (
            user.first_name.toLowerCase().includes(val) ||
            user.surname.toLowerCase().includes(val) ||
            user.email.toLowerCase().includes(val) ||
            user.phone.includes(val) ||
            user.address.toLowerCase().includes(val)
        );
    });

    // Pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    if (prodLoading || userLoading || winnerLoading) {
        return <Loading />;
    }

    // Helper for status dot color
    const getStatusDot = (status: string) => {
        if (status !== 'Pending') return 'bg-green-500';
        if (status === 'Pending') return 'bg-yellow-400';
        return 'bg-gray-300';
    };

    return (
        <div className="min-h-screen bg-gray-100 w-full flex flex-col items-center font-poppins">
            <div className="w-full bg-gray-100" style={{ width: '100', maxWidth: '80%' }}>
                <div className="flex flex-col">
                    <ProfileHeader />
                    <div className="flex items-center justify-between w-full">
                        <p
                            className="text-[#F25E26] underline cursor-pointer mt-2 mb-0 p-4 lg:px-14 px-7"
                            onClick={() => router.back()}
                        >
                            Back
                        </p>
                        <h1 className="text-lg md:text-xl lg:text-2xl py-2 mb-6 font-semibold text-center flex-1">Winners Information</h1>
                        <span className="w-24" />
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

            {/* Search Bar */}
           

            <div className="w-full flex justify-center items-center mt-8 px-2" style={{ width: '100', maxWidth: '75%' }}>
                <div className="w-full">


                        <div className="w-full sm:w-1/2 md:w-1/3 flex items-center bg-white rounded-lg shadow px-4 py-2 my-4">
                        <CiSearch className="text-xl mx-2 text-gray-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search here..."
                            className="flex-1 border-none outline-none bg-transparent text-base px-2"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                        />
                        </div>
                </div>
            </div>

            {/* User Cards Grid */}
            <div className="w-full flex justify-center mt-8 px-2" style={{ width: '100%', maxWidth: '75%' }}>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {paginatedUsers.map((user: any, idx: number) => (
                        <div key={user.id} className="bg-[#fcf7f4] rounded-xl shadow p-6 flex flex-col gap-2 min-h-[320px] relative">
                            <div className="flex items-center gap-3 mb-2">
                                <Image
                                    src={user.profile_image.startsWith('http') ? user.profile_image : `https://staging.ajiroba.ng${user.profile_image}`}
                                    alt={user.first_name}
                                    width={48}
                                    height={48}
                                    className="rounded-full border-2 border-[#F25E26]"
                                />

                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                <div className="font-medium font-Poppins text-base text-[#111111]">First Name:</div>
                                <div className=" font-Poppins font-medium text-sm text-[#111111]">{user.first_name}</div>
                                <div className="font-medium font-Poppins text-base text-[#111111]">Surname:</div>
                                <div className=" font-Poppins font-medium text-sm text-[#111111]">{user.first_name}</div>
                                <div className="font-medium font-Poppins text-base text-[#111111]">Email:</div>
                                <div className=" font-Poppins font-medium text-sm text-[#111111]">{user.email}</div>
                                <div className="font-medium font-Poppins text-base text-[#111111]">Phone:</div>
                                <div className=" font-Poppins font-medium text-sm text-[#111111]">{user.phone}</div>
                                <div className="font-medium font-Poppins text-base text-[#111111]">Address:</div>
                                <div className=" font-Poppins font-medium text-sm text-[#111111]">{user.address}</div>
                                <div className="font-medium font-Poppins text-base text-[#111111]">Ticket Number:</div>
                                <div className=" font-Poppins font-medium text-sm text-[#111111]">{user.ticket_number}</div>

                                <div className="font-medium font-Poppins text-base text-[#111111]">Product Redeemed:</div>
                                <div className=" font-Poppins font-medium text-sm text-[#111111]">{user.product_redeemed}</div>

                                <div className="font-medium font-Poppins text-base text-[#111111]">Redemption status:</div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-block w-4 h-4 rounded-full border ${getStatusDot(user.redemption_status)}`}></span>

                                </div>
                            </div>
                            {user.notify && (
                                <>
                                    <button
                                        className="absolute bottom-4 right-4 bg-[#F25E26] text-white text-xs px-4 py-1 rounded font-semibold font-Poppins shadow flex"
                                        onClick={() => { setIsModalOpen(true); setModalUser(user); }}
                                    >
                                        <CiBellOn className="mr-1 mt-0.5" />  Notify
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            {/*  <div className="w-full flex justify-center mt-8 mb-8">
                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-100"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        <IoIosArrowRoundBack size={20} />
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={`px-3 py-1 rounded ${currentPage === index + 1
                                ? "bg-[#FFECE5] text-[#EB5017] font-semibold"
                                : "bg-white text-gray-500 hover:bg-gray-100"}`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-100"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        <IoIosArrowRoundForward size={20} />
                    </button>
                </div>
            </div> */}

            <Pagination
                pageCount={totalPages}
                onPageChange={({ selected }) => setCurrentPage(selected + 1)}
                className='my-6 flex items-center justify-center gap-4 '
            />

            {/* Modal for confirmation */}
            <ModalComponent
                isModalOpen={isModalOpen}
                handleCancel={() => setIsModalOpen(false)}
                content={
                    <div className="flex flex-col items-center justify-center p-6">
                        <p className="text-center text-lg font-Poppins font-medium mb-8 mt-2">Before you proceed, please confirm if the product has been physically delivered</p>
                        <div className="flex flex-col gap-4 w-full items-center">
                            <button
                                className="w-full bg-[#FDE6DF] text-[#222] font-Poppins font-medium rounded-lg py-3 mb-2 border-none focus:outline-none hover:bg-[#fcd2c2] transition"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Yes
                            </button>
                            <button
                                className="w-full bg-white text-[#222] font-Poppins font-medium rounded-lg py-3 border border-[#F25E26] focus:outline-none hover:bg-[#f9e3db] transition"
                                onClick={() => setIsModalOpen(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                }
            />


        </div>
    );
}