'use client'
import React, { useState } from 'react'
import icon from "../../asset/image/icon.svg"
import Image from 'next/image';
import chart from '../../asset/image/chart.svg'
import RegularsDealTable from './RegularsDealTable';

function Regulardeals() {


const salesData = [
  {
    id: 1,
    title: "Total Sales Today",
    amount: "₦45,823",
    comparison: "10%",
    comparisonText: "Compared to Yesterday",
    bidnum: 70,
    bidtxt: "Bids",
  },
  {
    id: 2,
    title: "Total Sales This Week",
    amount: "₦45,823",
    comparison: "10%",
    comparisonText: "Compared to Last Week",
     bidnum: 70,
    bidtxt: "Bids",
  },
  {
    id: 3,
    title: "Total Sales This Month",
    amount: "₦45,823",
    comparison: "10%",
    comparisonText: "Compared to Last Month",
     bidnum: 70,
    bidtxt: "Bids",
  },
];



  return (

    <div>


     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {salesData.map((data) => (
        <div
          key={data.id}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white border border-[#E4E7EC] rounded-lg flex items-center justify-center">
            {/*   <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h18M9 9h6M9 12h6M9 15h6M9 18h6"
                />
              </svg> */}

              <Image src={icon} width={20} height={20} alt='icon'/>
            </div>
            <h3 className="text-[#667185] font-Poppins text-sm font-medium">{data.title}</h3>
          </div>
          <div className="mt-4">


            <div className='flex gap-2'>

            <div className='flex justify-center flex-wrap items-center gap-2 rounded-full px-4 py-2 bg-[#FFECE5]' >
            <Image src={chart} width={20} height={20} alt='icon'/>
            <span className='text-[#AD3307]' >{data.comparison}</span>
            </div>
            <p className="text-sm text-[#98A2B3] font-Poppins flex items-center gap-1">

              <span>{data.comparisonText}</span>
            </p>

            </div>
           <div className='flex justify-between' >
            <div>
               <p className="text-2xl font-semibold text-[#1D2739] mt-4">{data.amount}</p>
            </div>

            <div>
               <p className="text-xl font-semibold text-[#1E1E1E] mt-4">{data.bidnum}</p>
               <span className='text-[#98A2B3] text-sm'>{data?.bidtxt}</span>
            </div>
           </div>
          </div>
        </div>
      ))}
    </div>




  <RegularsDealTable/>

        </div>
  )
}

export default Regulardeals