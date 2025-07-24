"use client";
import React, { useState, useEffect } from "react";
import { ProfileHeader } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import Brand from "@/app/asset/logo.svg";
import { RedeemedTable } from "../dashboard/components/RedeemedTable";
import { ReportsTable } from "../dashboard/components/ReportsTable";
import RaffleTicket from "../dashboard/components/RaffleTicket";
import { DownloadModal } from "@/app/components/DownloadModal";
import { exportToPDF, exportToXLS, ExportData } from "@/utils/exportUtils";
import { useGetDatanew } from "@/hooks/useGetData";
import Loading from "@/app/components/Loading";

// Define the API response types
interface Ticket {
  ticket_number: string;
  ticket_price: number;
  ticket_quantity: number;
  product: string;
  date_created: string;
}

interface UserInfo {
  customer_name: string;
  email: string;
  phone: string;
  gender: boolean;
  user_id: string;
}

interface ProductInfo {
  product_id: string;
  product_no: string;
  product_name: string;
}

interface TicketDetails {
  ticket_price: number;
  ticket_quantity: number;
  ticket_date: string;
  auction_start_date: string;
  auction_start_time: string;
}

interface AuctionCustomerData {
  id: string;
  user_info: UserInfo;
  product_info: ProductInfo;
  tickets: Ticket[];
  ticket_details: TicketDetails;
  date_modified: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    current_datetime: string;
    data: AuctionCustomerData[];
  };
}

