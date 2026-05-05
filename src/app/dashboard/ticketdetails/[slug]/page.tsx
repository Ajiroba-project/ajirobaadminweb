"use client";
import React, { useState, useRef } from "react";
import { ProfileHeader, RegistrationHeader } from "@/app/components/Header";

import { CiSearch } from "react-icons/ci";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useRouter } from "next/navigation";
import { useGetDatanew } from "@/hooks/useGetData";
import Cookies from 'js-cookie'
import RaffleTicket from "../../components/RaffleTicket";
import { formatCurrency } from "@/utils/formatCurrency";

/** Uses backend fields when present; avoids index-based "demo" winner rows that break under search/filter. */
function isWinningTicket(ticket: Record<string, unknown>): boolean {
    const t = ticket as Record<string, any>;
    if (t.is_winner === true || t.is_winner === "true" || t.is_winner === 1) return true;
    if (t.won === true || t.won === "true") return true;
    if (t.winning_ticket === true || t.winning_ticket === "true") return true;
    const status = t.status ?? t.ticket_status ?? t.raffle_status;
    if (typeof status === "string" && /won|winner|winning/i.test(status.trim())) return true;
    return false;
}

function ticketRowKey(ticket: Record<string, unknown>, index: number): string {
    const t = ticket as Record<string, any>;
    if (t.id != null && String(t.id) !== "") return String(t.id);
    const num = t.ticket_number != null ? String(t.ticket_number) : "";
    const d = t.date != null ? String(t.date) : "";
    return `${num}-${d}-${index}`;
}

