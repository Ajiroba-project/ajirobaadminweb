'use client'
import React, { useState } from 'react'
import icon from "../../asset/image/icon.svg"
import Image from 'next/image';
import chart from '../../asset/image/chart.svg'
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import { IoFilter } from 'react-icons/io5';
import DatePicker from 'react-datepicker';
import { useParams, useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { useGetDatanew } from '@/hooks/useGetData';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Loading from '@/app/components/Loading';
import "react-datepicker/dist/react-datepicker.css";


function RechargeDealsTable() {

  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const params = useParams();
  const productId = params.slug;


  const [userToken, setUserToken] = useState(Cookies.get("token"));

  let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/billpayment_transactions/`;

  const {
    data: transInfo,
    isLoading: transLoading,
    error: transError,
  } = useGetDatanew(url, "get_catandsubcat_details", userToken || " ");


  const transactions = transInfo && transInfo?.data?.map((item: any, index: number) => ({
    id: item?.reference,
    // id: index + 1,
    biller: item?.biller || 'N/A',
    amount: item.amount,
    date: new Date(item.date_created).toLocaleDateString("en-GB"),
    email: item?.email || 'N/A',
    name: item?.name || 'N/A',
    img: `https://staging.ajiroba.ng/v1${item.profile_image}`,
    reference: item?.reference,


  }));

  // console.log(transactions, 'bills_payment_transactions')




  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  const itemsPerPage = 5;


  const filteredTransactions = transactions?.filter((transaction: { name: string; email: string; item: string; date: string | string[]; }) => {
    const matchesSearch =
      transaction.name.toLowerCase().includes(search.toLowerCase()) ||
      transaction.email.toLowerCase().includes(search.toLowerCase()) ||
      transaction.item.toLowerCase().includes(search.toLowerCase()) ||
      transaction.date.includes(search);

    const matchesSelectedDate =
      !selectedDate ||
      new Date((transaction.date as string).split("/").reverse().join("-")).toISOString().split("T")[0] ===
      selectedDate.toISOString().split("T")[0];



    return matchesSearch && matchesSelectedDate;
  });


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

  interface Transaction {
    id: number;
    name: string;
    email: string;
    amount: string;
    item: string;
    date: string;
  }

  const toggleRowSelection = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };



  if (transLoading) {
    return <Loading />;
  }


  return (

    <div>


      <div className="p-4 max-w-7xl mx-auto rounded-lg shadow-md bg-white">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className='flex w-full md:w-1/3 gap-4'>
            <div>
              <input
                type="text"
                placeholder="Search here..."
                className="border border-gray-300 rounded-md p-2 "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className=''>
              <button
                className="border border-gray-300 rounded-md p-2 flex items-center gap-1 text-[#344054]"
                onClick={() => alert("Filter functionality coming soon!")}
              >
                <IoFilter />  Filter
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">

            <div className="flex items-center space-x-2">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="Select Date"
                className="border border-gray-300 rounded-md p-2"
                dateFormat="yyyy-MM-dd"
                minDate={new Date("2024-01-01")}
                isClearable
              />

            </div>
          </div>
        </div>

        <div className="bg-white  overflow-x-auto">
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
                <th className="text-left px-4 py-2">Amount</th>
                <th className="text-left px-4 py-2">Biller</th>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Profile Image</th>
                <th className="text-left px-4 py-2">Reference</th>



                <th className="text-left px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((transaction: { status: any, reference: any, biller: any; id: React.Key | null | undefined; img: string | StaticImport; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; email: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; amount: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; item: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; date: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-100 even:bg-gray-50  border border-b-[#E4E7EC]"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(transaction.id as number)}
                      onChange={() => toggleRowSelection(transaction.id as number)}
                    />
                  </td>
                  <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm">{transaction.amount}</td>
                  <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm">{transaction.biller}</td>
                  <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm">{transaction.date}</td>
                  <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm">{transaction.email}</td>
                  <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm">{transaction.name}</td>
                  <td className="px-4 py-4 flex items-center space-x-2">
                    <Image src={transaction.img} alt="icon" width={30} height={30} />
                    <span className='text-[#101928] font-semibold font-Poppins text-sm'>{transaction.name}</span>
                  </td>


                  <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm">{transaction.reference}</td>


                  <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm relative">
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        setMenuOpen((prev: number | null) =>
                          prev === transaction.id ? null : transaction.id as number | null
                        )
                      }
                    >
                      ...
                    </button>
                    {menuOpen === transaction.id && (
                      <div className="absolute right-0 bg-white border border-gray-300 rounded shadow-md z-10 px-4 py-4">
                        <button
                          className="whitespace-nowrap px-4 mb-4 py-2 w-full text-center bg-[#E84526] rounded-lg text-[#F6F6F6] hover:bg-[#E84526]"
                          onClick={() => router.push(`/dashboard/rechargedeals/${transaction.id}`)}
                        >
                          View details
                        </button>

                        <button
                          className="whitespace-nowrap px-4 mb-4 py-2 w-full text-center border border-[#D0D5DD] bg-[#FCFCFC] rounded-lg text-[#E84526]"
                          onClick={() =>
                            alert(`Deleting transaction ${transaction.id}`)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4 rounded-full ">

          <h1 className='text-[#667185] text-sm font-Poppins'>Page {currentPage} of {totalPages}</h1>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded ${currentPage === index + 1
                    ? "bg-[#FFECE5] text-[#EB5017] text-sm font-medium font-Poppins "
                    : "bg-gray-100 text-[#98A2B3] text-sm font-medium font-Poppins hover:bg-gray-200"
                  }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className='flex space-x-2 justify-end' >
            <button
              className="flex items-center justify-center gap-1 text-[#344054] border border-[#D0D5DD] bg-[white] rounded-lg px-4 py-2 hover:text-gray-700"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <IoIosArrowRoundBack size={20} /> Previous
            </button>
            <button
              className="flex items-center justify-center gap-1 text-[#344054] border border-[#D0D5DD] bg-[white] rounded-lg px-4 py-2 hover:text-gray-700"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next <IoIosArrowRoundForward size={20} />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default RechargeDealsTable