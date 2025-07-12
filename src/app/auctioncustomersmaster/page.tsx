// "use client";
// import React, { useState, useRef } from "react";
// import { ProfileHeader, RegistrationHeader } from "@/app/components/Header";

// import { CiSearch } from "react-icons/ci";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { useParams, useRouter } from "next/navigation";
// import { useGetDatanew } from "@/hooks/useGetData";
// import Cookies from "js-cookie";

// export default function Page() {
//   const [userToken, setUserToken] = useState(Cookies.get("token"));

//   const router = useRouter();

//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("");
//   const [dateFilter, setDateFilter] = useState("");

//   return (
//     <section className="flex-col flex justify-center">
//       <div className="w-full bg-gray-100">
//         <ProfileHeader />
//         <p
//           className="lg:px-14 px-7  text-[#F25E26] underline cursor-pointer"
//           onClick={() => router.back()}
//         >
//           Back
//         </p>
//         <div className="flex justify-between items-center style={{
//         margin: '0 auto',
//         width: '90%'
//       }} py-4">
//           <div>
//             <h1 className="text-[#111111] text-lg font-Poppins font-semibold">
//               Auction Transaction Report
//             </h1>
//           </div>

//           <div>
//             <button className="rounded-md bg-[#f25e26] px-8 py-4 text-white">
//               Download
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between mt-6 mb-2 gap-4" >
//                   <div className="relative w-full md:w-72">
//                     <input
//                       type="text"
//                       placeholder="Search here..."
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       className="w-full h-10 pl-10 pr-4 rounded-md border border-[#E9E9E9] bg-[#F6F6F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
//                     />
//                     <span className="absolute left-3 top-2.5 text-gray-400">
//                       <svg
//                         width="16"
//                         height="16"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           stroke="#A09F9F"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M11.5 21c5.247 0 9.5-4.253 9.5-9.5S16.747 2 11.5 2 2 6.253 2 11.5 6.253 21 11.5 21Z"
//                         />
//                         <path
//                           stroke="#A09F9F"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="m22 22-2-2"
//                         />
//                       </svg>
//                     </span>
//                   </div>
//                   <div className="flex gap-2">
//                     <select
//                       value={dateFilter}
//                       onChange={(e) => setDateFilter(e.target.value)}
//                       className="px-4 py-2 border border-[#E9E9E9] rounded-md bg-white text-[#353131] text-sm font-Poppins focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
//                     >
//                       <option value="">Sort by</option>
//                       <option value="last_week">Last Week</option>
//                       <option value="last_month">Last Month</option>
//                     </select>

//                   </div>
//                 </div>
//     </section>
//   );
// }

"use client";
import React, { useState } from "react";
import { ProfileHeader } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import Brand from "@/app/asset/logo.svg";
import { RedeemedTable } from "../dashboard/components/RedeemedTable";
import { ReportsTable } from "../dashboard/components/ReportsTable";
import RaffleTicket from "../dashboard/components/RaffleTicket";

