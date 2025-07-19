"use client";
import React, { useState, useEffect } from "react";
import { ProfileHeader } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import Brand from "@/app/asset/logo.svg";
import { ReportsTable } from "../components/ReportsTable";
import { DownloadModal } from "@/app/components/DownloadModal";
import { exportToPDF, exportToXLS, ExportData } from "@/utils/exportUtils";

export default function Page() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filterBy, setFilterBy] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".filter-dropdown") &&
        !target.closest(".sort-dropdown")
      ) {
        setShowFilterDropdown(false);
        setShowSortDropdown(false);
        setShowCustomDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Table columns for Regular Transaction Report
  const columnsRegularTransaction = [
    {
      key: "index",
      label: "S/N",
      render: (row: any, idx: number) => (currentPage - 1) * pageSize + idx + 1,
    },
    { key: "productId", label: "PRODUCT ID" },
    { key: "productName", label: "PRODUCT NAME" },
    { key: "sellingPrice", label: "SELLING PRICE (NGN)", sum: true },
    { key: "discount", label: "DISCOUNT (NGN)", sum: true },
    { key: "costPrice", label: "COST PRICE", sum: true },
    { key: "profit", label: "PROFIT (NGN)", sum: true },
    { key: "paymentMethod", label: "METHOD OF PAYMENT" },
    { key: "stock", label: "NUMBER IN STOCK", sum: true },
  ];

  // Placeholder data matching the screenshot
  const regularTransactionData = [
    {
      productId: "5648T53",
      productName: "T-shirt",
      sellingPrice: 6000,
      discount: 2000,
      costPrice: 2500,
      profit: 1500,
      paymentMethod: "Wallet",
      stock: 6,
    },
    {
      productId: "5648T53",
      productName: "Rice",
      sellingPrice: 6000,
      discount: 2000,
      costPrice: 2500,
      profit: 1500,
      paymentMethod: "Bank Transfer",
      stock: 6,
    },
    {
      productId: "5648T53",
      productName: "T-shirt",
      sellingPrice: 6000,
      discount: 2000,
      costPrice: 2500,
      profit: 1500,
      paymentMethod: "Bank Transfer",
      stock: 6,
    },
    {
      productId: "5648T53",
      productName: "Rice",
      sellingPrice: 6000,
      discount: 2000,
      costPrice: 2500,
      profit: 1500,
      paymentMethod: "Bank Transfer",
      stock: 6,
    },
  ];

  // Filtering and sorting logic
  const getFilteredAndSortedData = () => {
    let filteredData = [...regularTransactionData];
    if (search) {
      filteredData = filteredData.filter(
        (item) =>
          item.productId.toLowerCase().includes(search.toLowerCase()) ||
          item.productName.toLowerCase().includes(search.toLowerCase()) ||
          item.sellingPrice.toString().includes(search) ||
          item.discount.toString().includes(search) ||
          item.costPrice.toString().includes(search) ||
          item.profit.toString().includes(search) ||
          item.paymentMethod.toLowerCase().includes(search.toLowerCase()) ||
          item.stock.toString().includes(search)
      );
    }
    // No advanced filterBy for now, but structure is here for future
    // Date range filter (not implemented, placeholder)
    return filteredData;
  };

  const displayData = getFilteredAndSortedData();

  // Download handlers
  const handleDownloadPDF = async () => {
    const exportData: ExportData[] = displayData.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      sellingPrice: item.sellingPrice,
      discount: item.discount,
      costPrice: item.costPrice,
      profit: item.profit,
      paymentMethod: item.paymentMethod,
      stock: item.stock,
    }));
    setShowDownloadModal(false);
    await exportToPDF(exportData, {
      title: "Regular Transaction Report",
      fileName: "Regular_Transaction_Report",
    });
  };

  const handleDownloadXLS = () => {
    const exportData: ExportData[] = displayData.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      sellingPrice: item.sellingPrice,
      discount: item.discount,
      costPrice: item.costPrice,
      profit: item.profit,
      paymentMethod: item.paymentMethod,
      stock: item.stock,
    }));
    exportToXLS(exportData, {
      title: "Regular Transaction Report",
      fileName: "Regular_Transaction_Report",
      columns: [
        { key: "productId", header: "Product ID", width: 15 },
        { key: "productName", header: "Product Name", width: 20 },
        { key: "sellingPrice", header: "Selling Price (NGN)", width: 15 },
        { key: "discount", header: "Discount (NGN)", width: 15 },
        { key: "costPrice", header: "Cost Price", width: 15 },
        { key: "profit", header: "Profit (NGN)", width: 15 },
        { key: "paymentMethod", header: "Method of Payment", width: 20 },
        { key: "stock", header: "Number in Stock", width: 15 },
      ],
      summaryRows: [
        { label: "Total Records", value: exportData.length },
        { label: "Generated", value: new Date().toLocaleString() },
      ],
    });
    setShowDownloadModal(false);
  };

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
            Regular Transaction Report
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
          {/* Filter by dropdown (future) */}
          <div className="relative filter-dropdown">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="w-full md:w-auto px-4 py-2 border border-[#E9E9E9] rounded-md bg-white text-[#353131] text-sm font-Poppins focus:outline-none focus:ring-2 focus:ring-[#F25E26] flex items-center justify-between min-w-[120px]"
            >
              Filter by
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {/* No filter options for now */}
          </div>
          {/* Sort by dropdown (date range, placeholder) */}
          <div className="relative sort-dropdown">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="w-full md:w-auto px-4 py-2 border border-[#E9E9E9] rounded-md bg-white text-[#353131] text-sm font-Poppins focus:outline-none focus:ring-2 focus:ring-[#F25E26] flex items-center justify-between min-w-[120px]"
            >
              Date Range
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showSortDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#E9E9E9] rounded-md shadow-lg z-10">
                <div className="p-2 space-y-1">
                  {[
                    { value: "yesterday", label: "Yesterday" },
                    { value: "lastweek", label: "Last Week" },
                    { value: "lastmonth", label: "Last Month" },
                    { value: "lastyear", label: "Last Year" },
                    { value: "custom", label: "Custom" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSort(option.value);
                        setShowSortDropdown(false);
                        if (option.value !== "custom") setShowCustomDatePicker(false);
                        if (option.value === "custom") setShowCustomDatePicker(true);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                        sort === option.value
                          ? "bg-[#F25E26] text-white"
                          : "text-[#353131]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                  {sort && (
                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setSort("");
                          setShowSortDropdown(false);
                          setShowCustomDatePicker(false);
                          setCustomDateRange({ start: "", end: "" });
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Clear date range
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {showCustomDatePicker && (
            <div className="flex gap-2 items-center mt-2">
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                className="border rounded px-2 py-1 text-sm"
              />
              <span>to</span>
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center ">
        <div className="w-7/12 ">
          <div className=" bg-white rounded-lg shadow border mt-6 mb-12 overflow-x-scroll overflow-y-scroll  py-4">
            <div className="flex flex-row items-center gap-4 px-4 md:px-8 pt-8 pb-2">
              <AjirobaLogo />
            </div>
            <div className="bg-[#F25E26] text-white font-Poppins font-medium px-4 md:px-8 py-2 flex items-center justify-between text-sm rounded-t">
              <span>Regular Transaction Report</span>
              <span className="text-xs font-normal">{currentTime}</span>
            </div>
            <div className="overflow-x-auto">
              <ReportsTable data={displayData} columns={columnsRegularTransaction} />
            </div>
            {displayData && displayData.length > 0 && (
              <div className="flex flex-col items-center py-4">
                <div className="text-sm text-gray-600 mb-2">
                  Total: {displayData.length} records
                  {(search || filterBy.length > 0 || sort) &&
                    ` | Filtered: ${displayData.length} records`}
                </div>
                {(search || filterBy.length > 0 || sort) && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilterBy([]);
                      setSort("");
                    }}
                    className="text-xs text-[#F25E26] hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
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