export default function Page() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [dateFilterrd, setDateFilterrd] = useState("");
  const [filterBy, setFilterBy] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const [userToken] = useState(Cookies.get("token"));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [showticket, setShowTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.filter-dropdown') && !target.closest('.sort-dropdown')) {
        setShowFilterDropdown(false);
        setShowSortDropdown(false);
        setShowCustomDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Construct URL with query parameters based on filter selection
  const getFilterParams = () => {
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());

    switch (dateFilter) {
      case 'last_week':
        params.append('filter', 'last_week');
        break;
      case 'last_month':
        params.append('filter', 'last_month');
        break;
      case 'last_year':
        params.append('filter', 'last_year');
        break;
      case 'custom':
        // Only add custom filter if both start and end dates are provided
        if (customDateRange.start && customDateRange.end) {
          params.append('filter', 'custom');
          params.append('start_date', customDateRange.start);
          params.append('end_date', customDateRange.end);
        }
        break;
      default:
        // No filter applied
        break;
    }

    return params.toString();
  };

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/auction_customer_master_report/?${getFilterParams()}`;

  const {
    data: auctionCustomerData,
    isLoading: auctionCustomerLoading,
    error: auctionCustomerError,
  } = useGetDatanew(url, "get_auction_customer_master", userToken || " ");


  // console.log('Full auctionCustomerData:', auctionCustomerData);
  // console.log('auctionCustomerData?.data:', auctionCustomerData?.data);
  const apiData = auctionCustomerData?.data as any;
  // console.log('apiData?.results:', apiData?.results);

  // Transform API data to match the expected format
  const transformApiData = (apiData: any): any[] => {

    
    // Check if the data structure matches what we expect
    if (!apiData || !apiData.results || !apiData.results.data) {
  
      return [];
    }

  

    return apiData.results.data.map((item: any) => {
    
      
      return {
        customername: item.user_info?.customer_name || 'N/A',
        email: item.user_info?.email || 'N/A',
        phone: item.user_info?.phone || 'N/A',
        gender: item.user_info?.gender ? "Male" : "Female",
        userid: item.user_info?.user_id || 'N/A',
        productId: item.product_info?.product_no || 'N/A',
        productno: item.product_info?.product_id || 'N/A',
        productname: item.product_info?.product_name || 'N/A',
        nooftickets: item.tickets?.map((ticket: any) => ticket.ticket_number) || [],
        ticketunit: item.ticket_details?.ticket_price || 0,
        quantity: item.ticket_details?.ticket_quantity || 0,
        ticketprice: (item.ticket_details?.ticket_price || 0) * (item.ticket_details?.ticket_quantity || 0),
        ticketpurdate: item.ticket_details?.ticket_date || 'N/A',
        raffledrawdate: item.ticket_details?.auction_start_date || 'N/A',
        raffledrawtime: item.ticket_details?.auction_start_time || 'N/A',
        status: "Active",
        id: item.id || 'N/A',
      };
    });
  };



  const transformedData = transformApiData(auctionCustomerData || { count: 0, next: null, previous: null, results: { current_datetime: "", data: [] } });

  // Update pagination state when data changes
  useEffect(() => {
    if (auctionCustomerData) {
      const apiData = auctionCustomerData as any;
      const totalCount = apiData.count || 0;
      const calculatedTotalPages = Math.ceil(totalCount / pageSize);
      setTotalPages(calculatedTotalPages);
      setHasNextPage(!!apiData.next);
      setHasPreviousPage(!!apiData.previous);
    }
  }, [auctionCustomerData, pageSize]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, search, filterBy]);


  // console.log(transformedData, 'ttttt')

  // console.log(transformApiData, 'transformApiData')

  // Download handlers
  const handleDownloadPDF = async () => {
    const exportData: ExportData[] = transformedData.map((item) => ({
      customername: item.customername,
      email: item.email,
      phone: item.phone,
      gender: item.gender,
      userid: item.userid,
      productId: item.productId,
      productname: item.productname,
      nooftickets: item.nooftickets,
      ticketunit: item.ticketunit,
      quantity: item.quantity,
      ticketprice: item.ticketprice,
      ticketpurdate: item.ticketpurdate,
      raffledrawdate: item.raffledrawdate,
      raffledrawtime: item.raffledrawtime,
    }));

    setShowDownloadModal(false);
    await exportToPDF(exportData, {
      title: "Auction Transaction Report",
      fileName: "Auction_Transaction_Report"
    });
  };

  const handleDownloadXLS = () => {
    const exportData: ExportData[] = transformedData.map((item) => ({
      customername: item.customername,
      email: item.email,
      phone: item.phone,
      gender: item.gender,
      userid: item.userid,
      productId: item.productId,
      productname: item.productname,
      nooftickets: item.nooftickets,
      ticketunit: item.ticketunit,
      quantity: item.quantity,
      ticketprice: item.ticketprice,
      ticketpurdate: item.ticketpurdate,
      raffledrawdate: item.raffledrawdate,
      raffledrawtime: item.raffledrawtime,
    }));

    exportToXLS(exportData, {
      title: "Auction Transaction Report",
      fileName: "Auction_Transaction_Report",
      columns: [
        { key: 'customername', header: 'Customer Name', width: 20 },
        { key: 'email', header: 'Email Address', width: 25 },
        { key: 'phone', header: 'Phone Number', width: 15 },
        { key: 'gender', header: 'Gender', width: 10 },
        { key: 'userid', header: 'User ID', width: 12 },
        { key: 'productId', header: 'Product ID', width: 12 },
        { key: 'productname', header: 'Product Name', width: 25 },
        { key: 'nooftickets', header: 'Number of Tickets', width: 20, formatter: (value: string[]) => value.join(', ') },
        { key: 'ticketunit', header: 'Unit Ticket Rate (NGN)', width: 15 },
        { key: 'quantity', header: 'Quantity', width: 10 },
        { key: 'ticketprice', header: 'Ticket Price (NGN)', width: 15 },
        { key: 'ticketpurdate', header: 'Ticket Purchase Date', width: 18, formatter: (value: string) => new Date(value).toLocaleDateString() },
        { key: 'raffledrawdate', header: 'Raffle Draw Date', width: 15, formatter: (value: string) => new Date(value).toLocaleDateString() },
        { key: 'raffledrawtime', header: 'Raffle Draw Time', width: 12 },
      ],
      summaryRows: [
        { label: 'Total Records', value: exportData.length },
        { label: 'Total Amount', value: `₦${exportData.reduce((sum, item) => sum + item.ticketprice, 0).toLocaleString()}` },
        { label: 'Generated', value: new Date().toLocaleString() },
      ]
    });
    setShowDownloadModal(false);
  };

  const columnsA = [
    {
      key: "index",
      label: "S/N",
      render: (row: any, idx: number) => (currentPage - 1) * pageSize + idx + 1,
    },
    { key: "customername", label: "CUSTOMER NAME" },
    { key: "email", label: "EMAIL ADDRESS" },
    { key: "phone", label: "PHONE NUMBER" },
    { key: "gender", label: "GENDER" },
    { key: "userid", label: "USER ID" },
    {
      key: "productId",
      label: "PRODUCT ID",
      cellClassName: "text-[#F25E26] underline cursor-pointer",
      render: (row: any) => (
        <Link
          href={`/dashboard/productdetails-auction-completed/${row.productno}`}
          className="bg-[#FFFFFF] text-[#F25E26] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg p-2 font-Poppins text-sm items-center"
        >
          {row.productId}
        </Link>
      ),
    },
    { key: "productname", label: "PRODUCT NAME" },
    {
      key: "nooftickets",
      label: "NUMBER OF TICKETS",
      cellClassName: "min-w-[120px]",
      render: (row: any) => (
        <div className="flex flex-col gap-1">
          {row.nooftickets.map((ticket: string, idx: number) => (
            <span
              key={idx}
              onClick={() => {
                setSelectedTicket({
                  ticket_number: ticket,
                  ticket_amount: row.ticketunit,
                  date: row.ticketpurdate,
                  item_purchased: row.productname,
                  raffle_date: row.raffledrawdate,
                  raffle_time: row.raffledrawtime,
                });
                setShowTicket(true);
              }}
              className={
                " text-[#F25E26] underline transition delay-300 duration-300 ease-in-out cursor-pointer flex gap-2 rounded-lg p-2 font-Poppins text-sm items-center"
              }
            >
              {ticket}
            </span>
          ))}
        </div>
      ),
    },
    { key: "ticketunit", label: "UNIT TICKET RATE (NGN)" },
    { key: "quantity", label: "QUANTITY" },
    { key: "ticketprice", label: "TICKET PRICE (NGN)", sum: true },
    { key: "ticketpurdate", label: "TICKET PURCHASE DATE" },
    { key: "raffledrawdate", label: "RAFFLE DRAW DATE" },
    { key: "raffledrawtime", label: "RAFFLE DRAW TIME" },
  ];

  const AjirobaLogo = ({
    className = "h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8",
    textClassName = "text-base sm:text-lg md:text-xl",
  }) => (
    <div className="flex items-center bg-white  py-1 px-2 md:px-3 rounded-md shadow-md">
      <Link href={"/"} className={``}>
        <Image src={Brand} alt="brand-logo" />
      </Link>
    </div>
  );

  // Filter and sort the data
  const getFilteredAndSortedData = () => {
    let filteredData = [...transformedData];

    // Apply search filter
    if (search) {
      filteredData = filteredData.filter(item =>
        item.customername.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.phone.includes(search) ||
        item.productId.toLowerCase().includes(search.toLowerCase()) ||
        item.productname.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply filter by checkboxes - Fixed logic
    if (filterBy.length > 0) {
      filteredData = filteredData.filter(item => {
        return filterBy.every(filter => {
          switch (filter) {
            case 'name':
              return search ? item.customername.toLowerCase().includes(search.toLowerCase()) : true;
            case 'gender':
              return search ? item.gender.toLowerCase().includes(search.toLowerCase()) : true;
            case 'productId':
              return search ? item.productId.toLowerCase().includes(search.toLowerCase()) : true;
            case 'productName':
              return search ? item.productname.toLowerCase().includes(search.toLowerCase()) : true;
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    if (sort) {
      filteredData.sort((a, b) => {
        switch (sort) {
          case 'name':
            return a.customername.localeCompare(b.customername);
          case 'date':
            return new Date(b.ticketpurdate).getTime() - new Date(a.ticketpurdate).getTime();
          case 'price':
            return b.ticketprice - a.ticketprice;
          default:
            return 0;
        }
      });
    }

    return filteredData;
  };

  const displayData = getFilteredAndSortedData();
  const filteredWinnersA = displayData;

  // Pagination functions
  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(prev => Math.max(1, prev - 1));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (auctionCustomerLoading) {
    return <Loading />;
  }

  if (auctionCustomerError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
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
            Auction Transaction Report
          </h1>
          <button
            onClick={() => setShowDownloadModal(true)}
            className="rounded-md bg-[#f25e26] px-6 py-2 text-white text-sm hover:bg-[#d63918] transition-colors"
          >
            Download
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-4 md:px-14 mt-6 mb-4">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-md border border-[#E9E9E9] bg-[#F6F6F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                stroke="#A09F9F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.5 21c5.247 0 9.5-4.253 9.5-9.5S16.747 2 11.5 2 2 6.253 2 11.5 6.253 21 11.5 21Z"
              />
              <path
                stroke="#A09F9F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m22 22-2-2"
              />
            </svg>
          </span>
        </div>

        <div className="w-full md:w-auto flex gap-4">
          {/* Filter by dropdown */}
          <div className="relative filter-dropdown">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="w-full md:w-auto px-4 py-2 border border-[#E9E9E9] rounded-md bg-white text-[#353131] text-sm font-Poppins focus:outline-none focus:ring-2 focus:ring-[#F25E26] flex items-center justify-between min-w-[120px]"
            >
              Filter by {filterBy.length > 0 && `(${filterBy.length})`}
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#E9E9E9] rounded-md shadow-lg z-10">
                <div className="p-2 space-y-2">
                  {[
                    { key: 'name', label: 'Name' },
                    { key: 'gender', label: 'Gender' },
                    { key: 'productId', label: 'Product ID' },
                    { key: 'productName', label: 'Product Name' }
                  ].map((filter) => (
                    <label key={filter.key} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={filterBy.includes(filter.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterBy([...filterBy, filter.key]);
                          } else {
                            setFilterBy(filterBy.filter(f => f !== filter.key));
                          }
                        }}
                        className="rounded border-gray-300 text-[#F25E26] focus:ring-[#F25E26]"
                      />
                      <span className="text-sm text-[#353131]">{filter.label}</span>
                    </label>
                  ))}
                  {filterBy.length > 0 && (
                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={() => setFilterBy([])}
                        className="w-full text-left px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sort by dropdown */}
          <div className="relative sort-dropdown">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="w-full md:w-auto px-4 py-2 border border-[#E9E9E9] rounded-md bg-white text-[#353131] text-sm font-Poppins focus:outline-none focus:ring-2 focus:ring-[#F25E26] flex items-center justify-between min-w-[120px]"
            >
              {dateFilter ? dateFilter.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Sort by'}
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showSortDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#E9E9E9] rounded-md shadow-lg z-10">
                <div className="p-2 space-y-1">
                  {[
                    { value: 'last_week', label: 'Last Week' },
                    { value: 'last_month', label: 'Last Month' },
                    { value: 'last_year', label: 'Last Year' },
                    { value: 'custom', label: 'Custom' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setDateFilter(option.value);
                        if (option.value === 'custom') {
                          setShowCustomDatePicker(true);
                          setShowSortDropdown(false);
                        } else {
                          setShowSortDropdown(false);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                        dateFilter === option.value ? 'bg-[#F25E26] text-white' : 'text-[#353131]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                  {dateFilter && (
                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setDateFilter('');
                          setCustomDateRange({ start: '', end: '' });
                          setShowSortDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Clear filter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Custom Date Picker - Positioned relative to the sort dropdown */}
            {showCustomDatePicker && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#E9E9E9] rounded-md shadow-lg z-20 p-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-[#353131]">Select Date Range</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={customDateRange.start}
                        onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E9E9E9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={customDateRange.end}
                        onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E9E9E9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        if (customDateRange.start && customDateRange.end) {
                          setShowCustomDatePicker(false);
                          // Reset to page 1 when applying custom filter
                          setCurrentPage(1);
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-[#F25E26] text-white text-sm rounded-md hover:bg-[#d63918]"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => {
                        setCustomDateRange({ start: '', end: '' });
                        setShowCustomDatePicker(false);
                      }}
                      className="flex-1 px-3 py-2 border border-[#E9E9E9] text-[#353131] text-sm rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className=" bg-white rounded-lg shadow border mt-6 mb-12 overflow-x-scroll overflow-y-scroll px-4 md:px-14 py-4">
        <div className="flex flex-row items-center gap-4 px-4 md:px-8 pt-8 pb-2">
          <AjirobaLogo />
        </div>
        <div className="bg-[#F25E26] text-white font-Poppins font-medium px-4 md:px-8 py-2 flex items-center text-sm rounded-t">
        AUCTION CUSTOMERS MASTER REPORT {" "}
          <span className="ml-4 text-xs font-normal">
            ({currentTime})
          </span>
        </div>
        <div className="overflow-x-auto">
          <ReportsTable data={displayData} columns={columnsA} />
        </div>
        
        {/* Pagination */}
        {displayData && displayData.length > 0 && (
          <div className="flex justify-between items-center py-4 px-4 md:px-8">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} • Total: {(auctionCustomerData as any)?.count || displayData.length} records
              {(search || filterBy.length > 0 || dateFilter) &&
                ` | Filtered: ${displayData.length} records`}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={!hasPreviousPage}
                className={`px-3 py-1 text-sm rounded-md ${
                  hasPreviousPage
                    ? 'bg-[#F25E26] text-white hover:bg-[#d63918]'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        currentPage === pageNum
                          ? 'bg-[#F25E26] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={!hasNextPage}
                className={`px-3 py-1 text-sm rounded-md ${
                  hasNextPage
                    ? 'bg-[#F25E26] text-white hover:bg-[#d63918]'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
            
            {(search || filterBy.length > 0 || dateFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setFilterBy([]);
                  setDateFilter('');
                  setCurrentPage(1);
                }}
                className="text-xs text-[#F25E26] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {showticket && selectedTicket && (
        <RaffleTicket
          onClose={() => setShowTicket(false)}
          ticket_number={selectedTicket.ticket_number || "N/A"}
          ticket_price={selectedTicket.ticket_amount || "N/A"}
          purchase_date={selectedTicket.date || "N/A"}
          product={selectedTicket.item_purchased || "N/A"}
          raffle_date={selectedTicket.raffle_date || "N/A"}
          raffle_time={selectedTicket.raffle_time || "N/A"}
        />
      )}

      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownloadPDF={handleDownloadPDF}
        onDownloadXLS={handleDownloadXLS}
      />
    </section>
  );
}
