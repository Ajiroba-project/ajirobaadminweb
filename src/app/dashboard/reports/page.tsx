"use client";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/nav-store";

import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import { useState } from "react";
import PageLayout from "@/app/components/Layout/PageLayout";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ModalComponent from "@/app/components/ModalComponent";
import Link from "next/link";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const Page = () => {
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);

  // Chart data for Service Uptime Report
  const uptimeData = {
    labels: ["Success Rate", "Failure Rate"],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ["#10b981", "#ef4444"],
        borderColor: ["#10b981", "#ef4444"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const uptimeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  // Modal state
  const [openReport, setOpenReport] = useState<null | "auction" | "regular">(
    null
  );

  // State to track if Regular Deals Transaction Report is clicked
  const [showRegularDealsReport, setShowRegularDealsReport] = useState(false);
  const [showAuctionCustomersReport, setShowAuctionCustomersReport] =
    useState(false);
  const [showRechargeTransactionReport, setShowRechargeTransactionReport] =
    useState(false);

  // Modal content: two large, centered buttons
  const modalButtons = (
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center p-6">
      {/*  <button
        className="bg-white hover:bg-[#E84526] hover:text-[#FCFCFC] rounded-xl shadow font-semibold text-base px-2 py-2 text-gray-900  transition border border-gray-200  text-center"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        Auction Customers<br />Master Report
      </button> */}

      <Link
        href={`/auctioncustomersmaster`}
        className="bg-white hover:bg-[#E84526] hover:text-[#FCFCFC] rounded-xl shadow font-semibold text-base px-2 py-2 text-gray-900  transition border border-gray-200  text-center"
      >
        Auction Customers
        <br />
        Master Report
      </Link>
      <Link
        href={`/regularcustomersmaster`}
        className="bg-white rounded-xl hover:bg-[#E84526] hover:text-[#FCFCFC] shadow font-semibold text-base px-2 py-2 text-gray-900 transition border border-gray-200  text-center"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        Regular Customers
        <br />
        Master Report
      </Link>
    </div>
  );

  const RegularDealsReport = () => {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="bg-[#F6F6F6] px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <span
            onClick={() => setShowRegularDealsReport(false)}
            className="text-[#F25E26] cursor-pointer text-sm block mb-2 md:mb-3"
          >
            Back
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            Reports
          </h1>
          <p className="text-sm md:text-base text-gray-700">
            Regular Transaction Deals
          </p>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Sort by section */}
          <div className="py-4 border-t border-gray-100">
            <div className="flex justify-end items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by</span>
                <select className="border border-gray-300 rounded px-2 md:px-3 py-1 text-sm bg-white">
                  <option>Last Week</option>
                  <option>Last Month</option>
                  <option>Last Year</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="py-6 md:p-8">
            {/* Financial Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              <div className="bg-white shadow-lg  rounded-lg p-6 md:p-8 lg:p-12 border border-gray-200">
                <h3 className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 lg:mb-8 text-center">
                  Total Revenue
                </h3>
                <p className="text-xl   md:text-2xl lg:text-3xl font-bold text-gray-900 text-center">
                  ₦ 2,000,000
                </p>
              </div>
              <div className="bg-white shadow-lg  rounded-lg p-6 md:p-8 lg:p-12 border border-gray-200">
                <h3 className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 lg:mb-8 text-center">
                  Total Discount
                </h3>
                <p className="text-xl   md:text-2xl lg:text-3xl font-bold text-gray-900 text-center">
                  ₦ 100,000
                </p>
              </div>
              <div className="bg-white shadow-lg  rounded-lg p-6 md:p-8 lg:p-12 border border-gray-200">
                <h3 className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 lg:mb-8 text-center">
                  Cost of Sale
                </h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 text-center">
                  ₦ 1,000,000
                </p>
              </div>
              <div className="bg-white shadow-lg  rounded-lg p-6 md:p-8 lg:p-12 border border-gray-200">
                <h3 className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 lg:mb-8 text-center">
                  Total Profit
                </h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 text-center">
                  ₦ 900,000
                </p>
              </div>
            </div>

            {/* View Report Button */}
            <div className="flex justify-center mt-8 md:mt-12">
              <button className="bg-[#F25E26] hover:bg-[#E84526] text-white font-medium py-3 md:py-4 px-8 md:px-16 rounded-lg transition-colors duration-200 text-sm md:text-base">
                View Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AuctionCustomersReport = () => {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="bg-[#F6F6F6] px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <span
            onClick={() => setShowAuctionCustomersReport(false)}
            className="text-[#F25E26] cursor-pointer text-sm block mb-2 md:mb-3"
          >
            Back
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            Reports
          </h1>
          <p className="text-sm md:text-base text-gray-700">
            Auction Transaction Report (23-May-2025; 4:40 PM)
          </p>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Sort by section */}
          <div className="py-4 border-t border-gray-100">
            <div className="flex justify-end items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by</span>
                <select className="border border-gray-300 rounded px-2 md:px-3 py-1 text-sm bg-white">
                  <option>Last Week</option>
                  <option>Last Month</option>
                  <option>Last Year</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="py-6 md:p-8">
            {/* Financial Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              <div className="bg-[#FFEFE980] shadow-lg  rounded-lg p-6 md:p-8 lg:p-12 border border-gray-200">
                <h3 className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 lg:mb-8 text-center">
                  Ticket GTV
                </h3>
                <p className="text-xl   md:text-2xl lg:text-3xl font-bold text-gray-900 text-center">
                  ₦ 2,000,000
                </p>
              </div>
              <div className="bg-[#EFE3FF80] shadow-lg  rounded-lg p-6 md:p-8 lg:p-12 border border-gray-200">
                <h3 className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 lg:mb-8 text-center">
                  Total No of Ticket Sold
                </h3>
                <p className="text-xl   md:text-2xl lg:text-3xl font-bold text-gray-900 text-center">
                  ₦ 100,000
                </p>
              </div>
              <div className="bg-[#F1FDFF80] shadow-lg  rounded-lg p-6 md:p-8 lg:p-12 border border-gray-200">
                <h3 className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 lg:mb-8 text-center">
                  RDA
                </h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 text-center">
                  ₦ 1,000,000
                </p>
              </div>
              <div className="bg-[#E8FFE699] shadow-lg  rounded-lg p-6 md:p-8 lg:p-12 border border-gray-200">
                <h3 className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 lg:mb-8 text-center">
                  ECA
                </h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 text-center">
                  ₦ 900,000
                </p>
              </div>
            </div>

            {/* View Report Button */}
            <div className="flex justify-center mt-8 md:mt-12">
              <button className="bg-[#F25E26] hover:bg-[#E84526] text-white font-medium py-3 md:py-4 px-8 md:px-16 rounded-lg transition-colors duration-200 text-sm md:text-base">
                View Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RechargeTransactionReport = () => {
    const [activeTab, setActiveTab] = useState("Airtime");

    return (
      <div className="w-full min-h-screen bg-gray-100">
        {/* White Header Section */}
        <div className="bg-white px-6 pt-6 pb-4">
          <span
            onClick={() => setShowRechargeTransactionReport(false)}
            className="text-[#F25E26] text-sm font-medium cursor-pointer mb-2 block"
          >
            Back
          </span>
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-bold text-black">
              Recharge Transaction Report
            </h1>
            <span className="text-base text-gray-600 font-normal">
              (23-May-2025; 4:40 PM)
            </span>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="px-6 py-6">
          {/* Navigation and Sort Section */}
          <div className="mb-6">
            <div className="flex flex-wrap  gap-4">
              <button
                onClick={() => setActiveTab("Airtime")}
                className={`px-10 py-3 rounded-xl font-semibold transition-colors ${
                  activeTab === "Airtime"
                    ? "bg-[#F25E26] text-white font-bold"
                    : "bg-[#EDEDED] text-gray-500"
                }`}
              >
                Airtime
              </button>
              <button
                onClick={() => setActiveTab("Data")}
                className={`px-10 py-3 rounded-xl font-semibold transition-colors ${
                  activeTab === "Data"
                    ? "bg-[#F25E26] text-white font-bold"
                    : "bg-[#EDEDED] text-gray-500"
                }`}
              >
                Data
              </button>
              <button
                onClick={() => setActiveTab("Electricity")}
                className={`px-10 py-3 rounded-xl font-semibold transition-colors ${
                  activeTab === "Electricity"
                    ? "bg-[#F25E26] text-white font-bold"
                    : "bg-[#EDEDED] text-gray-500"
                }`}
              >
                Electricity
              </button>
              <button
                onClick={() => setActiveTab("Cable")}
                className={`px-10 py-3 rounded-xl font-semibold transition-colors ${
                  activeTab === "Cable"
                    ? "bg-[#F25E26] text-white font-bold"
                    : "bg-[#EDEDED] text-gray-500"
                }`}
              >
                Cable Subscription
              </button>
            </div>
          </div>

          <div className="flex justify-end items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by</span>
              <div className="bg-gray-200 rounded px-3 py-1 text-sm flex items-center gap-2 cursor-pointer">
                <span>Sort by</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </div>
            </div>
          </div>

          {/* Summary Metrics */}
          {/*     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-[#F25E26] border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-700">
                  Airtime GTV
                </h3>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                ₦10,000,000
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-[#F25E26] border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-700">
                  Total Commission Earned
                </h3>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                ₦300,000
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-[#F25E26] border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-700">Counts</h3>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                10,500
              </p>
            </div>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow-lg rounded-lg p-6 border border-[#FEEAE2]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FEEAE2] rounded-full flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F25E26"
                    strokeWidth="2"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                    <path d="M6 13h12" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-700">Data GTV</h3>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                ₦10,000,000
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 border border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FFF5F0] rounded-full flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-700">
                  Total Commission Earned
                </h3>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                ₦300,000
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 border border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FFF5F0] rounded-full flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-700">Counts</h3>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                10,500
              </p>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <span className="text-[#F25E26] text-sm cursor-pointer">
              See More &gt;
            </span>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  {[
    { title: 'Airtime GTV', value: '₦10,000,000' },
    { title: 'Total Commission Earned', value: '₦300,000' },
    { title: 'Counts', value: '10,500' }
  ].map((item, idx) => (
    <div
      key={idx}
      className="bg-white border border-[#FBE9E3] rounded-[10px] shadow-sm overflow-hidden"
    >
      <div className="bg-[#FFF5F2] flex flex-col items-center py-4">
        <div className="w-8 h-8 rounded-full bg-[#FFE4D9] flex items-center justify-center text-[#F25E26] mb-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-[#1B1E28]">{item.title}</h3>
      </div>
      <div className="bg-[#FFF5F2] text-center py-4">
        <p className="text-2xl font-bold text-[#1B1E28]">{item.value}</p>
      </div>
    </div>
  ))}
</div>

<div className="flex justify-end mb-6">
  <a className="text-[#F25E26] text-sm font-medium hover:underline cursor-pointer">
    See More &gt;
  </a>
</div>






          {/* Billers Share Section */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-[#F25E26] px-6 py-4">
              <h2 className="text-white font-semibold text-lg">
                Billers share of Airtime GTV
              </h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Service Provider
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Airtime GTV
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Commission
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Count
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Commission Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                            <span className="text-black font-bold text-xs">
                              MTN
                            </span>
                          </div>
                          <span className="font-medium">MTN</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          ₦ 7,000,000
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          ₦ 210,000
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          5,000
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          2%
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              airtel
                            </span>
                          </div>
                          <span className="font-medium">Airtel</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          ₦ 2,000,000
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          ₦ 60,000
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          2,500
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          3%
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              9mobile
                            </span>
                          </div>
                          <span className="font-medium">9mobile</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          ₦ 500,000
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          ₦ 20,000
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          2,000
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          4%
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              glo
                            </span>
                          </div>
                          <span className="font-medium">Glo</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          ₦ 500,000
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          ₦ 20,000
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          1,000
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          4%
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If Regular Deals Report is active, show that content
  if (showRegularDealsReport) {
    return (
      <section>
        <PageLayout>
          <RegularDealsReport />
        </PageLayout>
      </section>
    );
  }

  if (showAuctionCustomersReport) {
    return (
      <section>
        <PageLayout>
          <AuctionCustomersReport />
        </PageLayout>
      </section>
    );
  }

  if (showRechargeTransactionReport) {
    return (
      <section>
        <PageLayout>
          <RechargeTransactionReport />
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
            {/* Header */}
            <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-20 flex justify-between items-center px-6 sticky top-0">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Report Summary Dashboard
                </h1>
                <p className="text-sm text-gray-600">(23-May-2025; 4:40 PM)</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by</span>
                <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                  <option>Default</option>
                </select>
              </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1  lg:grid-cols-2 gap-6 mb-6">
                <div
                  className="bg-teal-50 border-2 border-teal-300 rounded-lg p-6 hover:bg-teal-500 hover:text-white transition-all duration-300 cursor-pointer group"
                  onClick={() => setOpenReport("auction")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center group-hover:bg-teal-600">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-700 group-hover:text-white"
                      >
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                        <path d="M12 11h4" />
                        <path d="M12 16h4" />
                        <path d="M8 11h.01" />
                        <path d="M8 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white">
                      Auction Customers Master Report
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-wrap ">
                      <p className="text-xs text-gray-600 mb-1 group-hover:text-teal-100">
                        Auction Customers GTV.
                      </p>
                      <p className="text-lg font-bold text-gray-900 group-hover:text-white">
                        ₦13,000,000
                      </p>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      <p className="text-xs text-gray-600 mb-1 group-hover:text-teal-100">
                        Regular Customer GTV
                      </p>
                      <p className="text-lg font-bold text-gray-900 group-hover:text-white">
                        ₦19,000,000
                      </p>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      <p className="text-xs text-gray-600 mb-1 group-hover:text-teal-100">
                        No of Auction Customer.
                      </p>
                      <p className="text-base font-semibold text-gray-900 group-hover:text-white">
                        1,500,000
                      </p>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      <p className="text-xs text-gray-600 mb-1 group-hover:text-teal-100">
                        Regular Customer GTV
                      </p>
                      <p className="text-base font-semibold text-gray-900 group-hover:text-white">
                        1,500,000
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Uptime Report */}
                <Link href="/serviceuptimereport" className="block">
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center group-hover:bg-blue-700">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-gray-700 group-hover:text-white"
                        >
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white">
                        Service Uptime Report
                      </h3>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="relative w-24 h-24">
                        <Doughnut data={uptimeData} options={uptimeOptions} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-xs text-gray-600 group-hover:text-blue-100">
                              Summary
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-8">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 group-hover:text-blue-100">
                            Success Rate
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 group-hover:text-white mb-4">
                          70%
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 group-hover:text-blue-100">
                            Failure Rate
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 group-hover:text-white">
                          30%
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Middle Row - Transaction Reports */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Regular Deals Transaction Report */}
                <div
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer group"
                  onClick={() => setShowRegularDealsReport(true)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[#ffffff]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-700 group-hover:text-black"
                      >
                        <rect
                          x="2"
                          y="3"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-white">
                      Regular Deals Transaction Report
                    </h4>
                  </div>
                  <div className="flex flex-col items-center justify-center flex-wrap">
                    <div className="text-sm text-gray-600 mb-2 group-hover:text-red-100">
                      Regular GTV
                    </div>
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-white">
                      ₦45,823
                    </div>
                  </div>
                </div>

                {/* Auction Transaction Report */}
                <div
                  onClick={() => setShowAuctionCustomersReport(true)}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:bg-purple-500 hover:text-white transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-700 group-hover:text-white"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10,9 9,9 8,9" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-white">
                      Auction Transaction Report
                    </h4>
                  </div>
                  <div className="flex flex-col items-center justify-center flex-wrap">
                    <div className="text-sm text-gray-600 mb-2 group-hover:text-purple-100">
                      Auction GTV
                    </div>
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-white">
                      ₦45,823
                    </div>
                  </div>
                </div>

                {/* Recharge Transaction Report */}
                <div
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:bg-yellow-500 hover:text-white transition-all duration-300 cursor-pointer group"
                  onClick={() => setShowRechargeTransactionReport(true)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-700 group-hover:text-white"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-white">
                      Recharge Transaction Report
                    </h4>
                  </div>
                  <div className="flex flex-col items-center justify-center flex-wrap">
                    <div className="text-sm text-gray-600 mb-2 group-hover:text-yellow-100">
                      Recharge GTV
                    </div>
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-white">
                      ₦450,476,823
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row - Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Statistics */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:bg-teal-500 hover:text-white transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-teal-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-700 group-hover:text-white"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-white">
                      Customer Statistics
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      <div className="text-sm text-gray-600 group-hover:text-teal-100">
                        Customer Wallet Bal
                      </div>
                      <div className="text-2xl font-bold text-gray-900 group-hover:text-white">
                        ₦450,476,823
                      </div>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <div className="text-sm text-gray-600 group-hover:text-teal-100">
                        No of Customers
                      </div>
                      <div className="text-xl font-semibold text-gray-900 group-hover:text-white">
                        500
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Summary Report */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-700 group-hover:text-white"
                      >
                        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-white">
                      Revenue Summary Report
                    </h4>
                  </div>
                  <div className="flex justify-center items-center flex-col flex-wrap">
                    <div className="text-sm text-gray-600 mb-2 group-hover:text-blue-100">
                      Consolidated Revenue
                    </div>
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-white">
                      ₦45,823,000
                    </div>
                  </div>
                </div>

                {/* Raffle Draw Winning Report */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:bg-green-500 hover:text-white transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-green-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-700 group-hover:text-white"
                      >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-white">
                      Raffle Draw Winning Report
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-1 flex-wrap">
                      <div className="text-sm text-gray-600 group-hover:text-green-100">
                        Gross Winning Volume
                      </div>
                      <div className="text-2xl font-bold text-gray-900 group-hover:text-white">
                        ₦450,476,823
                      </div>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <div className="text-sm text-gray-600 group-hover:text-green-100">
                        Total No of Winners
                      </div>
                      <div className="text-xl font-semibold text-gray-900 group-hover:text-white">
                        500
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* Modal for Master Reports */}
        <ModalComponent
          isModalOpen={openReport !== null}
          handleCancel={() => setOpenReport(null)}
          content={modalButtons}
        />
      </PageLayout>
    </section>
  );
};

export default Page;
