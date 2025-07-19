"use client";
import Image from "next/image";
import logo from "@/app/asset/logo.svg";
import { useRouter } from "next/navigation";

const revenueData = [
  { sn: 1, item: "Regular Deals", gtv: "1,000", profit: "5,000" },
  { sn: 2, item: "Auction Deals", gtv: "5,000", profit: "5,000" },
  { sn: 3, item: "Airtime", gtv: "10,000", profit: "5,000" },
  { sn: 4, item: "Data", gtv: "200,000", profit: "5,000" },
  { sn: 5, item: "Electricity", gtv: "200,000", profit: "5,000" },
  { sn: 6, item: "Cable Subscription", gtv: "200,000", profit: "5,000" },
];

export default function RevenueSummaryReportPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      <div className="bg-[#F6F6F6] px-8 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Ajiroba Logo" width={120} height={40} />
        </div>
        <button className="bg-[#F25E26] hover:bg-[#E84526] text-white font-semibold px-8 py-2 rounded-lg text-base shadow" style={{marginRight: 8}}>
          Download
        </button>
      </div>
      <div className="max-w-3xl mx-auto px-4 pt-2">
        <span
          onClick={() => router.back()}
          className="text-[#F25E26] cursor-pointer text-sm block mb-2 mt-6"
        >
          Back
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Revenue Summary Report</h1>
        <div className="flex justify-end mb-4">
          <button className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 text-sm flex items-center gap-2">
            Sort by
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6,9 12,15 18,9"></polyline></svg>
          </button>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-black text-center bg-white">
            <thead>
              <tr>
                <th colSpan={4} className="py-2 border-b border-black">
                  <div className="flex items-center gap-2 justify-center">
                    <Image src={logo} alt="Ajiroba Logo" width={40} height={40} />
                    <span className="text-2xl font-bold">AJÍRÓBA<sup className="text-xs align-super">®</sup></span>
                  </div>
                </th>
              </tr>
              <tr>
                <th colSpan={4} className="py-2 border-b border-black bg-orange-500 text-white text-lg font-semibold">
                  <div className="flex items-center justify-between px-4">
                    <span>REVENUE SUMMARY REPORT</span>
                    <span>(5, May, 2025 ; 4:30PM)</span>
                  </div>
                </th>
              </tr>
              <tr className="bg-gray-100 border-b border-black">
                <th className="py-2 px-2 border-r border-black font-bold">S/N</th>
                <th className="py-2 px-2 border-r border-black font-bold">ITEMS</th>
                <th className="py-2 px-2 border-r border-black font-bold">GROSS TRANSACTION VOLUME (GTV) (₦)</th>
                <th className="py-2 px-2 font-bold">PROFIT (₦)</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((row) => (
                <tr key={row.sn} className="border-b border-black">
                  <td className="py-2 px-2 border-r border-black">{row.sn}</td>
                  <td className="py-2 px-2 border-r border-black">{row.item}</td>
                  <td className="py-2 px-2 border-r border-black">{row.gtv}</td>
                  <td className="py-2 px-2">{row.profit}</td>
                </tr>
              ))}
              {/* Totals row */}
              <tr className="font-bold text-lg">
                <td colSpan={2} className="py-2 px-2 border-t-2 border-black text-left">TOTAL</td>
                <td className="py-2 px-2 border-t-2 border-black">216,000</td>
                <td className="py-2 px-2 border-t-2 border-black">96,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 