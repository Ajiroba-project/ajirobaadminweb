"use client"
import React, { Suspense, useState, lazy } from 'react'
import icon from "../../asset/image/icon.svg"
import Image from 'next/image';
import chart from '../../asset/image/chart.svg'
const RegularsDealTable = lazy(() => import('./RegularsDealTable'));
import Cookies from 'js-cookie';
import { useGetDatanew } from '@/hooks/useGetData';
import Loading from '@/app/components/Loading';
import { formatCurrency } from '@/utils/formatCurrency';

function Regulardeals({ onRegisterExport }: { onRegisterExport?: (fn: () => void) => void }) {
  const [userToken, setUserToken] = useState(Cookies.get("token"));

  // Construct URL with dynamic filters
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
      amount: formatCurrency(transInfo?.data?.regular_deals?.today?.today_sales) || "N45,823",
      comparison: transInfo?.data?.regular_deals?.today?.today_vs_yesterday_diff || "10%",
      comparisonText: "Compared to Yesterday",
      isPositive: false, // Red for decrease
    },
    {
      id: 2,
      title: "Total Sales This Week",
      amount: formatCurrency(transInfo?.data?.regular_deals?.this_week?.this_week_sales) || "N45,823",
      comparison: transInfo?.data?.regular_deals?.this_week?.this_week_vs_last_week_diff || "10%",
      comparisonText: "Compared to Last Week",
      isPositive: false, // Red for decrease
    },
    {
      id: 3,
      title: "Total Sales This Month",
      amount: formatCurrency(transInfo?.data?.regular_deals?.this_month?.this_month_sales) || "N45,823",
      comparison: transInfo?.data?.regular_deals?.this_month?.this_month_vs_last_month_diff || "10%",
      comparisonText: "Compared to Last Month",
      isPositive: false, // Red for decrease
    },
  ];

  if (transLoading) {
    return <Loading/>
  }

  return (
    <div>
      {/* Sales Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {salesDataMain?.map((data) => (
          <div
            key={data.id}
            className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                <Image src={icon} width={20} height={20} alt='icon'/>
              </div>
              <h3 className="text-[#667185] font-Poppins text-sm font-medium">{data.title}</h3>
            </div>
            
            <div className="mb-4">
              <div className='flex items-center gap-3 mb-3'>
                <div className='flex items-center gap-2 rounded-full px-3 py-1.5 bg-[#FFECE5]'>
                  <Image src={chart} width={16} height={16} alt='chart'/>
                  <span className={`text-sm font-Poppins font-medium ${data.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {data.comparison}
                  </span>
                </div>
                <p className="text-sm text-[#98A2B3] font-Poppins">
                  {data.comparisonText}
                </p>
              </div>
              
              <div className='flex justify-between items-end'>
                <div>
                  <p className="text-2xl font-Poppins font-semibold text-[#1D2739]">
                    {formatCurrency(data.amount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-Poppins font-semibold text-[#1D2739]">Transactions</h2>
        </div>
        <Suspense fallback={<div className="px-6 py-8"><Loading /></div>}>
          <RegularsDealTable onRegisterExport={onRegisterExport} />
        </Suspense>
      </div>
    </div>
  )
}

export default Regulardeals