"use client";
import React, { useState, useEffect } from "react";
import { ProfileHeader } from "@/app/components/Header";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Brand from "@/app/asset/logo.svg";
import { DownloadModal } from "@/app/components/DownloadModal";
import { exportToPDF, exportToXLS, ExportData } from "@/utils/exportUtils";
import RaffleTicket from "@/app/dashboard/components/RaffleTicket";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const productId = params.slug;

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showTicket, setShowTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

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

  // Mock product data based on the image
  const productData = {
    category: "Fashion",
    subCategory: "Men's Fashion",
    productName: "T-shirt",
    weight: "5kg",
    uploadedBy: "Idowu Shayo",
    raffleDate: "15-March-2024",
    time: "12:00PM",
    duration: "3 Hours",
    totalBidders: 120,
    productId: "2357835",
    ticketsSold: 300,
    ticketAmount: 200,
    totalAmount: 100000,
    rda: 60000,
    eca: 40000
  };

  // Mock ticket data based on the image
  const ticketData = [
    { sn: 1, userId: "26358A", customerName: "Tania Jacobs", ticketNumber: "264345" },
    { sn: 2, userId: "26358A", customerName: "Tania Jacobs", ticketNumber: "264346" },
    { sn: 3, userId: "26358A", customerName: "Tania Jacobs", ticketNumber: "264347" },
    { sn: 4, userId: "26358A", customerName: "Tania Jacobs", ticketNumber: "264348" },
    { sn: 5, userId: "26358A", customerName: "Tania Jacobs", ticketNumber: "264349" },
    { sn: 6, userId: "26358A", customerName: "Tania Jacobs", ticketNumber: "264350" },
    { sn: 7, userId: "26358A", customerName: "Tania Jacobs", ticketNumber: "264351" },
    { sn: 8, userId: "26358A", customerName: "Tania Jacobs", ticketNumber: "264352" },
    { sn: 9, userId: "26358A", customerName: "Tania Jacobs", ticketNumber: "264353" },
    { sn: 10, userId: "26358A", customerName: "Tania Jacobs", ticketNumber: "264354" },
  ];


  const prodInfo = {
    category: "Fashion",
    subcategory: "Men's Fashion",
    product_name: "T-shirt",
    weight: "5kg",
    uploaded_by: "Idowu Shayo",
    date_of_raffle: "15-March-2024",
    time_of_raffle: "12:00PM",
    duration: "3 Hours",
    bidders: 120,
    product_no: "2357835",
    no_of_tickets_sold: 300,
    ticket_amount: 200,
    total_amount: 100000,
  };

  // Download handlers
  const handleDownloadPDF = async () => {
    const exportData: ExportData[] = ticketData.map((item) => ({
      sn: item.sn,
      userId: item.userId,
      customerName: item.customerName,
      ticketNumber: item.ticketNumber,
    }));
    setShowDownloadModal(false);
    await exportToPDF(exportData, {
      title: "List of Tickets",
      fileName: "List_of_Tickets",
    });
  };

  const handleDownloadXLS = () => {
    const exportData: ExportData[] = ticketData.map((item) => ({
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
          {/* Product Summary Section */}
          {/* <div 
            className="bg-gray-800 rounded-lg p-6 mb-6 relative overflow-hidden"
            style={{
              backgroundImage: `url(/asset/image/auctionproductdetailsbanner.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay'
            }}
          >
            <div className="relative z-10">
              <h2 className="text-white text-xl font-semibold mb-4">Product Summary</h2>
              <div className="grid grid-cols-3 gap-8 text-white">
                <div className="space-y-2">
                  <div><span className="font-medium">Category:</span> {productData.category}</div>
                  <div><span className="font-medium">Sub category:</span> {productData.subCategory}</div>
                  <div><span className="font-medium">Product Name:</span> {productData.productName}</div>
                  <div><span className="font-medium">Weight:</span> {productData.weight}</div>
                  <div><span className="font-medium">Uploaded By:</span> {productData.uploadedBy}</div>
                </div>
                <div className="space-y-2">
                  <div><span className="font-medium">Date of Raffle:</span> {productData.raffleDate}</div>
                  <div><span className="font-medium">Time:</span> {productData.time}</div>
                  <div><span className="font-medium">Duration:</span> {productData.duration}</div>
                  <div><span className="font-medium">Total no of bidders:</span> {productData.totalBidders}</div>
                  <div><span className="font-medium">Product ID:</span> {productData.productId}</div>
                </div>
                <div className="space-y-2">
                  <div><span className="font-medium">No of tickets sold:</span> {productData.ticketsSold}</div>
                  <div><span className="font-medium">Ticket amount:</span> N{productData.ticketAmount}</div>
                  <div><span className="font-medium">Total amount:</span> <span className="font-bold">N{productData.totalAmount.toLocaleString()}</span></div>
                  <div><span className="font-medium">RDA:</span> <span className="font-bold">N {productData.rda.toLocaleString()}</span></div>
                  <div><span className="font-medium">ECA:</span> <span className="font-bold">N {productData.eca.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div> */}


<div className="w-full flex justify-center items-center mt-8 px-2" style={{ width: '100', maxWidth: '100%' }}>
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
                                    <span className="font-semibold text-[#222]">{prodInfo?.category}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Sub category:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.subcategory}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Product Name:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.product_name}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Weight:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.weight}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Uploaded By:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.uploaded_by}</span>
                                </div>
                            </div>
                            {/* Middle Column */}
                            <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Date of Raffle:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.date_of_raffle}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Time:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.time_of_raffle}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Duration:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.duration || 'N/A'}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Total no of bidders:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.bidders}</span>
                                </div>
                            </div>
                            {/* Right Column */}
                            <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
                                <div className="flex items-center gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Product ID:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.product_no}</span>
                                    <span className="ml-2 w-3 h-3 rounded-full bg-green-500 inline-block" />
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">No of tickets sold:</span>
                                    <span className="font-semibold text-[#F25E26]">{prodInfo?.no_of_tickets_sold}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Ticket amount:</span>
                                    <span className="font-semibold text-[#222]">{prodInfo?.ticket_amount}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Total amount:</span>
                                    <span className="font-semibold text-[#F25E26]">{prodInfo?.total_amount}</span>
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
              <span>TICKET SUMMARY (5, May, 2025; 4:30PM)</span>
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
                  {ticketData.map((ticket, index) => (
                    <tr key={index} className="border-b border-gray-300">
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
          ticket_price={productData.ticketAmount || 'N/A'}
          purchase_date={productData.raffleDate || 'N/A'}
          product={productData.productName || 'N/A'}
          raffle_date={productData.raffleDate || 'N/A'}
          raffle_time={productData.time || 'N/A'}
        />
      )}
    </section>
  );
}
