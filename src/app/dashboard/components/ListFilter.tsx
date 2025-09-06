import React, { useState, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ListFilterProps {
  onSearch: (searchVal: string, startDate: string | null, endDate: string | null) => void;
}

export const ListFilter: React.FC<ListFilterProps> = ({ onSearch }) => {
  const [searchVal, setSearchVal] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);
  const datePickerRef = useRef<DatePicker>(null);

  const handleOkClick = () => {
    setSelectedDate(tempSelectedDate);
    datePickerRef.current?.setOpen(false);
  
    if (tempSelectedDate) {
      const y = tempSelectedDate.getFullYear();
      const m = String(tempSelectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(tempSelectedDate.getDate()).padStart(2, '0');
      const dateString = `${y}-${m}-${d}`;
      onSearch(searchVal, dateString, dateString);
    } else {
      onSearch(searchVal, null, null);
    }
  };

  // Handle Search Input
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchVal(value);
  
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      const dateString = `${y}-${m}-${d}`;
      onSearch(value, dateString, dateString);
    } else {
      onSearch(value, null, null);
    }
  };

  // Reset Filters
  const handleReset = () => {
    setSearchVal("");
    setSelectedDate(null);
    setTempSelectedDate(null);
    onSearch("", null, null);
  };

  return (
    <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 mt-4 lg:mt-6">
      {/* Search Input */}
      <div className="relative w-full lg:w-auto">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <CiSearch className="text-lg lg:text-xl" />
        </span>
        <input
          type="text"
          name="Search here..."
          id="search"
          placeholder="Search here..."
          className="w-full lg:w-64 xl:w-80 pl-10 pr-4 py-2 lg:py-3 text-sm lg:text-base focus:text-black focus:outline-none focus:ring-2 focus:ring-[#FCDFD4] border border-gray-300 rounded-lg transition-all duration-200"
          value={searchVal}
          onChange={handleSearchInputChange}
          autoComplete="off"
        />
      </div>

      {/* Date Picker and Reset Button */}
      <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full lg:w-auto">
        <div className="w-full sm:w-auto">
          <DatePicker
            ref={datePickerRef}
            selected={tempSelectedDate}
            onChange={(date) => setTempSelectedDate(date)}
            onCalendarOpen={() => setTempSelectedDate(selectedDate)}
            placeholderText={selectedDate ? `Filtered by: ${selectedDate.toLocaleDateString()}` : "Select date"}
            className={`w-full sm:w-48 border rounded-lg py-2 lg:py-3 focus:outline-none focus:ring-2 focus:ring-[#FCDFD4] px-3 text-sm lg:text-base transition-all duration-200 ${
              selectedDate ? 'border-[#F25E26] bg-[#FCDFD4]' : 'border-gray-300 hover:border-gray-400'
            }`}
            shouldCloseOnSelect={false}
            dateFormat="yyyy-MM-dd"
          >
            <div className="flex justify-end p-2 border-t mt-1">
              <button
                type="button"
                onClick={handleOkClick}
                className="bg-[#F25E26] text-white px-4 py-2 rounded-md text-sm hover:bg-[#E84526] transition-colors duration-200"
              >
                Ok
              </button>
            </div>
          </DatePicker>
        </div>

        <button
          onClick={handleReset}
          className="w-full sm:w-auto text-sm lg:text-base rounded-lg border-2 border-[#F25E26] bg-white py-2 lg:py-3 px-4 lg:px-6 text-[#2A2A2A] hover:bg-[#F25E26] hover:text-white transition-all duration-200"
        >
          Reset
        </button>
      </div>
    </section>
  );
};