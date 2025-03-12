import React from "react";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DatePicker, Space } from 'antd';
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";

interface ListFilterProps {
  onSearch: (searchVal: string, startDate: string | null, endDate: string | null) => void;
}

export const ListFilter: React.FC<ListFilterProps> = ({ onSearch }) => {
  const [searchVal, setSearchVal] = useState<string>("");
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const { RangePicker } = DatePicker;

 // Handle Search Input
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchVal(value);
    onSearch(value, dateRange[0]?.format("YYYY-MM-DD") || null, dateRange[1]?.format("YYYY-MM-DD") || null);
  };




 // Reset Filters
  const handleReset = () => {
    setSearchVal("");
    setDateRange([null, null]);
    onSearch("", null, null);
  }

  // Handle Date Selection
  const handleDateChange: RangePickerProps["onChange"] = (dates) => {
    if (dates) {
      setDateRange(dates);
      onSearch(searchVal, dates[0]?.format("YYYY-MM-DD") || null, dates[1]?.format("YYYY-MM-DD") || null);
    } else {
      setDateRange([null, null]);
      onSearch(searchVal, null, null);
    }
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

        <RangePicker
          value={dateRange}
          onChange={handleDateChange}
          format="YYYY-MM-DD"
          allowClear
          className="mr-2"
        />


        <button onClick={handleReset} className="text-sm rounded-md border-2 border-[#F25E26] bg-white p-1 text-[#2A2A2A]">
        Reset
      </button>
      </div>


    </section>
  );
};
