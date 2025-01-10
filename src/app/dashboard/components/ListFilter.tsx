import React from "react";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ListFilterProps {
  onSearch: (searchVal: string, dateVal: string) => void;
}

export const ListFilter: React.FC<ListFilterProps> = ({ onSearch }) => {
  const [searchVal, setsearchVal] = useState<string>("");
  const [dateVal, setDate] = useState<string>("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setsearchVal(value);
    onSearch(value, searchVal);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setDate(value);
    onSearch(value, dateVal);
  };

  return (
    <section className="flex justify-between items-center mt-6 ">
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
  );
};
