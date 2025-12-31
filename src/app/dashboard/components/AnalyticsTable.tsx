'use client'
import React, { useState } from 'react'
import icon from "../../asset/image/icon.svg"
import Image from 'next/image';
import { useRouter } from "next/navigation";
import ModalComponent from '@/app/components/ModalComponent';
import BarChart from './BarTable';
import Cookies from 'js-cookie';
import { useGetDatanew } from '@/hooks/useGetData';
import { toast } from 'react-toastify';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function AnalyticsTable() {

  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('All');


  const userToken = Cookies.get('token') as string;

  const [giftPointEmail, setGiftPointEmail] = useState<string | null>(null);

  const { data: analyticsInfo, isLoading: anaLoading, error, isError } = useGetDatanew(
    `/api/getanalytics/`,
    "get_analytics_details",
    userToken || " ",
  );


  // const BASE_URL = "https://staging.ajiroba.ng/v1";

  const formatted = analyticsInfo?.data?.infromation?.top_five_customers.map((customer: { full_name: any; email: any; date: string | number | Date; picture: any; }, index: number) => ({
    id: index + 1,
    name: customer.full_name,
    email: customer.email,
    date: new Date(customer.date).toLocaleDateString("en-GB"), // Formats to dd/mm/yyyy
    originalDate: customer.date, // Keep original date for filtering
    img: customer.picture ? `${process.env.NEXT_PUBLIC_BASE_URL_IMG}${customer.picture}` : icon, // Use fallback icon if picture is null
  })) || [];

  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState<number | null>(null); // Track which row's menu is open
  const [updateCategory, setUpdateCategory] = useState(false);

  const handleUpdateSubCategory = () => {
    setUpdateCategory(!updateCategory);
  };



  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };



  const filterByDateRange = (transactionDate: string | number | Date, days: number) => {
    try {
      const transactionDateObj = new Date(transactionDate);
      const currentDate = new Date();
      const pastDate = new Date(currentDate);
      pastDate.setDate(currentDate.getDate() - days);
      
      // Reset time to start of day for accurate comparison
      pastDate.setHours(0, 0, 0, 0);
      transactionDateObj.setHours(0, 0, 0, 0);
      
      return transactionDateObj >= pastDate;
    } catch (error) {
      console.error('Error filtering by date:', error);
      return false;
    }
  };

  const itemsPerPage = 5;

  // Filtered Data Based on Search and Selected Option
  const filteredTransactions = formatted?.filter((transaction: { name: string; email: string; date: string; originalDate: string | number | Date; }) => {
    const matchesSearch =
      transaction.name.toLowerCase().includes(search.toLowerCase()) ||
      transaction.email.toLowerCase().includes(search.toLowerCase()) ||
      transaction.date.includes(search);

    let matchesSelectedOption = true;
    
    if (selectedOption !== 'All') {
      const days = parseInt(selectedOption);
      if (!isNaN(days)) {
        matchesSelectedOption = filterByDateRange(transaction.originalDate, days);
      }
    }

    return matchesSearch && matchesSelectedOption;
  });


  // Pagination Logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredTransactions?.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredTransactions?.length / itemsPerPage);

  // Select All Logic
  interface Transaction {
    id: number;
    name: string;
    email: string;
    date: string;
    originalDate: string | number | Date;
    img: string;
  }

  const isAllSelected: boolean =
    paginatedData.length > 0 &&
    paginatedData.every((transaction: Transaction) => selectedRows.includes(transaction.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      const pageIds: number[] = paginatedData.map((transaction: Transaction) => transaction.id);
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



  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [giftPoint, setGiftPoint] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGiftPoint = async () => {
    if (!giftPoint || isNaN(Number(giftPoint))) {
      toast.error('Please enter a valid number of points');
      return;
    }

    setIsSubmitting(true);
    try {

      let data;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/gift_points/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${userToken}`
        },
        body: JSON.stringify({
          email: selectedEmail,
          point: giftPoint
        })
      });

      data = await response.json();

      if (response.ok) {
        /*   console.log(data, "data"); */
        toast.success(data.message || 'Points gifted successfully');
        setSelectedEmail(null);
        setGiftPoint('');
      } else {
        /*  console.log(data, "data"); */
        toast.error(data.message || data.detail || 'Failed to gift points');
      }
    } catch (error) {
      toast.error('An error occurred while gifting points');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (anaLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            fill="none"
            strokeWidth="4"
            stroke="currentColor"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
          />
        </svg>
      </div>
    );
  }



  return (

    <div>


      <div className="p-4 max-w-7xl mx-auto rounded-lg shadow-md bg-white">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className='flex w-full md:w-1/3 gap-4'>
            <h1 className='text-lg font-Poppins text-[#111111] font-semibold'>Top 5 Customer Engagement</h1>
          </div>
          
          {/* Date Range Filter */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <label htmlFor="dateRange" className="text-sm font-medium text-gray-700">
              Filter by Date Range:
            </label>
            <Select value={selectedOption} onValueChange={handleOptionChange}>
              <SelectTrigger className="h-10 w-[160px] rounded border px-3 selector">
                <SelectValue placeholder="Filter by Date Range" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: '#ffffff', color: '#2A2A2A' }}>
                <SelectItem value="All" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>All Time</SelectItem>
                <SelectItem value="5" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Past 5 Days</SelectItem>
                <SelectItem value="10" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Past 10 Days</SelectItem>
                <SelectItem value="30" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Past 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        {selectedOption !== 'All' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Showing results for the past {selectedOption} days. 
              Found {filteredTransactions?.length || 0} customer{filteredTransactions?.length !== 1 ? 's' : ''}.
            </p>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-[#E4E7EC]">
            <thead className="bg-[#F9FAFB] border border-gray-100">
              <tr className='text-[#344054] font-Poppins font-medium text-sm border border-[#E4E7EC]' >
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData && paginatedData.length > 0 ? (
                paginatedData.map((transaction: Transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-100 even:bg-gray-50 border border-b-[#E4E7EC]"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(transaction.id)}
                        onChange={() => toggleRowSelection(transaction.id)}
                      />
                    </td>
                    <td className="px-4 py-4 flex items-center space-x-2">
                      <Image src={transaction.img} alt="icon" width={30} height={30} />
                      <span className='text-[#101928] font-semibold font-Poppins text-sm'>{transaction.name}</span>
                    </td>
                    <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm">{transaction.email}</td>
                    <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm">{transaction.date}</td>
                    <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm relative">
                      <button
                        className="w-full min-w-[100px] max-w-xs px-4 py-2 text-sm font-medium rounded-lg bg-[#E84526] text-white transition-colors duration-200 hover:bg-[#d13d21] focus:outline-none focus:ring-2 focus:ring-[#F25E26] focus:ring-offset-2 disabled:opacity-60"
                        style={{ whiteSpace: 'nowrap' }}
                        onClick={() => setSelectedEmail(transaction.email)}
                      >
                        Gift Point
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    {selectedOption !== 'All' 
                      ? `No customers found in the past ${selectedOption} days.`
                      : 'No customers found.'
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-2 text-sm border rounded-lg transition-all duration-200 ${
                    currentPage === i + 1 
                      ? "bg-[#F25E26] text-white border-[#F25E26]" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#F25E26]"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        <BarChart />
      </div>

      <ModalComponent
        content={
          <div className="flex flex-col gap-6 p-4">
            <h2 className="text-xl font-semibold text-center">Enter Gift Point</h2>
            <div className="w-full">
              <input
                type="number"
                value={giftPoint}
                onChange={(e) => setGiftPoint(e.target.value)}
                placeholder="Enter points"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleGiftPoint}
                disabled={isSubmitting}
                className="bg-[#E84526] text-white px-6 py-2 rounded hover:bg-[#d13d21] disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Gift Point'}
              </button>
              <button
                onClick={() => {
                  setSelectedEmail(null);
                  setGiftPoint('');
                }}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        }
        isModalOpen={!!selectedEmail}
        showModal={() => { }}
        handleOk={() => { }}
        handleCancel={() => {
          setSelectedEmail(null);
          setGiftPoint('');
        }}
      />
    </div>
  )
}

export default AnalyticsTable