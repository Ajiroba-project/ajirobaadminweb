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
import { exportToPDF, exportToXLS, exportToPDFTable, ExportData } from "@/utils/exportUtils";
import { useGetDatanew } from "@/hooks/useGetData";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import axios from "axios";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// TypeScript interfaces for API response
interface ProductInfo {
  product_id: string;
  product_no: string;
  product_name: string;
  selling_price: number;
  discount_price: number;
  cost_price: number;
  profit: number;
  number_in_stock: number;
  payment_method: string;
  quantity: number;
  total_cost: number
}

interface RegularCustomerData {
  id: string;
  order_id: string;
  product_info: ProductInfo[];
  date_created: string;
}

interface RegularCustomerTotals {
  total_price: number;
  selling_price: number;
  items_cost_price: number;
}

interface RegularCustomerResults {
  status: string;
  message: string;
  current_datetime: string;
  totals: RegularCustomerTotals;
  total_profit: number;
  data: RegularCustomerData[];
}

interface RegularCustomerApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RegularCustomerResults;
}

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

  // Pagination state
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  useAuthMiddleware(router);

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

  // Construct filter parameters for API
  const getFilterParams = () => {
    const params = new URLSearchParams();

    if (currentPage > 1) {
      params.append('page', currentPage.toString());
    }

    // Seamless date filter handling (support 'yesterday' and 'custom')
    if (dateFilter === 'yesterday') {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      // const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const todayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
      params.append('filter', 'custom');
      params.append('start_date', todayStr);
      params.append('end_date', yesterdayStr);
    } else if (dateFilter === 'last_week' || dateFilter === 'last_month' || dateFilter === 'last_year') {
      params.append('filter', dateFilter);
    } else if (dateFilter === 'custom' && customDateRange.start && customDateRange.end) {
      params.append('filter', 'custom');
      params.append('start_date', customDateRange.start);
      params.append('end_date', customDateRange.end);
    }

    return params.toString();
  };

  // API integration
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/regular_customer_master_report/?${getFilterParams()}`;
  const {
    data: regularCustomerData,
    isLoading: regularCustomerLoading,
    error: regularCustomerError,
  } = useGetDatanew(url, "get_regular_customer_master", userToken || " ");





  // Transform API data to match component structure
  const transformApiData = (apiData: any): any[] => {



    if (!apiData) {
      return [];
    }


    
    return apiData?.map((item: any) => {
      const productInfo = item.product_info || {};
      const userInfo = item.user_info || {};
      return {
        customername: userInfo?.customer_name || "N/A", // API doesn't provide customer info
        email: userInfo?.email || "N/A",
        phone: userInfo?.phone || "N/A",
        gender: userInfo?.gender === true
        ? "Male"
        : userInfo?.gender === false
        ? "Female"
        : "N/A",
        userid: userInfo.user_id || 'N/A',
        productId: productInfo.product_no || 'N/A',
        productno: productInfo.product_id || 'N/A',
        productname: productInfo.product_name || 'N/A',
        costprice: productInfo.cost_price || 0,
        sellingprice: productInfo.selling_price || 0,
        discountprice: productInfo.discount || 0,
        profit: productInfo.profit || 0,
        vat: productInfo.tax,
        purchasetime: productInfo.date_time ? new Date(productInfo.date_time).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).toUpperCase() : 'N/A',
        modeofpayment: productInfo.mode_of_payment || 'N/A',
        status: productInfo.status ||  "N/A",
        id: item.id || 'N/A',
        quantity: productInfo.quantity || 0,
        total_cost: productInfo.total_cost || 0
      };
    });
  };

  // Update pagination state when data changes
  useEffect(() => {
    if (regularCustomerData) {
      const apiResponse = regularCustomerData as unknown as RegularCustomerApiResponse;
      setTotalPages(Math.ceil(apiResponse.count / pageSize));
      setHasNextPage(!!apiResponse.next);
      setHasPreviousPage(!!apiResponse.previous);
    }
  }, [regularCustomerData, pageSize]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, search, filterBy]);


  const transformedData = transformApiData((regularCustomerData as unknown as RegularCustomerApiResponse)?.results?.data);


// console.log(transformApiData, 'transformmmmmmmm')

  // Pagination handlers
  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Download handlers (export ALL pages with S/N like customersreport)
  const handleDownloadPDF = async () => {
    try {
      setShowDownloadModal(false);

      const allRows: any[] = [];
      const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/regular_customer_master_report/`;
      const buildExportParams = () => {
        const params = new URLSearchParams();
        if (dateFilter === 'yesterday') {
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
          const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
          params.append('filter', 'custom');
          params.append('start_date', todayStr);
          params.append('end_date', yStr);
        } else if (dateFilter === 'last_week' || dateFilter === 'last_month' || dateFilter === 'last_year') {
          params.append('filter', dateFilter);
        } else if (dateFilter === 'custom' && customDateRange.start && customDateRange.end) {
          params.append('filter', 'custom');
          params.append('start_date', customDateRange.start);
          params.append('end_date', customDateRange.end);
        }
        return params.toString();
      };
      let nextUrl: string | null = `${baseUrl}?${buildExportParams()}`;
      const headers = { headers: { Authorization: `Token ${userToken}` } } as const;

      for (let i = 0; i < 200 && nextUrl; i++) {
        const resp: any = await axios.get(nextUrl, headers);
        const res: any = resp.data;
        const pageItems: any[] = res?.results?.data || [];

        pageItems.forEach((item) => {
          const p: any = item.product_info || {};
          const u: any = item.user_info || {};
          const genderStr = u?.gender === true ? 'Male' : u?.gender === false ? 'Female' : 'N/A';
          const dateDisp = p?.date_time
            ? new Date(p.date_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
            : 'N/A';
          const discount = (p?.discount ?? p?.discount_price ?? 0) as number;
          const modeOfPayment = p?.mode_of_payment ?? p?.payment_method ?? 'N/A';

          allRows.push({
            customername: u?.customer_name || 'N/A',
            email: u?.email || 'N/A',
            phone: u?.phone || 'N/A',
            gender: genderStr,
            userid: u?.user_id || 'N/A',
            productId: p?.product_no || 'N/A',
            productname: p?.product_name || 'N/A',
            costprice: Number(p?.cost_price || 0),
            sellingprice: Number(p?.selling_price || 0),
            discountprice: Number(discount || 0),
            profit: Number(p?.profit || 0),
            vat: p?.tax ?? p?.vat ?? '',
            purchasetime: dateDisp,
            modeofpayment: modeOfPayment,
            status: p?.status || 'N/A',
            quantity: Number(p?.quantity || 0),
            total_cost: Number(p?.total_cost || 0),
          });
        });

        nextUrl = res?.next || null;
      }

      if (allRows.length === 0) {
        alert('No data available to export');
        return;
      }

      const exportData: ExportData[] = allRows.map((row, idx) => ({
        S_N: idx + 1,
        customername: row.customername,
        email: row.email,
        phone: row.phone,
        gender: row.gender,
        userid: row.userid,
        productId: row.productId,
        productname: row.productname,
        costprice: row.costprice,
        sellingprice: row.sellingprice,
        discountprice: row.discountprice,
        profit: row.profit,
        vat: row.vat,
        purchasetime: row.purchasetime,
        modeofpayment: row.modeofpayment,
        status: row.status,
        quantity: row.quantity,
        total_cost: row.total_cost,
      }));

      await exportToPDFTable(exportData, {
        title: "Regular Customers Master Report",
        fileName: "Regular_Customers_Master_Report",
        columns: [
          { key: 'S_N', header: 'S/N' },
          { key: 'customername', header: 'Customer Name' },
          { key: 'email', header: 'Email' },
          { key: 'phone', header: 'Phone' },
          { key: 'gender', header: 'Gender' },
          { key: 'userid', header: 'User ID' },
          { key: 'productId', header: 'Product ID' },
          { key: 'productname', header: 'Product Name' },
          { key: 'costprice', header: 'Cost Price' },
          { key: 'sellingprice', header: 'Selling Price' },
          { key: 'discountprice', header: 'Discount Price' },
          { key: 'profit', header: 'Profit' },
          { key: 'vat', header: 'VAT' },
          { key: 'purchasetime', header: 'Purchase Time' },
          { key: 'modeofpayment', header: 'Mode of Payment' },
          { key: 'status', header: 'Status' },
          { key: 'quantity', header: 'Quantity' },
          { key: 'total_cost', header: 'Total Cost' },
        ],
      });
    } catch (err) {
      alert('Failed to prepare PDF export.');
    }
  };

  const handleDownloadXLS = async () => {
    try {
      setShowDownloadModal(false);

      const allRows: any[] = [];
      const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/regular_customer_master_report/`;
      const buildExportParams = () => {
        const params = new URLSearchParams();
        if (dateFilter === 'yesterday') {
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
          const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
          params.append('filter', 'custom');
          params.append('start_date', todayStr);
          params.append('end_date', yStr);
        } else if (dateFilter === 'last_week' || dateFilter === 'last_month' || dateFilter === 'last_year') {
          params.append('filter', dateFilter);
        } else if (dateFilter === 'custom' && customDateRange.start && customDateRange.end) {
          params.append('filter', 'custom');
          params.append('start_date', customDateRange.start);
          params.append('end_date', customDateRange.end);
        }
        return params.toString();
      };
      let nextUrl: string | null = `${baseUrl}?${buildExportParams()}`;
      const headers = { headers: { Authorization: `Token ${userToken}` } } as const;

      for (let i = 0; i < 200 && nextUrl; i++) {
        const resp: any = await axios.get(nextUrl, headers);
        const res: any = resp.data;
        const pageItems: any[] = res?.results?.data || [];
        pageItems.forEach((item) => {
          const p: any = item.product_info || {};
          const u: any = item.user_info || {};
          const genderStr = u?.gender === true ? 'Male' : u?.gender === false ? 'Female' : 'N/A';
          const dateDisp = p?.date_time
            ? new Date(p.date_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
            : 'N/A';
          const discount = (p?.discount ?? p?.discount_price ?? 0) as number;
          const modeOfPayment = p?.mode_of_payment ?? p?.payment_method ?? 'N/A';
          allRows.push({
            customername: u?.customer_name || 'N/A',
            email: u?.email || 'N/A',
            phone: u?.phone || 'N/A',
            gender: genderStr,
            userid: u?.user_id || 'N/A',
            productId: p?.product_no || 'N/A',
            productname: p?.product_name || 'N/A',
            costprice: Number(p?.cost_price || 0),
            sellingprice: Number(p?.selling_price || 0),
            discountprice: Number(discount || 0),
            profit: Number(p?.profit || 0),
            vat: p?.tax ?? p?.vat ?? '',
            purchasetime: dateDisp,
            modeofpayment: modeOfPayment,
            status: p?.status || 'N/A',
            quantity: Number(p?.quantity || 0),
            total_cost: Number(p?.total_cost || 0),
          });
        });
        nextUrl = res?.next || null;
      }

      if (allRows.length === 0) {
        alert('No data available to export');
        return;
      }

      const exportData: ExportData[] = allRows.map((item, idx) => ({
        S_N: idx + 1,
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
        quantity: item.quantity,
        total_cost: item.total_cost,
        status: item.status,
      }));

      exportToXLS(exportData, {
        title: "Regular Customers Master Report",
        fileName: "Regular_Customers_Master_Report",
        columns: [
          { key: 'S_N', header: 'S/N', width: 8 },
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
          { key: 'quantity', header: 'Quantity', width: 10 },
          { key: 'total_cost', header: 'Total Cost', width: 12 },
          { key: 'status', header: 'Status', width: 12 },
        ],
        summaryRows: [
          { label: 'Total Records', value: exportData.length },
          { label: 'Total Profit', value: `₦${exportData.reduce((sum: number, it: any) => sum + Number(it.profit || 0), 0).toLocaleString()}` },
          { label: 'Generated', value: new Date().toLocaleString() },
        ]
      });
    } catch (err) {
      alert('Failed to prepare Excel export.');
    }
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
      key: "productno",
      label: "PRODUCT ID",
      cellClassName: "text-[#F25E26] underline cursor-pointer",
      render: (row: any) => (
        <Link
          href={`/dashboard/productdetails-product/${row.productno}`}
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
    { key: "quantity", label: "QUANTITY" },
    { key: "total_cost", label: "TOTAL COST" },
    {
      key: "status",
      label: "STATUS",
      render: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "success"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status}
        </span>
      ),
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

  // Loading state
  if (regularCustomerLoading) {
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
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F25E26] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading regular customers data...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (regularCustomerError) {
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
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600">Error loading data. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#F25E26] text-white rounded-md hover:bg-[#d63918]"
            >
              Retry
            </button>
          </div>
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

          {/* Date range filter (seamless like customersreport) */}
          <div className="">
            <Select value={dateFilter} onValueChange={(val) => setDateFilter(val)}>
              <SelectTrigger className="h-10 w-[160px] rounded border px-3 selector">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: '#ffffff', color: '#2A2A2A' }}>
                <SelectItem value="yesterday" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Yesterday</SelectItem>
                <SelectItem value="last_week" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Week</SelectItem>
                <SelectItem value="last_month" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Month</SelectItem>
                <SelectItem value="last_year" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Year</SelectItem>
                <SelectItem value="custom" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {dateFilter === "custom" && (
            <>
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
              />
              <span className="mx-1 text-xs sm:text-sm">to</span>
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
              />
            </>
          )}
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
        
        {/* Pagination */}
        {displayData && displayData.length > 0 && (
          <div className="flex flex-col items-center py-4">
            <div className="text-sm text-gray-600 mb-2">
              Total: {((regularCustomerData as unknown as RegularCustomerApiResponse)?.count) || 0} records
              {(search || filterBy.length > 0 || dateFilter) &&
                ` | Filtered: ${displayData.length} records`}
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={!hasPreviousPage}
                className={`px-3 py-1 text-sm rounded ${
                  hasPreviousPage
                    ? 'bg-[#F25E26] text-white hover:bg-[#d63918]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={!hasNextPage}
                className={`px-3 py-1 text-sm rounded ${
                  hasNextPage
                    ? 'bg-[#F25E26] text-white hover:bg-[#d63918]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
                }}
                className="text-xs text-[#F25E26] hover:underline mt-2"
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