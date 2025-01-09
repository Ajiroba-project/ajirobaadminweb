'use client'
import React, { useState } from 'react'
import icon from "../../asset/image/icon.svg"
import Image from 'next/image';
import chart from '../../asset/image/chart.svg'
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import { IoFilter } from 'react-icons/io5';
import DatePicker from 'react-datepicker';
import { useRouter } from "next/navigation";
import ModalComponent from '@/app/components/ModalComponent';
import { UpdateSubCategory } from './UpdateSubCategory';
import BarChart from './BarTable';
import GeoGrapgh from './GeoData';

function AnalyticsTable() {

    const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('All');

  const [transactions, setTransactions] = useState([
    { id: 1, name: "Olamide Akintan", email: "olamideakintan@gmail.com", date: "03/02/2025", img: 'https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg' },
    { id: 2, name: "Alison David", email: "alisondavid@gmail.com",  date: "31/01/2024", img: 'https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg' },
    { id: 3, name: "Megan Willow", email: "meganwillow@gmail.com",  date: "27/01/2024" , img: 'https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg'},
    { id: 4, name: "Janelle Levi", email: "janellelevi@gmail.com",  date: "02/02/2024", img: 'https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg' },
    { id: 5, name: "King Fisher", email: "kingfisher@gmail.com",  date: "26/02/2024" , img: 'https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg'},

  ]);

const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState<number | null>(null); // Track which row's menu is open
  const [updateCategory, setUpdateCategory] = useState(false);

  const handleUpdateSubCategory = () => {
    setUpdateCategory(!updateCategory);
  };



   const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };



 const filterByDateRange = (transactionDate: string, days: number) => {
    const transactionDateObj = new Date(transactionDate);
    const currentDate = new Date();
    const pastDate = new Date(currentDate.setDate(currentDate.getDate() - days));
    return transactionDateObj >= pastDate;
  };

  const itemsPerPage = 5;



// Filtered Data Based on Search and Selected Option
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.name.toLowerCase().includes(search.toLowerCase()) ||
      transaction.email.toLowerCase().includes(search.toLowerCase()) ||
      transaction.date.includes(search);

    const matchesSelectedOption =
      selectedOption === 'All' ||
      (selectedOption === '5' && filterByDateRange(transaction.date, 5)) ||
      (selectedOption === '10' && filterByDateRange(transaction.date, 10)) ||
      (selectedOption === '30' && filterByDateRange(transaction.date, 30));

    return matchesSearch && matchesSelectedOption;
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
       <div className="flex items-center space-x-2">

         {/* This should be drop down that has sort by past 5 days, past 10 days, past 30 days, instead of date picker  */}


           {/*   <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Select Date"
            className="border border-gray-300 rounded-md p-2"
            dateFormat="yyyy-MM-dd"
            minDate={new Date("2024-01-01")}
            isClearable
          /> */}


          </div>{/* Header Section */}
      <div className="flex flex-wrap items-center justify-between mb-4">
       <div className='flex w-full md:w-1/3 gap-4'>

        <h1 className='text-sm font-Poppins text-[#111111] font-semibold' >Top 5 Customer Engagement</h1>
       </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">

 <select
          value={selectedOption}
          onChange={handleOptionChange}
          className="border border-gray-300 rounded-md p-2"
        >
          {/* <option value="">Select Date Range</option> */}
          <option value="5">Past 5 Days</option>
          <option value="10">Past 10 Days</option>
          <option value="30">Past 30 Days</option>
             <option value="All">Select Date Range</option>
        </select>

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
         {/*      <th className="text-left px-4 py-2">Ticket Amount</th>
              <th className="text-left px-4 py-2">Item</th> */}
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

                <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm">{transaction.date}</td>
                <td className="px-4 py-4 text-[#344054] font-medium font-Poppins text-sm relative">
                  <button
                    className="whitespace-nowrap text-sm  py-2 w-full text-center bg-[#E84526] rounded text-[#F6F6F6] hover:bg-[#E84526]"

                   onClick={ () => setUpdateCategory(true) }
                  >
                    Gift Point
                  </button>




                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



            <BarChart />


            <GeoGrapgh/>


    </div>


 <ModalComponent
        content={
          <div className="flex flex-col justify-center">
            <div className="flex justify-center items-center flex-col">

            </div>

            {/*    <CraeteCategory func={handleEditCategory} /> */}
            <UpdateSubCategory func={handleUpdateSubCategory} />


          </div>
        }
        isModalOpen={updateCategory}
        showModal={handleUpdateSubCategory}
        handleOk={() => {}}
        handleCancel={() => setUpdateCategory(false)}
      />

        </div>
  )
}

export default AnalyticsTable