export default function Page() {

    const [userToken, setUserToken] = useState(Cookies.get('token'));

    const router = useRouter();


    const params = useParams();
    const userId = params.slug;
    const [showticket, setShowTicket] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState<any>(null);

    // console.log(userId, "params")


    const { data: userdetails, isLoading: userLoading } = useGetDatanew(
        `/api/userdetails/`,
        'get_user_details',
        userToken || ' '
    );


    const userDetails = userdetails?.data?.data?.users.find(
        (item: { id: string | string[] }) => item.id == userId
    );


    const [searchVal, setSearchVal] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);
    const datePickerRef = useRef<DatePicker>(null);

    const handleOkClick = () => {
        setSelectedDate(tempSelectedDate);
        datePickerRef.current?.setOpen(false);
    };

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchVal(event.target.value);
    };

    // Helper to format date to yyyy-mm-dd for comparison
    const formatDate = (date: Date | null) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Filtering logic
    const filteredTickets = (userDetails?.ticket_list || []).filter((ticket: any) => {
        // Search filter (by ticket_number or item_purchased)
        const searchMatch =
            searchVal.trim() === '' ||
            (ticket.ticket_number && ticket.ticket_number.toLowerCase().includes(searchVal.toLowerCase())) ||
            (ticket.item_purchased && ticket.item_purchased.toLowerCase().includes(searchVal.toLowerCase()));
        // Date filter (exact match)
        const dateMatch =
            !selectedDate ||
            (ticket.date && ticket.date.startsWith(formatDate(selectedDate)));
        return searchMatch && dateMatch;
    });


    // console.log(userDetails?.ticket_list, 'userDetails')

    return (
        <section className="flex-col flex justify-center">
            <div className="w-full bg-gray-100">
                <ProfileHeader />
                <p
                    className="lg:px-14 px-7  text-[#F25E26] underline cursor-pointer"
                    onClick={() => router.back()}
                >
                    Back
                </p>
                <span className="w-full bg-gray-100">
                    <h1 className="text-2xl text-center py-2 mb-6">Ticket</h1>
                </span>
            </div>

            <div className="mt-6 lg:px-14 px-7">

                <section className="flex flex-col md:flex-row justify-between items-center mt-4 mb-4 gap-4">
                    <div className="relative w-full md:w-auto">
                        <span className="absolute mr-6 mt-3">
                            <CiSearch className="text-xl mx-2" />
                        </span>
                        <input
                            type="text"
                            name="Search here..."
                            id="search"
                            placeholder="Search here..."
                            className=" pl-8 py-2 text-sm focus:text-black focus:outline-[#FCDFD4] border rounded-lg w-full md:w-[300px]"
                            value={searchVal}
                            onChange={handleSearchInputChange}
                            autoComplete="off"
                        />
                    </div>


                    <div className="w-full md:w-auto">

                        <DatePicker
                            ref={datePickerRef}
                            selected={tempSelectedDate}
                            onChange={(date) => setTempSelectedDate(date)}
                            onCalendarOpen={() => setTempSelectedDate(selectedDate)}
                            placeholderText="Select dates"
                            className="border rounded-lg py-2 focus:outline-[#FCDFD4] px-2 w-full"
                            minDate={new Date("2025-01-01")}
                            shouldCloseOnSelect={false}
                        >
                            <div className="flex justify-end p-2 border-t mt-1">
                                <button
                                    type="button"
                                    onClick={handleOkClick}
                                    className="bg-[#F25E26] text-white px-4 py-1 rounded-md text-sm"
                                >
                                    Ok
                                </button>
                            </div>
                        </DatePicker>
                    </div>
                </section>


                {/* Desktop Table */}
                <div className="hidden md:block">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-[#FCDFD4] text-left">
                                <th className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">No of Tickets Purchased</th>
                                <th className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">Date and Time of Purchase</th>
                                <th className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">Ticket Amount</th>
                                <th className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">Ticket Number</th>
                                <th className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">Items Purchased</th>
                            </tr>
                        </thead>
                        <tbody className='mt-8' >
                            {filteredTickets.length > 0 ? (
                                filteredTickets.map((ticket: any, index: number) => (
                                    <tr key={ticketRowKey(ticket, index)} className="bg-[#F6F6F6] ">
                                        {index === 0 && (
                                            <td
                                                className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium"
                                                rowSpan={filteredTickets.length}
                                            >
                                                {filteredTickets.length}
                                            </td>
                                        )}
                                        <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">{ticket.date}</td>
                                        <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">{formatCurrency(ticket.ticket_amount)}</td>
                                        <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">
                                            {isWinningTicket(ticket) ? (
                                                <p
                                                    onClick={() => {
                                                        setSelectedTicket(ticket);
                                                        setShowTicket(true);
                                                    }}
                                                    className="text-green-600 underline font-bold cursor-pointer"
                                                    title="This ticket has won"
                                                >
                                                    {ticket.ticket_number}
                                                </p>
                                            ) : (
                                                ticket.ticket_number
                                            )}
                                        </td>
                                        <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">{ticket.item_purchased}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center p-4">No tickets found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden">
                    {filteredTickets.length > 0 ? (
                        <div>
                            <div className="mb-4 text-center">
                                <span className="font-bold text-lg">{filteredTickets.length}</span>
                                <span className="text-gray-600"> Tickets Purchased</span>
                            </div>
                            {filteredTickets.map((ticket: any, index: number) => (
                                <div key={ticketRowKey(ticket, index)} className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
                                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                                        <span className="text-sm text-gray-500">Ticket No.</span>
                                        {isWinningTicket(ticket) ? (
                                            <p
                                                onClick={() => {
                                                    setSelectedTicket(ticket);
                                                    setShowTicket(true);
                                                }}
                                                className="text-green-600 underline font-bold cursor-pointer"
                                                title="This ticket has won"
                                            >
                                                {ticket.ticket_number}
                                            </p>
                                        ) : (
                                            <p className="font-semibold">{ticket.ticket_number}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        <span className="text-gray-600">Item:</span>
                                        <span className="text-right font-medium">{ticket.item_purchased}</span>

                                        <span className="text-gray-600">Amount:</span>
                                        <span className="text-right font-medium">{formatCurrency(ticket.ticket_amount)}</span>

                                        <span className="text-gray-600">Date:</span>
                                        <span className="text-right font-medium">{ticket.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-4">No tickets found.</div>
                    )}
                </div>
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
