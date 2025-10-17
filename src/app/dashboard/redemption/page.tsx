"use client";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/nav-store";

import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import { useEffect, useState } from "react";
import PageLayout from "@/app/components/Layout/PageLayout";

import Image from "next/image";

import Brand from "../../asset/logo.svg";
import Link from "next/link";
import { WinnersTable } from "../components/WinnersTable";
import { RedeemedTable } from "../components/RedeemedTable";
import ModalComponent from "@/app/components/ModalComponent";
import Cookies from "js-cookie";
import { useGetDatanew } from "@/hooks/useGetData";
import Loading from "@/app/components/Loading";
import { Pagination } from "@/app/components/Pagination";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface Column {
  key: string;
  label: string;
  render?: (row: any, index: number) => React.ReactNode;
  cellClassName?: string;
  headerClassName?: string;
}

interface Winner {
  id?: string;
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  ticket: string;
  productId: string;
  product: string;
  status?: string;
  productno?: string
}

// Add interface for the API response structure
interface WinnerApiResponse {
  current_datetime: string;
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    id: string;
    profile_picture: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    winning_ticket: string;
    product_id: string;
    product_no: string;
    product_name: string;
    redemption_status: string;
    date_created: string;
    current_datetime: string;
  }>;
}

interface WinnersTableProps {
  filteredWinners: Winner[];
  handleConfirm: (index: number) => void;
}



