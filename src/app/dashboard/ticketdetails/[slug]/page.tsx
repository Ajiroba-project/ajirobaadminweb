"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { ProfileHeader, RegistrationHeader } from "@/app/components/Header";
import { DefaultButton } from "@/app/components/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProductUploadSchema } from "@/helper/validation";
import { categories, subcategories } from "@/app/data";
import {
    InputField,
    SelectField,
    TextAreaField,
} from "@/app/components/FormField";
import { CiSearch } from "react-icons/ci";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useRouter } from "next/navigation";
import { useGetDatanew } from "@/hooks/useGetData";
import Cookies from 'js-cookie'
import RaffleTicket from "../../components/RaffleTicket";

export default function Page() {
    const [selectedImg, setSelectedImg] = useState<any>([
        "https://www.shutterstock.com/image-illustration/vintage-apple-leaf-isolated-on-600nw-2293343413.jpg",
        "https://media.istockphoto.com/id/184276818/photo/red-apple.jpg?s=612x612&w=0&k=20&c=NvO-bLsG0DJ_7Ii8SSVoKLurzjmV0Qi4eGfn6nW3l5w=",
        "https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg",
        "https://i0.wp.com/blossomkitty.com/wp-content/uploads/2021/02/e0fe1c0ebd2f75d5f682b058142618fd.jpg?fit=648%2C677&ssl=1",
    ]);
    const [userToken, setUserToken] = useState(Cookies.get('token'));

    const router = useRouter();

    const [mainImage, setMainImage] = useState<string>(selectedImg[0]);

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


    // The original code uses .map, which returns an array of the same length as users,
    // but with undefined for non-matching items. To get just the matching user, use .find:
    const userDetails = userdetails?.data?.data?.users.find(
        (item: { id: string | string[] }) => item.id == userId
    );

    const {
        reset,
        register,
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        watch,
        setValue,
    } = useForm({
        mode: "all",
        resolver: yupResolver(ProductUploadSchema),
    });
    const RemoveImg = (val: string) => {
        setSelectedImg(selectedImg.filter((e: string) => e !== val));
        URL.revokeObjectURL(val);
    };

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
                >x
                    Back
                </p>
                <span className="w-full bg-gray-100">
                    <h1 className="text-2xl text-center py-2 mb-6">Ticket</h1>
                </span>
            </div>

            <div className="mt-6 lg:px-14 px-7">

                <section className="flex justify-between items-center mt-4 mb-4 ">
                    <div className="relative ">
                        <span className="absolute mr-6 mt-3">
                            <CiSearch className="text-xl mx-2" />
                        </span>
                        <input
                            type="text"
                            name="Search here..."
                            id="search"
                            placeholder="Search here..."
                            className=" pl-8 py-2 text-sm focus:text-black focus:outline-[#FCDFD4] border rounded-lg w-auto xl:w-[300px] 2xl:w-[300px] md:w-[300px] xlw-[300px] lg:w-[300px]"
                            value={searchVal}
                            onChange={handleSearchInputChange}
                            autoComplete="off"
                        />
                    </div>


                    <div>

                        <DatePicker
                            ref={datePickerRef}
                            selected={tempSelectedDate}
                            onChange={(date) => setTempSelectedDate(date)}
                            onCalendarOpen={() => setTempSelectedDate(selectedDate)}
                            placeholderText="Select dates"
                            className="border rounded-lg py-2 focus:outline-[#FCDFD4] px-2"
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
                                <tr key={index} className="bg-[#F6F6F6] ">
                                    {index === 0 && (
                                        <td
                                            className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium"
                                            rowSpan={filteredTickets.length}
                                        >
                                            {filteredTickets.length}
                                        </td>
                                    )}
                                    <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">{ticket.date}</td>
                                    <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">{ticket.ticket_amount}</td>
                                    <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">
                                        {index === 1 ? (
                                            // Simulate "won" state for the second item
                                            <p onClick={() => {
                                                setSelectedTicket(ticket);
                                                setShowTicket(true);
                                            }}

                                                className="text-green-600 underline font-bold cursor-pointer"
                                                title="This ticket has won!"
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


            {showticket && selectedTicket && (
                <RaffleTicket
                    onClose={() => setShowTicket(false)}
                    ticket_number={selectedTicket.ticket_number || 'N/A'}
                    ticket_price={selectedTicket.ticket_amount || 'N/A'}
                    purchase_date={selectedTicket.date || 'N/A'}
                    product={selectedTicket.item_purchased || 'N/A'}
                    raffle_date={'N/A'} // Data not available in ticket_list
                    raffle_time={'N/A'} // Data not available in ticket_list
                />
            )}

        </section>
    );
}
