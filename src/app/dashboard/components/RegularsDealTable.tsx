'use client'
import React, { useState } from 'react'
import icon from "../../asset/image/icon.svg"
import Image from 'next/image';
import chart from '../../asset/image/chart.svg'
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import { IoFilter } from 'react-icons/io5';
import DatePicker from 'react-datepicker';

function RegularsDealTable() {


  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const [transactions, setTransactions] = useState([
    { id: 1, name: "Olamide Akintan", email: "olamideakintan@gmail.com", amount: "#200", item: "Bag of Rice", date: "03/02/2025", img: 'https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg' },
    { id: 2, name: "Alison David", email: "alisondavid@gmail.com", amount: "#200", item: "Human Hair", date: "31/01/2024", img: 'https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg' },
    { id: 3, name: "Megan Willow", email: "meganwillow@gmail.com", amount: "#200", item: "Wrist Bead", date: "27/01/2024" , img: 'https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg'},
    { id: 4, name: "Janelle Levi", email: "janellelevi@gmail.com", amount: "#200", item: "Wilson Qillex", date: "02/02/2024", img: 'https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg' },
    { id: 5, name: "King Fisher", email: "kingfisher@gmail.com", amount: "#200", item: "Headset", date: "26/02/2024" , img: 'https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg'},
    { id: 6, name: "Olivia Mahun", email: "oliviamahun@gmail.com", amount: "#200", item: "Bag of rice", date: "31/01/2024" , img: 'https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg'},
    { id: 7, name: "Vivian Kalu", email: "viviankalu@gmail.com", amount: "#200", item: "Men's T-Shirt", date: "31/01/2024", img: 'https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg' },
    { id: 8, name: "Douglas Smith", email: "douglassmith@gmail.com", amount: "#200", item: "iPhone Pouch", date: "26/02/2024", img: 'https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg' },
    { id: 9, name: "Kenneth Tarry", email: "kennethtarry@gmail.com", amount: "#200", item: "iPhone 6 Screen", date: "26/02/2024", img: 'https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg' },
  ]);

const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState<number | null>(null); // Track which row's menu is open
   const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  const itemsPerPage = 5;

   // Filtered Data Based on Search and Selected Date
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.name.toLowerCase().includes(search.toLowerCase()) ||
      transaction.email.toLowerCase().includes(search.toLowerCase()) ||
      transaction.item.toLowerCase().includes(search.toLowerCase()) ||
      transaction.date.includes(search);

    const matchesSelectedDate =
      !selectedDate || transaction.date === selectedDate.toISOString().split("T")[0];

    return matchesSearch && matchesSelectedDate;
  });


  // Pagination Logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Select All Logic
  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((transaction) => selectedRows.includes(transaction.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      const pageIds = paginatedData.map((transaction) => transaction.id);
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


  return (

    <div>


<div className="p-4 max-w-7xl mx-auto rounded-lg shadow-md bg-white">
      {/* Header Section */}
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

         {/*  <button
            className="border border-gray-300 rounded-md p-2"
            onClick={() => alert("Date selection functionality coming soon!")}
          >
            Select Dates
          </button> */}

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

      {/* Table Section */}
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
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Ticket Amount</th>
              <th className="text-left px-4 py-2">Item</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-100 even:bg-gray-50  border border-b-[#E4E7EC]"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(transaction.id)}
                    onChange={() => toggleRowSelection(transaction.id)}
                  />
                </td>
                <td className="px-4 py-4 flex items-center space-x-2">
                  {/* <div className="h-8 w-8 rounded-full bg-gray-300"></div> */}
                  <Image src={transaction.img} alt="icon" width={30} height={30} />
                  <span className='text-[#101928] font-semibold font-Poppins text-sm'>{transaction.name}</span>
                </td>
                <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm">{transaction.email}</td>
                <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm">{transaction.amount}</td>
                <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm">{transaction.item}</td>
                <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm">{transaction.date}</td>
                <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm relative">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      setMenuOpen((prev) =>
                        prev === transaction.id ? null : transaction.id
                      )
                    }
                  >
                    ...
                  </button>
                  {menuOpen === transaction.id && (
                    <div className="absolute right-0 bg-white border border-gray-300 rounded shadow-md z-10">
                      <button
                        className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                        onClick={() => alert(`Viewing transaction ${transaction.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="block px-4 py-2 w-full text-left hover:bg-gray-100 text-red-500"
                        onClick={() =>
                          setTransactions((prev) =>
                            prev.filter((item) => item.id !== transaction.id)
                          )
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

      {/* Pagination Section */}
      <div className="flex justify-between items-center mt-4 rounded-full ">

        <h1 className='text-[#667185] text-sm font-Poppins'>Page {currentPage} of {totalPages}</h1>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
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

export default RegularsDealTable