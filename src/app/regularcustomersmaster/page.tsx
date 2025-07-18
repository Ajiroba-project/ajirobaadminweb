"use client";
import React, { useState, useEffect } from "react";
import { ProfileHeader } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import Brand from "@/app/asset/logo.svg";
import { ReportsTable } from "../dashboard/components/ReportsTable";
import { DownloadModal } from "@/app/components/DownloadModal";
import { exportToPDF, exportToXLS, ExportData } from "@/utils/exportUtils";

export default function Page() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filterBy, setFilterBy] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const [userToken] = useState(Cookies.get("token"));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
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

  // Download handlers
  const handleDownloadPDF = async () => {
    const exportData: ExportData[] = filteredRegularCustomers.map((item) => ({
      customername: item.customername,
      email: item.email,
      phone: item.phone,
      gender: item.gender,
      userid: item.userid,
      productId: item.productId,
      productname: item.productname,
      costprice: item.costprice,
      sellingprice: item.sellingprice,
      discountprice: item.discountprice,
      profit: item.profit,
      vat: item.vat,
      purchasetime: item.purchasetime,
      modeofpayment: item.modeofpayment,
      status: item.status,
    }));

    setShowDownloadModal(false);
    await exportToPDF(exportData, {
      title: "Regular Customers Master Report",
      fileName: "Regular_Customers_Master_Report"
    });
  };

  const handleDownloadXLS = () => {
    const exportData: ExportData[] = filteredRegularCustomers.map((item) => ({
      customername: item.customername,
      email: item.email,
      phone: item.phone,
      gender: item.gender,
      userid: item.userid,
      productId: item.productId,
      productname: item.productname,
      costprice: item.costprice,
      sellingprice: item.sellingprice,
      discountprice: item.discountprice,
      profit: item.profit,
      vat: item.vat,
      purchasetime: item.purchasetime,
      modeofpayment: item.modeofpayment,
      status: item.status,
    }));

    exportToXLS(exportData, {
      title: "Regular Customers Master Report",
      fileName: "Regular_Customers_Master_Report",
      columns: [
        { key: 'customername', header: 'Customer Name', width: 20 },
        { key: 'email', header: 'Email Address', width: 25 },
        { key: 'phone', header: 'Phone Number', width: 15 },
        { key: 'gender', header: 'Gender', width: 10 },
        { key: 'userid', header: 'User ID', width: 12 },
        { key: 'productId', header: 'Product ID', width: 12 },
        { key: 'productname', header: 'Product Name', width: 25 },
        { key: 'costprice', header: 'Cost Price (NGN)', width: 15 },
        { key: 'sellingprice', header: 'Selling Price (NGN)', width: 15 },
        { key: 'discountprice', header: 'Discount Price (NGN)', width: 15 },
        { key: 'profit', header: 'Profit (NGN)', width: 15 },
        { key: 'vat', header: 'VAT', width: 10 },
        { key: 'purchasetime', header: 'Purchase Time', width: 18 },
        { key: 'modeofpayment', header: 'Mode of Payment', width: 15 },
        { key: 'status', header: 'Status', width: 12 },
      ],
      summaryRows: [
        { label: 'Total Records', value: exportData.length },
        { label: 'Total Profit', value: `₦${exportData.reduce((sum, item) => sum + item.profit, 0).toLocaleString()}` },
        { label: 'Generated', value: new Date().toLocaleString() },
      ]
    });
    setShowDownloadModal(false);
  };

  const columnsRegular = [
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
          href={`/dashboard/productdetails-product/${row.id}`}
          className="bg-[#FFFFFF] text-[#F25E26] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg p-2 font-Poppins text-sm items-center"
        >
          {row.productId}
        </Link>
      ),
    },
    { key: "productname", label: "PRODUCT NAME" },
    { key: "costprice", label: "COST PRICE (NGN)" },
    { key: "sellingprice", label: "SELLING PRICE (NGN)" },
    { key: "discountprice", label: "DISCOUNT PRICE (NGN)" },
    { key: "profit", label: "PROFIT (NGN)", sum: true },
    { key: "vat", label: "VAT" },
    { key: "purchasetime", label: "PURCHASE TIME/TIME" },
    { key: "modeofpayment", label: "MODE OF PAYMENT" },
    {
      key: "status",
      label: "STATUS",
      render: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "Successful"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const filteredRegularCustomers = [
    {
      customername: "Bolu Davies",
      email: "bolu.davies@example.com",
      phone: "08012345678",
      gender: "Male",
      userid: "USR001",
      productId: "5648T53",
      productname: "T-Shirt",
      costprice: 5000,
      sellingprice: 6000,
      discountprice: 0,
      profit: 1000,
      vat: "7.5%",
      purchasetime: "21-MAY-2024",
      modeofpayment: "21-MAY-2024",
      status: "Successful",
      id: "001",
    },
    {
      customername: "Bolu Davies",
      email: "bolu.davies@example.com",
      phone: "08012345678",
      gender: "Female",
      userid: "USR002",
      productId: "7892R45",
      productname: "Rice",
      costprice: 8000,
      sellingprice: 10000,
      discountprice: 0,
      profit: 2000,
      vat: "7.5%",
      purchasetime: "21-MAY-2024",
      modeofpayment: "21-MAY-2024",
      status: "Pending",
      id: "002",
    },
    {
      customername: "Bolu Davies",
      email: "bolu.davies@example.com",
      phone: "08012345678",
      gender: "Male",
      userid: "USR003",
      productId: "3456H78",
      productname: "Human Hair",
      costprice: 15000,
      sellingprice: 16000,
      discountprice: 0,
      profit: 1000,
      vat: "7.5%",
      purchasetime: "21-MAY-2024",
      modeofpayment: "21-MAY-2024",
      status: "Successful",
      id: "003",
    },
    {
      customername: "Bolu Davies",
      email: "bolu.davies@example.com",
      phone: "08012345678",
      gender: "Female",
      userid: "USR004",
      productId: "9012M34",
      productname: "Mango",
      costprice: 2000,
      sellingprice: 3000,
      discountprice: 0,
      profit: 1000,
      vat: "7.5%",
      purchasetime: "N/A",
      modeofpayment: "N/A",
      status: "Successful",
      id: "004",
    },
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
    let filteredData = [...filteredRegularCustomers];

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

    // Apply filter by checkboxes
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

    // Apply date filtering
    if (dateFilter) {
      const now = new Date();
      let startDate: Date | null = null;
      let endDate: Date | null = null;
      
      switch (dateFilter) {
        case 'last_week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'last_month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'last_year':
          const currentYear = now.getFullYear();
          const previousYear = currentYear - 1;
          startDate = new Date(previousYear, 0, 1);
          endDate = new Date(previousYear, 11, 31, 23, 59, 59, 999);
          break;
        case 'custom':
          if (customDateRange.start && customDateRange.end) {
            startDate = new Date(customDateRange.start);
            endDate = new Date(customDateRange.end);
            endDate.setHours(23, 59, 59, 999);
          }
          break;
        default:
          return filteredData;
      }
      
      if (startDate && endDate) {
        filteredData = filteredData.filter(item => {
          if (item.purchasetime === "N/A") return false;
          const itemDate = new Date(item.purchasetime);
          return itemDate >= startDate! && itemDate <= endDate!;
        });
      }
    }

    // Apply sorting
    if (sort) {
      filteredData.sort((a, b) => {
        switch (sort) {
          case 'name':
            return a.customername.localeCompare(b.customername);
          case 'date':
            if (a.purchasetime === "N/A" && b.purchasetime === "N/A") return 0;
            if (a.purchasetime === "N/A") return 1;
            if (b.purchasetime === "N/A") return -1;
            return new Date(b.purchasetime).getTime() - new Date(a.purchasetime).getTime();
          case 'price':
            return b.profit - a.profit;
          default:
            return 0;
        }
      });
    }

    return filteredData;
  };

  const displayData = getFilteredAndSortedData();

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
            Regular Customers Master Report
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

            {/* Custom Date Picker */}
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
          REGULAR CUSTOMERS MASTER REPORT{" "}
          <span className="ml-4 text-xs font-normal">
            {currentTime}
          </span>
        </div>
        <div className="overflow-x-auto">
          <ReportsTable data={displayData} columns={columnsRegular} />
        </div>
        {displayData && displayData.length > 0 && (
          <div className="flex flex-col items-center py-4">
            <div className="text-sm text-gray-600 mb-2">
              Total: {displayData.length} records
              {(search || filterBy.length > 0 || dateFilter) &&
                ` | Filtered: ${displayData.length} records`}
            </div>
            {(search || filterBy.length > 0 || dateFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setFilterBy([]);
                  setDateFilter('');
                }}
                className="text-xs text-[#F25E26] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownloadPDF={handleDownloadPDF}
        onDownloadXLS={handleDownloadXLS}
      />
    </section>
  );
} 