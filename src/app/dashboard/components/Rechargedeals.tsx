'use client'
import React, { useState } from 'react'
import icon from "../../asset/image/icon.svg"
import Image from 'next/image';
import chart from '../../asset/image/chart.svg'
import RegularsDealTable from './RegularsDealTable';
import Cookies from 'js-cookie';
import { useGetDatanew } from '@/hooks/useGetData';
import Loading from '@/app/components/Loading';
import AuctionDealsTable from '@/app/components/AuctionDealsTable';
import RechargeDealsTable from './RechargeDealsTable';

function Rechargedeals() {




  const [userToken, setUserToken] = useState(Cookies.get("token"));

  let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/transaction_volume/`;

  const {
    data: transInfo,
    isLoading: transLoading,
    error: transError,
  } = useGetDatanew(url, "get_catandsubcat_details", userToken || " ");



const salesDataMain = [
  {
    id: 1,
    title: "Total Sales Today",
    amount: transInfo?.data?.bills_payment.today.today_sales,
    comparison: transInfo?.data?.bills_payment.today.today_vs_yesterday_diff,
    comparisonText: "Compared to Yesterday",
    bidnum: 'N/A',
    bidtxt: "Bids",
  },
  {
    id: 2,
    title: "Total Sales This Week",
    amount: transInfo?.data?.bills_payment.this_week.this_week_sales,
    comparison: transInfo?.data?.bills_payment.this_week.this_week_vs_last_week_diff,
    comparisonText: "Compared to Last Week",
    bidnum: 'N/A',
    bidtxt: "Bids",
  },
  {
    id: 3,
    title: "Total Sales This Month",
    amount: transInfo?.data?.bills_payment.this_month.this_month_sales,
    comparison: transInfo?.data?.bills_payment.this_month.this_month_vs_last_month_diff,
    comparisonText: "Compared to Last Month",
    bidnum: 'N/A',
    bidtxt: "Bids",
  },
];


  if (transLoading) {
    return <Loading/>
  }


  return (

    <div>


     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {salesDataMain?.map((data) => (
        <div
          key={data.id}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white border border-[#E4E7EC] rounded-lg flex items-center justify-center">


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
             {/*   <p className="text-xl font-semibold text-[#1E1E1E] mt-4">{data.bidnum}</p>
               <span className='text-[#98A2B3] text-sm'>{data?.bidtxt}</span> */}
            </div>
           </div>
          </div>
        </div>
      ))}
    </div>

<RechargeDealsTable/>

        </div>
  )
}

export default Rechargedeals