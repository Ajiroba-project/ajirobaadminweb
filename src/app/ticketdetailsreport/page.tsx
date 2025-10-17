"use client";
import React, { useState, useEffect, Suspense } from "react";
import { ProfileHeader } from "@/app/components/Header";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Brand from "@/app/asset/logo.svg";
import { DownloadModal } from "@/app/components/DownloadModal";
import { exportToPDF, exportToXLS, exportToPDFTable, ExportData } from "@/utils/exportUtils";
import RaffleTicket from "@/app/dashboard/components/RaffleTicket";
import { useGetDatanew } from "@/hooks/useGetData";
import Cookies from "js-cookie";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";

// Type definitions for the API response
interface TicketDetails {
  ticket_number: string;
  ticket_price: number;
  purchase_date: string;
  product: string;
  raffle_date: string;
  raffle_time: string;
}

interface CustomerDetails {
  user_id: string;
  customer_name: string;
}

interface TicketItem {
  id: string;
  customer_details: CustomerDetails;
  ticket_details: TicketDetails;
}

interface TicketApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    status: string;
    message: string;
    current_datetime: string;
    data: TicketItem[];
  };
}

interface TransformedTicket {
  sn: number;
  userId: string;
  customerName: string;
  ticketNumber: string;
  ticketPrice: number;
  purchaseDate: string;
  product: string;
  raffleDate: string;
  raffleTime: string;
  id: string;
}

function TicketDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productno');
  const itemId = searchParams.get('itemid');

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showTicket, setShowTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TransformedTicket | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userToken, setUserToken] = useState(Cookies.get("token"));

  let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/view_admin_auction/${productId}`;

  const {
      data: prodInfo,
      isLoading: prodLoading,
      error: prodError,
  } = useGetDatanew(url, "get_prod_details", userToken || " ");

  let ticketurl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/ticket_summary/${productId}?page=${currentPage}`;

  const {
      data: ticketdata,
      isLoading: ticketLoading,
      error: ticketError,
  } = useGetDatanew(ticketurl, "get_ticket_details", userToken || " ");

  useEffect(() => {
    setCurrentTime(
      new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    );
  }, []);

  // Transform API data to match expected format
  const transformedTicketData: TransformedTicket[] = (ticketdata as unknown as TicketApiResponse)?.results?.data?.map((ticket: TicketItem, index: number) => ({
    sn: (currentPage - 1) * 10 + index + 1,
    userId: ticket.customer_details?.user_id || 'N/A',
    customerName: ticket.customer_details?.customer_name || 'N/A',
    ticketNumber: ticket.ticket_details?.ticket_number || 'N/A',
    ticketPrice: ticket.ticket_details?.ticket_price || 0,
    purchaseDate: ticket.ticket_details?.purchase_date || 'N/A',
    product: ticket.ticket_details?.product || 'N/A',
    raffleDate: ticket.ticket_details?.raffle_date || 'N/A',
    raffleTime: ticket.ticket_details?.raffle_time || 'N/A',
    id: ticket.id
  })) || [];

  // Pagination handlers
  const handleNextPage = () => {
    if ((ticketdata as unknown as TicketApiResponse)?.next) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if ((ticketdata as unknown as TicketApiResponse)?.previous && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Download handlers
  const handleDownloadPDF = async () => {
    const exportData: ExportData[] = transformedTicketData.map((item: TransformedTicket) => ({
      sn: item.sn,
      userId: item.userId,
      customerName: item.customerName,
      ticketNumber: item.ticketNumber,
    }));
    setShowDownloadModal(false);
    await exportToPDFTable(exportData, {
      title: "List of Tickets",
      fileName: "List_of_Tickets",
      columns: [
        { key: 'sn', header: 'S/N' },
        { key: 'userId', header: 'User ID' },
        { key: 'customerName', header: 'Customer Name' },
        { key: 'ticketNumber', header: 'Ticket Number' },
      ],
    });
  };

  const handleDownloadXLS = () => {
    const exportData: ExportData[] = transformedTicketData.map((item: TransformedTicket) => ({
      sn: item.sn,
      userId: item.userId,
      customerName: item.customerName,
      ticketNumber: item.ticketNumber,
    }));
    exportToXLS(exportData, {
      title: "List of Tickets",
      fileName: "List_of_Tickets",
      columns: [
        { key: "sn", header: "S/N", width: 10 },
        { key: "userId", header: "USER ID", width: 15 },
        { key: "customerName", header: "CUSTOMER NAME", width: 25 },
        { key: "ticketNumber", header: "TICKET NUMBER", width: 20 },
      ],
      summaryRows: [
        { label: "Total Records", value: exportData.length },
        { label: "Generated", value: new Date().toLocaleString() },
      ],
    });
    setShowDownloadModal(false);
  };

  const AjirobaLogo = () => (
    <div className="flex items-center bg-white py-1 px-2 md:px-3 rounded-md shadow-md">
      <Link href={"/"} className={``}>
        <Image src={Brand} alt="brand-logo" />
      </Link>
    </div>
  );

  if (ticketLoading) {
    return (
      <section className="flex flex-col">
        <div className="w-full bg-gray-100">
          <ProfileHeader />
          <div className="px-4 md:px-14 py-4">
            <p
              className="text-[#F25E26] underline cursor-pointer"
              onClick={() => router.back()}
            >
              Back
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading ticket data...</div>
        </div>
      </section>
    );
  }

  if (ticketError) {
    return (
      <section className="flex flex-col">
        <div className="w-full bg-gray-100">
          <ProfileHeader />
          <div className="px-4 md:px-14 py-4">
            <p
              className="text-[#F25E26] underline cursor-pointer"
              onClick={() => router.back()}
            >
              Back
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error loading ticket data. Please try again.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col">
      <div className="w-full bg-gray-100">
        <ProfileHeader />
        <div className="px-4 md:px-14 py-4">
          <p
            className="text-[#F25E26] underline cursor-pointer"
            onClick={() => router.back()}
          >
            Back
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-14 py-4 gap-2">
          <h1 className="text-[#111111] text-lg font-Poppins font-semibold">
            List of Tickets
          </h1>
          <button
            onClick={() => setShowDownloadModal(true)}
            className="rounded-md bg-[#f25e26] px-6 py-2 text-white text-sm hover:bg-[#d63918] transition-colors"
          >
            Download
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-7/12">
          {/* Product Summary Card */}
          <div className="w-full flex justify-center items-center mt-8 my-8" style={{ width: '100', maxWidth: '' }}>
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

          {/* Ticket Summary Section */}
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="flex flex-row items-center gap-4 px-4 md:px-8 pt-8 pb-2">
              <AjirobaLogo />
            </div>
            <div className="bg-[#F25E26] text-white font-Poppins font-medium px-4 md:px-8 py-2 flex items-center justify-between text-sm">
              <span>TICKET SUMMARY ({currentTime})</span>
          
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">S/N</th>
                    <th className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">USER ID</th>
                    <th className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">CUSTOMER NAME</th>
                    <th className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">TICKET NUMBER</th>
                  </tr>
                </thead>
                <tbody>
                  {transformedTicketData.map((ticket: TransformedTicket, index: number) => (
                    <tr key={ticket.id || index} className="border-b border-gray-300">
                      <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">
                        {ticket.sn}
                      </td>
                      <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">
                        {ticket.userId}
                      </td>
                      <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">
                        {ticket.customerName}
                      </td>
                      <td className="p-3 border border-gray-300 text-sm text-[#F25E26] font-Poppins font-medium">
                        <span 
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowTicket(true);
                          }}
                          className="text-[#F25E26] underline cursor-pointer hover:text-[#d63918]"
                        >
                          {ticket.ticketNumber}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>


              <div className="flex justify-center items-center gap-4 mt-4">
                <span>Total: {(ticketdata as unknown as TicketApiResponse)?.count || 0} tickets</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={!(ticketdata as unknown as TicketApiResponse)?.previous}
                    className={`px-3 py-1 rounded text-xs ${
                      (ticketdata as unknown as TicketApiResponse)?.previous 
                        ? 'bg-white text-[#F25E26] hover:bg-gray-100' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-xs">Page {currentPage}</span>
                  <button
                    onClick={handleNextPage}
                    disabled={!(ticketdata as unknown as TicketApiResponse)?.next}
                    className={`px-3 py-1 rounded text-xs ${
                      (ticketdata as unknown as TicketApiResponse)?.next 
                        ? 'bg-white text-[#F25E26] hover:bg-gray-100' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownloadPDF={handleDownloadPDF}
        onDownloadXLS={handleDownloadXLS}
      />

      {showTicket && selectedTicket && (
        <RaffleTicket
          onClose={() => setShowTicket(false)}
          ticket_number={selectedTicket.ticketNumber || 'N/A'}
          ticket_price={selectedTicket.ticketPrice || 'N/A'}
          purchase_date={selectedTicket.purchaseDate || 'N/A'}
          product={selectedTicket.product || 'N/A'}
          raffle_date={selectedTicket.raffleDate || 'N/A'}
          raffle_time={selectedTicket.raffleTime || 'N/A'}
        />
      )}
    </section>
  );
}

export default function Page() {
  useAuthMiddleware(useRouter());

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    }>
      <TicketDetailsContent />
    </Suspense>
  );
}