export default function Page() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [dateFilterrd, setDateFilterrd] = useState("");

  const [userToken] = useState(Cookies.get("token"));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showticket, setShowTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const columnsA = [
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
        key: "productId",
        label: "PRODUCT ID",
        cellClassName: "text-[#F25E26] underline cursor-pointer",
        render: (row: any) => (
          <Link
            href={`/dashboard/productdetails-auction-completed/${row.id}`}
            className="bg-[#FFFFFF] text-[#F25E26] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg p-2 font-Poppins text-sm items-center"
          >
            {row.productId}
          </Link>
        ),
      },
    { key: "productname", label: "PRODUCT NAME" },
    {
        key: "nooftickets",
        label: "NUMBER OF TICKETS",
        cellClassName: "min-w-[120px]",
        render: (row: any) => (
          <div className="flex flex-col gap-1">
            {row.nooftickets.map((ticket: string, idx: number) => (
              <span
                key={idx}
                onClick={() => {
                  setSelectedTicket({
                    ticket_number: ticket,
                    ticket_amount: row.ticketunit,
                    date: row.ticketpurdate,
                    item_purchased: row.productname,
                    raffle_date: row.raffledrawdate,
                    raffle_time: row.raffledrawtime
                  });
                  setShowTicket(true);
                }}
                className={
                  " text-[#F25E26] underline transition delay-300 duration-300 ease-in-out cursor-pointer flex gap-2 rounded-lg p-2 font-Poppins text-sm items-center"
                }
              >
                {ticket}
              </span>
            ))}
          </div>
        ),
      },      
      { key: "ticketunit", label: "UNIT TICKET RATE (NGN)" },
      { key: "quantity", label: "QUANTITY" },
      { key: "ticketprice", label: "TICKET PRICE (NGN)", sum: true },
      { key: "ticketpurdate", label: "TICKET PURCHASE DATE" },
      { key: "raffledrawdate", label: "RAFFLE DRAW DATE" },
      { key: "raffledrawtime", label: "RAFFLE DRAW TIME" },
  
   
  ];

  const filteredWinnersA = [
    {
        customername: "Amaka Okafor",
        email: "amaka.okafor@example.com",
        phone: "08012345678",
        gender: "Female",
        userid: "USR001",
        productId: "PRD001",
        productname: "Samsung TV 55\"",
        nooftickets: ["WS23E", "FR45FD", "ZX89K"],
        ticketunit: 1000,
        quantity: 1,
        ticketprice: 3000,
        ticketpurdate: "2025-07-05T10:30:00Z",
        raffledrawdate: "2025-07-10T00:00:00Z",
        raffledrawtime: "4:30 PM",
        status: "Delivered",
        id: "001",
      },
      {
        customername: "John Doe",
        email: "john.doe@example.com",
        phone: "07098765432",
        gender: "Male",
        userid: "USR002",
        productId: "PRD002",
        productname: "iPhone 15 Pro",
        nooftickets: ["GH78JK", "MN56PO"],
        ticketunit: 2000,
        quantity: 1,
        ticketprice: 4000,
        ticketpurdate: "2025-07-01T14:00:00Z",
        raffledrawdate: "2025-07-07T00:00:00Z",
        raffledrawtime: "3:00 PM",
        status: "Pending",
        id: "002",
      },
      {
        customername: "Fatima Abubakar",
        email: "fatima.a@example.com",
        phone: "08123456789",
        gender: "Female",
        userid: "USR003",
        productId: "PRD003",
        productname: "HP Laptop 14\"",
        nooftickets: ["RT45YU", "LK98HJ", "PO12CV", "UY78NB", "QA34FD"],
        ticketunit: 1500,
        quantity: 1,
        ticketprice: 7500,
        ticketpurdate: "2025-06-25T12:20:00Z",
        raffledrawdate: "2025-06-28T00:00:00Z",
        raffledrawtime: "2:15 PM",
        status: "Delivered",
        id: "003",
      },
      {
        customername: "Emeka Nwosu",
        email: "emeka.n@example.com",
        phone: "09034567890",
        gender: "Male",
        userid: "USR004",
        productId: "PRD004",
        productname: "LG Home Theater",
        nooftickets: ["TY67UI"],
        ticketunit: 1000,
        quantity: 1,
        ticketprice: 1000,
        ticketpurdate: "2025-07-02T16:00:00Z",
        raffledrawdate: "2025-07-03T00:00:00Z",
        raffledrawtime: "12:00 PM",
        status: "Pending",
        id: "004",
      },
      {
        customername: "Bola Adeniyi",
        email: "bola.adeniyi@example.com",
        phone: "08111222333",
        gender: "Female",
        userid: "USR005",
        productId: "PRD005",
        productname: "Generator 3.5KVA",
        nooftickets: ["PL56RT", "WE23XZ", "BN45GH", "KL89OP"],
        ticketunit: 2500,
        quantity: 1,
        ticketprice: 10000,
        ticketpurdate: "2025-06-26T09:45:00Z",
        raffledrawdate: "2025-06-30T00:00:00Z",
        raffledrawtime: "10:00 AM",
        status: "Delivered",
        id: "005",
      }
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
            Auction Transaction Report
          </h1>
          <button className="rounded-md bg-[#f25e26] px-6 py-2 text-white text-sm">
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

        <div className="w-full md:w-auto flex">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-[#E9E9E9] rounded-md bg-white text-[#353131] text-sm font-Poppins focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
          >
            <option value="">Sort by</option>
            <option value="last_week">Last Week</option>
            <option value="last_month">Last Month</option>
          </select>
        </div>
      </div>

      <div className=" bg-white rounded-lg shadow border mt-6 mb-12 overflow-x-scroll overflow-y-scroll px-4 md:px-14 py-4">
        <div className="flex flex-row items-center gap-4 px-4 md:px-8 pt-8 pb-2">
          <AjirobaLogo />
        </div>
        <div className="bg-[#F25E26] text-white font-Poppins font-medium px-4 md:px-8 py-2 flex items-center text-sm rounded-t">
          REDEEMED PRODUCTS{" "}
          <span className="ml-4 text-xs font-normal">
            {/*  {redeemedInfo && 'data' in redeemedInfo ? new Date().toLocaleString() : "(5, May, 2025 ; 4:30PM)"} */}
            {new Date().toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}
          </span>
        </div>
        <div className="overflow-x-auto">
          <ReportsTable data={filteredWinnersA} columns={columnsA} />
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


      {showticket && selectedTicket && (
                <RaffleTicket
                    onClose={() => setShowTicket(false)}
                    ticket_number={selectedTicket.ticket_number || 'N/A'}
                    ticket_price={selectedTicket.ticket_amount || 'N/A'}
                    purchase_date={selectedTicket.date || 'N/A'}
                    product={selectedTicket.item_purchased || 'N/A'}
                    raffle_date={selectedTicket.raffle_date || 'N/A'} // Data not available in ticket_list
                    raffle_time={selectedTicket.raffle_time || 'N/A'} // Data not available in ticket_list
                />
            )}
    </section>
  );
}