// ... (other imports remain the same)
const Page = () => {
  const router = useRouter();
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  // const setNavbarOpen = useStore((state) => state.setNavbarOpen);

  const [userToken] = useState(Cookies.get("token"));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // You can adjust this based on your needs

  let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/winners/?page=${currentPage}&page_size=${pageSize}`;
  let redeemedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/product_redemption/`;

  const { data: winnerInfo, isLoading: winnerLoading } = useGetDatanew(
    url,
    `get_winner_details_page_${currentPage}`,
    userToken || " "
  );

  const { data: redeemedInfo, isLoading: redeemedLoading } = useGetDatanew(
    redeemedUrl,
    `get_redeemed_details`,
    userToken || " "
  );

  // console.log(winnerInfo, "winnerInfo")


  


  // const mockWinners =  [
  //   {
  //     firstName: "Tania",
  //     surname: "Joe",
  //     email: "Taniajoe@gmail.com",
  //     phone: "08190784320",
  //     address: "1, Adeniyi Jones, Ikeja Lagos State",
  //     ticket: "43529565",
  //     productId: "5648T53",
  //     product: "T-shirt",
  //     status: "Pending",
  //   },
  //   {
  //     firstName: "Femi",
  //     surname: "Tosin",
  //     email: "Taniajoe@gmail.com",
  //     phone: "08190784320",
  //     address: "1, Adeniyi Jones, Ikeja Lagos State",
  //     ticket: "43529565",
  //     productId: "5648T53",
  //     product: "T-shirt",
  //     status: "Confirmed",
  //   },
  //   {
  //     firstName: "Tania",
  //     surname: "Joe",
  //     email: "Taniajoe@gmail.com",
  //     phone: "08190784320",
  //     address: "1, Adeniyi Jones, Ikeja Lagos State",
  //     ticket: "43529565",
  //     productId: "5648T53",
  //     product: "T-shirt",
  //     status: "Pending",
  //   },
  //   {
  //     firstName: "Tania",
  //     surname: "Joe",
  //     email: "Taniajoe@gmail.com",
  //     phone: "08190784320",
  //     address: "1, Adeniyi Jones, Ikeja Lagos State",
  //     ticket: "43529565",
  //     productId: "5648T53",
  //     product: "T-shirt",
  //     status: "Pending",
  //   },
  // ];

  const mockWinners = winnerInfo && 'results' in winnerInfo ? (winnerInfo as any).results?.map((item: {product_id: any, id?: any, first_name: any; last_name: any; email: any; phone: any; address: any; winning_ticket: any; product_no: any; product_name: any; redemption_status: any; date_created: any; }) => ({
    firstName: item.first_name,
    surname: item.last_name,
    email: item.email,
    phone: item.phone,
    address: item.address,
    ticket: item.winning_ticket,
    productId: item.product_no,
    product: item.product_name,
    status: item.redemption_status,
    id: item.product_id,
    date_created: item.date_created
  })) : [];

  // Fetch all winners across pages so search/filter works on the whole dataset
  const [winnersAll, setWinnersAll] = useState<Winner[]>([]);
  const [loadingAll, setLoadingAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      if (!userToken) return;
      setLoadingAll(true);
      try {
        let nextUrl: string | null = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/winners/?page=1&page_size=100`;
        const all: Winner[] = [];
        while (nextUrl) {
          const res = await fetch(nextUrl, {
            headers: { 'Authorization': `Token ${userToken}` }
          });
          const data: WinnerApiResponse = await res.json();
          const batch = data.results.map((item) => ({
            firstName: item.first_name,
            surname: item.last_name,
            email: item.email,
            phone: item.phone,
            address: item.address,
            ticket: item.winning_ticket,
            productId: item.product_no,
            product: item.product_name,
            status: item.redemption_status,
            id: item.product_id,
            date_created: item.date_created,
          }));
          all.push(...batch);
          nextUrl = data.next;
        }
        if (!cancelled) setWinnersAll(all);
      } catch (e) {
        // fail silently; fallback to current page data
      } finally {
        if (!cancelled) setLoadingAll(false);
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, [userToken]);

  const mockRedeemed = redeemedInfo && 'data' in redeemedInfo && 'redeemed_tickets' in (redeemedInfo as any).data ? 
    (redeemedInfo as any).data.redeemed_tickets?.map((item: {
      id: string;
      user_info: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        address: string;
      };
      product_info: {
        product_no: string | null;
        product_name: string;
        product_id: string;
      };
      ticket_number: string;
      redemption_status: string;
      date_modified: string;
    }) => ({
      firstName: item.user_info.first_name,
      surname: item.user_info.last_name,
      email: item.user_info.email,
      phone: item.user_info.phone,
      address: item.user_info.address,
      ticket: item.ticket_number,
      productno: item.product_info.product_no || 'N/A',
      productId: item.product_info.product_id || 'N/A',
      product: item.product_info.product_name,
      status: item.redemption_status,
      id: item.id,
      date_created: item.date_modified
    })) : [];

  // State for custom date range
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // Function to filter data based on date
  const filterDataByDate = (data: any[], filterType: string, customRange?: { start: string; end: string }) => {
    if (!filterType) return data;
    
    const now = new Date();
    let filterDate: Date;
    let endDate: Date = now;
    
    switch (filterType) {
      case "yesterday":
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        filterDate = yesterday;
        endDate = new Date(yesterday);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "last_week":
        filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "last_month":
        filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "last_year":
        filterDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case "custom":
        const range = customRange || customDateRange;
        if (!range.start || !range.end) return data;
        filterDate = new Date(range.start);
        endDate = new Date(range.end);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        return data;
    }
    
    return data.filter((item: any) => {
      const itemDate = new Date(item.date_created);
      return itemDate >= filterDate && itemDate <= endDate;
    });
  };

  useAuthMiddleware(router);

  const setNavbarOpen = useStore((state) => state.setNavbarOpen);

  const [active, setActive] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Winner | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const [searchrd, setSearchrd] = useState("");
  const [sortrd, setSortrd] = useState("");
  const [dateFilterrd, setDateFilterrd] = useState("");
  const [modalOpenrd, setModalOpenrd] = useState(false);
  const [selectedRowrd, setSelectedRowrd] = useState<Winner | null>(null);
  const [customDateRangeRd, setCustomDateRangeRd] = useState({
    start: '',
    end: ''
  });
  const [showCustomDatePickerRd, setShowCustomDatePickerRd] = useState(false);

  const columnsB: Column[] = [
    {
      key: "index",
      label: "S/N",
      render: (row: Winner, idx: number) => (currentPage - 1) * pageSize + idx + 1,
    },
    { key: "firstName", label: "FIRST NAME" },
    { key: "surname", label: "SURNAME NAME" },
    { key: "email", label: "EMAIL ADDRESS" },
    { key: "phone", label: "PHONE NUMBER" },
    { key: "address", label: "DELIVERY ADDRESS" },
    { key: "ticket", label: "TICKET NUMBER" },
    {
      key: "productId",
      label: "PRODUCT ID",
      cellClassName: "text-[#F25E26] underline cursor-pointer",
      render: (row: Winner) => (
        <Link
          href={`/dashboard/productdetails-auction-completed/${row.id}`}
          className="bg-[#FFFFFF] text-[#F25E26] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg p-2 font-Poppins text-sm items-center"
        >
          {row.productId}
        </Link>
      ),
    },
    { key: "product", label: "PRODUCT" },
    {
      key: "status",
      label: "REDEMPTION STATUS",
      cellClassName: "min-w-[120px]",
      render: (row: Winner, idx: number) => (
        <div className="flex items-center gap-2">
          <span
            className={
              row.status === "Pending"
                ? "bg-[#FFF7D6] text-[#B89B0F]"
                : row.status === "Confirmed"
                ? "bg-[#D4FCD4] text-[#0FB84B]"
                : "bg-gray-200 text-gray-600" +
                  " px-3 py-1 rounded text-xs font-medium whitespace-nowrap"
            }
          >
            {row.status}
          </span>
          {row.status === "Pending" && (
            <button
              className="text-[#F25E26] text-xs font-medium hover:underline focus:outline-none whitespace-nowrap"
              onClick={() => {
                setSelectedRow(row);
                setModalOpen(true);
              }}
            >
              Confirm
            </button>
          )}
        </div>
      ),
    },
  ];

  const columnsA: Column[] = [
    {
      key: "index",
      label: "S/N",
      render: (row: Winner, idx: number) => (currentPage - 1) * pageSize + idx + 1,
    },
    { key: "firstName", label: "FIRST NAME" },
    { key: "surname", label: "SURNAME NAME" },
    { key: "email", label: "EMAIL ADDRESS" },
    { key: "phone", label: "PHONE NUMBER" },
    { key: "address", label: "DELIVERY ADDRESS" },
    { key: "ticket", label: "TICKET NUMBER" },
    {
      key: "productId",
      label: "PRODUCT ID",
      cellClassName: "text-[#F25E26] underline cursor-pointer",
      render: (row: Winner) => (
        <Link
          href={`/dashboard/productdetails-auction-completed/${row.productId}`}
          className="bg-[#FFFFFF] text-[#F25E26] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg p-2 font-Poppins text-sm items-center"
        >
          {row.productno}
        </Link>
      ),
    },
    { key: "product", label: "PRODUCT" },
    {
      key: "status",
      label: "REDEMPTION STATUS",
      cellClassName: "min-w-[120px]",
      render: (row: Winner, idx: number) => (
        <div className="flex items-center gap-2">
          <span
            className={
              row.status === "Pending"
                ? "bg-[#FFF7D6] text-[#B89B0F]"
                : row.status === "Delivered"
                ? "bg-[#D4FCD4] text-[#0FB84B]"
                : "bg-gray-200 text-gray-600" +
                  " px-3 py-1 rounded text-xs font-medium whitespace-nowrap"
            }
          >
            {row.status}
          </span>
        </div>
      ),
    },
  ];

  // Choose source: full dataset if available, else current page
  const winnersSource = winnersAll.length > 0 ? winnersAll : (mockWinners || []);
  // First filter by date, then by search
  const dateFilteredWinners = filterDataByDate(winnersSource, dateFilter);
  
  const filteredWinners = dateFilteredWinners?.filter(
    (w: { firstName: string; surname: string; email: string; phone: string; address: string; ticket: string; productId: string; product: string; status: string; }) =>
      w.firstName.toLowerCase().includes(search.toLowerCase()) ||
      w.surname.toLowerCase().includes(search.toLowerCase()) ||
      w.email.toLowerCase().includes(search.toLowerCase()) ||
      w.phone.toLowerCase().includes(search.toLowerCase()) ||
      w.address.toLowerCase().includes(search.toLowerCase()) ||
      w.ticket.toLowerCase().includes(search.toLowerCase()) ||
      w.productId.toLowerCase().includes(search.toLowerCase()) ||
      w.product.toLowerCase().includes(search.toLowerCase()) ||
      w.status.toLowerCase().includes(search.toLowerCase())
  );

    const filteredRedeemed = filterDataByDate(mockRedeemed || [], dateFilterrd, customDateRangeRd);
  
  const filteredWinnersA = filteredRedeemed?.filter(
    (w) =>
      w.firstName.toLowerCase().includes(searchrd.toLowerCase()) ||
      w.surname.toLowerCase().includes(searchrd.toLowerCase()) ||
      w.email.toLowerCase().includes(searchrd.toLowerCase()) ||
      w.phone.toLowerCase().includes(searchrd.toLowerCase()) ||
      w.address.toLowerCase().includes(searchrd.toLowerCase()) ||
      w.ticket.toLowerCase().includes(searchrd.toLowerCase()) ||
      w.productId.toLowerCase().includes(searchrd.toLowerCase()) ||
      w.product.toLowerCase().includes(searchrd.toLowerCase()) ||
      w.status.toLowerCase().includes(searchrd.toLowerCase())
  );

  const handleConfirm = (row: Winner) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    if (!selectedRow) return;
    
    setIsConfirming(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/confirm_redeemed_ticket/${selectedRow.ticket}/`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Token ${userToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Success - close modal and refresh data
        setModalOpen(false);
        setSelectedRow(null);
        // Refresh the page data by triggering a refetch
        // You can also implement a toast notification here instead of alert
        console.log(data.message || 'Ticket confirmed successfully!');
        // Optionally, you can trigger a refetch of the data here
        window.location.reload(); // Simple refresh for now
      } else {
        // Error handling
        console.error('API Error:', data.message);
        alert(data.message || 'Failed to confirm ticket. Please try again.');
      }
    } catch (error) {
      console.error('Error confirming ticket:', error);
      alert('An error occurred while confirming the ticket. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
  };

  // Reset filters when switching tabs
  const handleTabChange = (tabIndex: number) => {
    setActive(tabIndex);
    if (tabIndex === 0) {
      setSearchrd("");
      setDateFilterrd("");
      setShowCustomDatePickerRd(false);
      setCustomDateRangeRd({ start: '', end: '' });
    } else {
      setSearch("");
      setDateFilter("");
      setShowCustomDatePicker(false);
      setCustomDateRange({ start: '', end: '' });
    }
  };

  // Calculate total pages based on count
  const totalPages = winnerInfo && 'count' in winnerInfo ? Math.ceil((winnerInfo as any).count / pageSize) : 0;

  if (winnerLoading || (active === 1 && redeemedLoading)) {
    return (
      <section>
        <PageLayout>
          <div className="w-full px-4 md:w-5/6 md:mx-auto">
            <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-32 flex justify-center items-center sticky top-0">
              <h1 className="text-center xl:text-2xl 2xl:text-2xl md:text-2xl text-base leading-tight tracking-tight font-Poppins">
                Delivery Product Redemption
              </h1>
            </div>
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          </div>
        </PageLayout>
      </section>
    );
  }

  return (
    <section>
      <PageLayout>
        <div className="w-full px-4 md:w-5/6 md:mx-auto max-w-7xl overflow-hidden">
          <section
            className={` ${
              isNavbarOpen ? "justify-center items-center" : ""
            } flex-col flex w-full`}
          >
            <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-32 flex justify-center items-center sticky top-0">
              <h1 className="text-center xl:text-2xl 2xl:text-2xl md:text-2xl text-base leading-tight tracking-tight font-Poppins">
                Delivery Product Redemption
              </h1>
            </div>

            <div className="my-10 px-2 md:px-0">
              <div className="flex flex-col sm:flex-row">
                <div
                  onClick={() => handleTabChange(0)}
                  className={`${
                    active === 0 ? "bg-[#FCDFD4]" : ""
                  } border-2 border-gray-100 p-4 text-sm rounded-lg cursor-pointer w-full sm:w-[14em]`}
                >
                  Winners Information
                </div>
                <div
                  onClick={() => handleTabChange(1)}
                  className={`${
                    active === 1 ? "bg-[#FCDFD4]" : ""
                  } border-2 border-[#D2D2D2] p-4 text-sm rounded-lg cursor-pointer w-full sm:w-[14em]`}
                >
                  Redeemed Product
                </div>
              </div>

              {active === 0 ? (
                <div className="py-4 border-b text-[#353131] text-sm font-normal font-Poppins">
                  Below are the customer information of winners that have made
                  request to redeem their auction wins by delivery. Kindly
                  ensure that the product has been successfully delivered before
                  you click on `send` button
                </div>
              ) : (
                <div className="py-4 border-b text-[#353131] text-sm font-normal font-Poppins">
                  Below are the customer information of winners that have
                  redeemed their auction wins by physical delivery.
                </div>
              )}

              {active === 0 ? (
                <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between mt-6 mb-2 gap-4">
                  <div className="relative w-full md:w-72">
                    <input
                      type="text"
                      placeholder="Search here..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-md border border-[#E9E9E9] bg-[#F6F6F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
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
                  <div className="flex gap-2">
                    <Select value={dateFilter} onValueChange={(val) => {
                        setDateFilter(val);
                        if (val === 'custom') {
                          setShowCustomDatePicker(true);
                        } else {
                          setShowCustomDatePicker(false);
                        }
                      }}>
                      <SelectTrigger className="h-10 w-[160px] rounded border px-3 selector">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: '#ffffff', color: '#2A2A2A' }}>
                        <SelectItem value="yesterday" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Yesterday</SelectItem>
                        <SelectItem value="last_week" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Week</SelectItem>
                        <SelectItem value="last_month" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Month</SelectItem>
                        <SelectItem value="last_year" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Year</SelectItem>
                        <SelectItem value="custom" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {showCustomDatePicker && (
                      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-white border border-[#E9E9E9] rounded-md p-2 min-w-0">
                        <div className="flex flex-col sm:flex-row gap-2 items-center min-w-0">
                          <input
                            type="date"
                            value={customDateRange.start}
                            onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#F25E26] min-w-0"
                            placeholder="Start date"
                          />
                          <span className="text-gray-500 text-sm hidden sm:inline">to</span>
                          <input
                            type="date"
                            value={customDateRange.end}
                            onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#F25E26] min-w-0"
                            placeholder="End date"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setShowCustomDatePicker(false);
                            setDateFilter('');
                            setCustomDateRange({ start: '', end: '' });
                          }}
                          className="px-2 py-1 text-xs text-gray-500 hover:text-red-500 flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between mt-6 mb-2 gap-4">
                  <div className="relative w-full md:w-72">
                    <input
                      type="text"
                      placeholder="Search Redeemed here..."
                      value={searchrd}
                      onChange={(e) => setSearchrd(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-md border border-[#E9E9E9] bg-[#F6F6F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
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
                  <div className="flex gap-2">
                    <Select value={dateFilterrd} onValueChange={(val) => {
                        setDateFilterrd(val);
                        if (val === 'custom') {
                          setShowCustomDatePickerRd(true);
                        } else {
                          setShowCustomDatePickerRd(false);
                        }
                      }}>
                      <SelectTrigger className="h-10 w-[160px] rounded border px-3 selector">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: '#ffffff', color: '#2A2A2A' }}>
                        <SelectItem value="yesterday" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Yesterday</SelectItem>
                        <SelectItem value="last_week" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Week</SelectItem>
                        <SelectItem value="last_month" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Month</SelectItem>
                        <SelectItem value="last_year" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Year</SelectItem>
                        <SelectItem value="custom" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {showCustomDatePickerRd && (
                      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-white border border-[#E9E9E9] rounded-md p-2 min-w-0">
                        <div className="flex flex-col sm:flex-row gap-2 items-center min-w-0">
                          <input
                            type="date"
                            value={customDateRangeRd.start}
                            onChange={(e) => setCustomDateRangeRd(prev => ({ ...prev, start: e.target.value }))}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#F25E26] min-w-0"
                            placeholder="Start date"
                          />
                          <span className="text-gray-500 text-sm hidden sm:inline">to</span>
                          <input
                            type="date"
                            value={customDateRangeRd.end}
                            onChange={(e) => setCustomDateRangeRd(prev => ({ ...prev, end: e.target.value }))}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#F25E26] min-w-0"
                            placeholder="End date"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setShowCustomDatePickerRd(false);
                            setDateFilterrd('');
                            setCustomDateRangeRd({ start: '', end: '' });
                          }}
                          className="px-2 py-1 text-xs text-gray-500 hover:text-red-500 flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {active === 0 ? (
                <div className="w-full bg-white rounded-lg shadow border mt-6 mb-12 overflow-hidden">
                  <div className="flex flex-row items-center gap-4 px-4 md:px-8 pt-8 pb-2">
                    <AjirobaLogo />
                  </div>
                  <div className="bg-[#F25E26] text-white font-Poppins font-medium px-4 md:px-8 py-2 flex items-center text-sm rounded-t">
                    WINNERS INFORMATION{" "}
                    <span className="ml-4 text-xs font-normal">
                      {winnerInfo && 'current_datetime' in winnerInfo ? (winnerInfo as any).current_datetime : "(5, May, 2025 ; 4:30PM)"}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <WinnersTable
                      data={filteredWinners}
                      columns={columnsB}
                    />
                  </div>
                  {!search && !dateFilter && totalPages > 1 ? (
                    <div className="flex flex-col items-center py-4">
                      <div className="text-sm text-gray-600 mb-2">
                        Showing page {currentPage} of {totalPages} (Total: {winnerInfo && 'count' in winnerInfo ? (winnerInfo as any).count : 0} records)
                        {dateFilter && ` | Filtered: ${filteredWinners?.length || 0} records`}
                      </div>
                      <Pagination
                        pageCount={totalPages}
                        onPageChange={handlePageChange}
                        className="flex items-center gap-2"
                        currentPage={currentPage - 1}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <div className="text-sm text-gray-600 mb-2">
                        Total: {filteredWinners?.length || 0} records
                        {loadingAll && ' (loading all...)'}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full bg-white rounded-lg shadow border mt-6 mb-12 overflow-hidden">
                  <div className="flex flex-row items-center gap-4 px-4 md:px-8 pt-8 pb-2">
                    <AjirobaLogo />
                  </div>
                  <div className="bg-[#F25E26] text-white font-Poppins font-medium px-4 md:px-8 py-2 flex items-center text-sm rounded-t">
                    REDEEMED PRODUCTS{" "}
                    <span className="ml-4 text-xs font-normal">
                      {redeemedInfo && 'data' in redeemedInfo ? new Date().toLocaleString() : "(5, May, 2025 ; 4:30PM)"}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <RedeemedTable data={filteredWinnersA} columns={columnsA} />
                  </div>
                  {filteredWinnersA && filteredWinnersA.length > 0 && (
                    <div className="flex flex-col items-center py-4">
                      <div className="text-sm text-gray-600 mb-2">
                        Total: {filteredWinnersA.length} records
                        {dateFilterrd && ` | Filtered: ${filteredWinnersA.length} records`}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <ModalComponent
            isModalOpen={modalOpen}
            handleOk={handleModalOk}
            handleCancel={() => setModalOpen(false)}
            content={
              <div className="flex flex-col items-center justify-center p-6">
                <p className="text-center text-lg font-Poppins font-medium mb-8 mt-2">
                  Before you proceed, please confirm if the product has been
                  physically delivered
                </p>
                <div className="flex flex-col gap-4 w-full items-center">
                  <button
                    className={`w-full font-Poppins font-medium rounded-lg py-3 mb-2 border-none focus:outline-none transition ${
                      isConfirming 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-[#FDE6DF] text-[#222] hover:bg-[#fcd2c2]'
                    }`}
                    onClick={handleModalOk}
                    disabled={isConfirming}
                  >
                    {isConfirming ? 'Confirming...' : 'Yes'}
                  </button>
                  <button
                    className={`w-full font-Poppins font-medium rounded-lg py-3 border focus:outline-none transition ${
                      isConfirming 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-[#222] border-[#F25E26] hover:bg-[#f9e3db]'
                    }`}
                    onClick={() => setModalOpen(false)}
                    disabled={isConfirming}
                  >
                    {isConfirming ? 'Please wait...' : 'No'}
                  </button>
                </div>
              </div>
            }
          />
        </div>
      </PageLayout>
    </section>
  );
};

export default Page;
