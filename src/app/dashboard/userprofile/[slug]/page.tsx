"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

export default function Page() {
  const [selectedImg, setSelectedImg] = useState<any>([
    "https://www.shutterstock.com/image-illustration/vintage-apple-leaf-isolated-on-600nw-2293343413.jpg",
    "https://media.istockphoto.com/id/184276818/photo/red-apple.jpg?s=612x612&w=0&k=20&c=NvO-bLsG0DJ_7Ii8SSVoKLurzjmV0Qi4eGfn6nW3l5w=",
    "https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg",
    "https://i0.wp.com/blossomkitty.com/wp-content/uploads/2021/02/e0fe1c0ebd2f75d5f682b058142618fd.jpg?fit=648%2C677&ssl=1",
  ]);
  const router = useRouter();

  const [mainImage, setMainImage] = useState<string>(selectedImg[0]);

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



const pointinfo = {
  data: {
    data: [
      {
        description: "Referral Bonus",
        point: 5,
        date_created: ["2023-10-01", "2023-10-02", "2023-10-03", "2023-10-04", "2023-10-05"],
        ticket_amount: ["$10", "$20", "$5", "$15", "$30"],
        ticket_number: ["12345", "12346", "12347", "12348", "12349"],
        items_purchased: ["Item A", "Item B", "Item C", "Item D", "Item E"],
      },

    ],
  },
};

 const [searchVal, setSearchVal] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value);
  };


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
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
      placeholderText="Select dates"
      className="border rounded-lg py-2 focus:outline-[#FCDFD4] px-2"
      minDate={new Date("2025-01-01")}
    />
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

    {pointinfo?.data?.data?.map((referral: any, index: number) => (
          <tr key={index} className="bg-[#F6F6F6] ">
            <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">{referral.point}</td>
            <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">
              <ul>
                {referral.date_created.map((date: string, i: number) => (
                  <li key={i} className="py-2 text-[#121212] text-base font-Poppins">{date}</li>
                ))}
              </ul>
            </td>
            <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">
              <ul>
                {referral.ticket_amount.map((amount: string, i: number) => (
                  <li key={i} className="py-2 text-[#121212] text-base font-Poppins">{amount}</li>
                ))}
              </ul>
            </td>
            <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">
              <ul>
                {referral.ticket_number.map((number: string, i: number) => (
                  <li key={i} className="py-2 text-[#121212] text-base font-Poppins">{number}</li>
                ))}
              </ul>
            </td>
            <td className="p-3 border border-gray-300 text-sm text-[#121212] font-Poppins font-medium">
              <ul>
                {referral.items_purchased.map((item: string, i: number) => (
                  <li key={i} className="py-2 text-[#121212] text-base font-Poppins">{item}</li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
            </tbody>
          </table>
        </div>

    </section>
  );
}
