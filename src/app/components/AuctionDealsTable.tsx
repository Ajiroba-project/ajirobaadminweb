'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import icon from "../../asset/image/icon.svg"
import Image from 'next/image';
import chart from '../../asset/image/chart.svg'
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import { IoFilter } from 'react-icons/io5';
import { FiSearch } from 'react-icons/fi';
import { BsCalendar3 } from 'react-icons/bs';
import DatePicker from 'react-datepicker';
import { useParams, useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { useGetDatanew } from '@/hooks/useGetData';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Loading from '@/app/components/Loading';
import { exportToCSV } from '@/utils/exportUtils';
import "react-datepicker/dist/react-datepicker.css";
import ajirobalogo from '@/app/asset/logo.svg'

function AuctionDealsTable({ onRegisterExport }: { onRegisterExport?: (fn: () => void) => void }) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const params = useParams();
  const productId = params.slug;
  const [userToken, setUserToken] = useState(Cookies.get("token"));
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/auction_transactions/`;

  const {
    data: transInfo,
    isLoading: transLoading,
    error: transError,
  } = useGetDatanew(url, "get_catandsubcat_details", userToken || " ");

  // console.log(transInfo, "transInfo-----transInfo");

  const transactions = transInfo && transInfo?.data?.map((order: { ticket_number: any, auction: any, ticket_amount: any, status: any, order_id: any; name: any; email: any; products: any[]; date_created: string | number | Date; profile_image: any; amount: any }, index: number) => ({
    id: order?.ticket_number,
    name: order.name,
    email: order.email,
    status: order?.status || 'N/A',
    amount: order?.ticket_amount || 'N/A',
    item: order.auction,
    date: new Date(order.date_created).toLocaleDateString("en-GB"),
    img: order.profile_image ? `https://staging.ajiroba.ng${order.profile_image}` : null,
  }));

  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const menuWrapperRef = useRef<HTMLDivElement | null>(null);

  const itemsPerPage = 10;

  const filteredTransactions = transactions?.filter((transaction: { id: string | number; name: string; email: string; item: string; date: string | string[]; }) => {
    const matchesSearch =
      transaction.name.toLowerCase().includes(search.toLowerCase()) ||
      transaction.email.toLowerCase().includes(search.toLowerCase()) ||
      transaction.item.toLowerCase().includes(search.toLowerCase()) ||
      transaction.date.includes(search) ||
      String(transaction.id ?? '').toLowerCase().includes(search.toLowerCase());

    const matchesSelectedDate =
      !selectedDate ||
      (() => {
        const [dd, mm, yyyy] = (transaction.date as string).split('/').map(Number);
        const tx = new Date(yyyy, mm - 1, dd);
        return (
          tx.getFullYear() === selectedDate.getFullYear() &&
          tx.getMonth() === selectedDate.getMonth() &&
          tx.getDate() === selectedDate.getDate()
        );
      })();

    return matchesSearch && matchesSelectedDate;
  });

  // Register CSV exporter with parent using latest data via ref
  const exportColumns = useMemo(() => ([
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status' },
    { key: 'item', header: 'Item' },
    { key: 'date', header: 'Date' },
  ]), []);
  const latestDataRef = useRef<any[]>([]);
  useEffect(() => {
    latestDataRef.current = filteredTransactions || [];
  }, [filteredTransactions]);
  useEffect(() => {
    if (!onRegisterExport) return;
    onRegisterExport(() => exportToCSV(latestDataRef.current, { fileName: 'Auction_Transactions', columns: exportColumns }));
  }, [onRegisterExport, exportColumns]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredTransactions?.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredTransactions?.length / itemsPerPage);

  const isAllSelected =
    paginatedData?.length > 0 &&
    paginatedData.every((transaction: { id: number; }) => selectedRows.includes(transaction.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      const pageIds = paginatedData.map((transaction: { id: any; }) => transaction.id);
      setSelectedRows((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleRowSelection = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Generate page numbers with ellipsis for long pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleConfirmDelivery = (transaction: any) => {
    setSelectedTicket(transaction);
    setShowConfirmModal(true);
    setMenuOpen(null);
  };

  // Close the action menu when clicking/touching outside
  useEffect(() => {
    if (menuOpen === null) return;

    function handlePointerOutside(event: MouseEvent | TouchEvent) {
      const targetNode = event.target as Node | null;
      if (
        menuWrapperRef.current &&
        targetNode &&
        !menuWrapperRef.current.contains(targetNode)
      ) {
        setMenuOpen(null);
      }
    }

    document.addEventListener('mousedown', handlePointerOutside, true);
    document.addEventListener('touchstart', handlePointerOutside, true);
    return () => {
      document.removeEventListener('mousedown', handlePointerOutside, true);
      document.removeEventListener('touchstart', handlePointerOutside, true);
    };
  }, [menuOpen]);

  const confirmDelivery = async () => {
    if (!selectedTicket) return;
    
    setIsConfirming(true);
    try {
      const response = await fetch(`https://ajiroba.onrender.com/v1/admin/confirm_redeemed_ticket/${selectedTicket.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || 'Ticket confirmed successfully!');
        // Optionally refresh the data or update the UI
      } else {
        alert(data.message || 'Failed to confirm ticket');
      }
    } catch (error) {
      alert('An error occurred while confirming the ticket');
      console.error('Error:', error);
    } finally {
      setIsConfirming(false);
      setShowConfirmModal(false);
      setSelectedTicket(null);
    }
  };

  if (transLoading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 min-w-0 w-full">
            <div className="relative w-full sm:flex-1 sm:max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search here..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg font-Poppins text-sm focus:outline-none focus:border-[#FCDFD4] focus:ring-1 focus:ring-[#FCDFD4]"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            
            <button
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-[#344054] font-Poppins text-sm hover:bg-gray-50 transition-colors duration-200 shrink-0 w-full sm:w-auto justify-center"
              onClick={() => alert("Filter functionality coming soon!")}
            >
              <IoFilter size={16} />
              Filter
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => { setSelectedDate(date as Date | null); setCurrentPage(1); }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select date"
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-[#344054] font-Poppins text-sm w-full sm:w-[160px]"
              isClearable
            />
            {selectedDate && (
              <button
                className="px-3 py-2 border border-gray-300 rounded-lg text-[#667185] text-sm hover:bg-gray-50 w-full sm:w-auto"
                onClick={() => { setSelectedDate(null); setCurrentPage(1); }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-[#F9FAFB] border-b border-gray-200">
            <tr className="text-[#344054] font-Poppins font-medium text-sm">
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-[#FCDFD4] focus:ring-[#FCDFD4]"
                />
              </th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Item</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((transaction: any) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-50 border-b border-gray-100 transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(transaction.id)}
                    onChange={() => toggleRowSelection(transaction.id)}
                    className="rounded border-gray-300 text-[#FCDFD4] focus:ring-[#FCDFD4]"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {transaction.img ? (
                        <Image src={transaction.img} alt="Profile" width={32} height={32} className="w-full h-full object-cover" />
                      ) : (
                        <Image src={ajirobalogo} alt="Default" width={20} height={20} />
                      )}
                    </div>
                    <span className="font-Poppins text-sm text-[#1D2739] font-medium">
                      {transaction.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-Poppins text-sm text-[#667185]">
                  {transaction.email}
                </td>
                <td className="px-6 py-4 font-Poppins text-sm text-[#667185]">
                  {transaction.status}
                </td>
                <td className="px-6 py-4 font-Poppins text-sm text-[#667185]">
                  {transaction.item}
                </td>
                <td className="px-6 py-4 font-Poppins text-sm text-[#667185]">
                  {transaction.date}
                </td>
                <td className="px-6 py-4">
                  <div
                    className="relative inline-block"
                    ref={menuOpen === transaction.id ? menuWrapperRef : null}
                  >
                    <button
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
                      onClick={() =>
                        setMenuOpen((prev: number | null) =>
                          prev === transaction.id ? null : transaction.id
                        )
                      }
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    {menuOpen === transaction.id && (
                      <div className="absolute right-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 px-4 py-2 min-w-[150px]">
                        <button
                          className="w-full px-4 py-2 text-left text-sm bg-[#E84526] rounded-lg text-white hover:bg-[#D63A1F] font-Poppins font-medium transition-colors duration-200"
                          onClick={() => {
                            setMenuOpen(null);
                            router.push(`/dashboard/auctiondeals/${transaction.id}`);
                          }}
                        >
                          View details
                        </button>
                        <button
                          className="w-full text-center py-2  text-sm bg-[#E84526] rounded-lg text-white hover:bg-[#D63A1F] font-Poppins font-medium transition-colors duration-200 mt-2"
                          onClick={() => handleConfirmDelivery(transaction)}
                        >
                          Confirm Redemption
                        </button>
                        <button
                          className="w-full text-center px-4 py-2  text-sm bg-white border border-[#E84526] rounded-lg text-[#E84526] hover:bg-gray-50 font-Poppins font-medium transition-colors duration-200 mt-2"
                          onClick={() => setMenuOpen(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[#667185] text-sm font-Poppins">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            {generatePageNumbers().map((page, index) => (
              <button
                key={index}
                className={`px-3 py-2 rounded-lg text-sm font-Poppins font-medium transition-colors duration-200 ${
                  page === currentPage
                    ? "bg-[#FFECE5] text-[#EB5017]"
                    : page === '...'
                    ? "text-[#98A2B3] cursor-default"
                    : "text-[#667185] hover:bg-gray-100"
                }`}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 text-[#344054] border border-gray-300 rounded-lg font-Poppins text-sm hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <IoIosArrowRoundBack size={20} />
              Previous
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 text-[#344054] border border-gray-300 rounded-lg font-Poppins text-sm hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
              <IoIosArrowRoundForward size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Delivery Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowConfirmModal(false)}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-[#E84526] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">?</span>
              </div>
              
              {/* Title */}
              <h2 className="text-xl font-Poppins font-bold text-black mb-3">
                Confirm Product Redemption
              </h2>
              
              {/* Description */}
              <p className="text-sm font-Poppins text-gray-700 mb-6">
                Please ensure that the customers have redeemed their gifts
              </p>
              
              {/* Confirm Button */}
              <button
                className="w-full bg-[#FCDFD4] text-black font-Poppins font-medium py-3 px-6 rounded-lg hover:bg-[#F25E26] hover:text-white transition-colors duration-200"
                onClick={confirmDelivery}
                disabled={isConfirming}
              >
                {isConfirming ? 'Confirming...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuctionDealsTable