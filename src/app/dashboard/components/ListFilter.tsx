// import React, { useState, useRef } from "react";
// import { CiSearch } from "react-icons/ci";
// // import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { Space } from 'antd';
// import type { RangePickerProps } from "antd/es/date-picker";
// import dayjs from "dayjs";

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// interface ListFilterProps {
//   onSearch: (searchVal: string, startDate: string | null, endDate: string | null) => void;
// }

// export const ListFilter: React.FC<ListFilterProps> = ({ onSearch }) => {
//   const [searchVal, setSearchVal] = useState<string>("");
//   const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

//   // const { RangePicker } = DatePicker;

//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);
//   const datePickerRef = useRef<DatePicker>(null);

//   const handleOkClick = () => {
//     setSelectedDate(tempSelectedDate);
//     datePickerRef.current?.setOpen(false);

//     console.log('Date selected:', tempSelectedDate);

//     // Convert the selected date to start and end date format
//     if (tempSelectedDate) {
//       const dateString = tempSelectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
//       console.log('Date string for API:', dateString);
//       onSearch(searchVal, dateString, dateString);
//     } else {
//       onSearch(searchVal, null, null);
//     }
//   };

//   // Handle Search Input
//   const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value;
//     setSearchVal(value);

//     // Pass the current selected date when searching
//     if (selectedDate) {
//       const dateString = selectedDate.toISOString().split('T')[0];
//       onSearch(value, dateString, dateString);
//     } else {
//       onSearch(value, null, null);
//     }
//   };

//   // Reset Filters
//   const handleReset = () => {
//     setSearchVal("");
//     setDateRange([null, null]);
//     setSelectedDate(null);
//     setTempSelectedDate(null);
//     onSearch("", null, null);
//   }

//   // Handle Date Selection
//   const handleDateChange: RangePickerProps["onChange"] = (dates) => {
//     if (dates) {
//       setDateRange(dates);
//       onSearch(searchVal, dates[0]?.format("YYYY-MM-DD") || null, dates[1]?.format("YYYY-MM-DD") || null);
//     } else {
//       setDateRange([null, null]);
//       onSearch(searchVal, null, null);
//     }
//   };

//   return (
//     <section className="flex justify-between items-center mt-6 ">
//       <div className="relative ">
//         <span className="absolute mr-6 mt-3">
//           <CiSearch className="text-xl mx-2" />
//         </span>
//         <input
//           type="text"
//           name="Search here..."
//           id="search"
//           placeholder="Search here..."
//           className=" pl-8 py-2 text-sm focus:text-black focus:outline-[#FCDFD4] border rounded-lg w-auto xl:w-[300px] 2xl:w-[300px] md:w-[300px] xlw-[300px] lg:w-[300px]"
//           value={searchVal}
//           onChange={handleSearchInputChange}
//           autoComplete="off"
//         />
//       </div>

//       <div className="flex gap-2 items-center">
//         <div className="w-full md:w-auto">
//           <DatePicker
//             ref={datePickerRef}
//             selected={tempSelectedDate}
//             onChange={(date) => setTempSelectedDate(date)}
//             onCalendarOpen={() => setTempSelectedDate(selectedDate)}
//             placeholderText={selectedDate ? `Filtered by: ${selectedDate.toLocaleDateString()}` : "Select date to filter"}
//             className={`border rounded-lg py-2 focus:outline-[#FCDFD4] px-2 w-full ${selectedDate ? 'border-[#F25E26] bg-[#FCDFD4]' : ''}`}
//             shouldCloseOnSelect={false}
//             dateFormat="yyyy-MM-dd"
//           >
//             <div className="flex justify-end p-2 border-t mt-1">
//               <button
//                 type="button"
//                 onClick={handleOkClick}
//                 className="bg-[#F25E26] text-white px-4 py-1 rounded-md text-sm"
//               >
//                 Ok
//               </button>
//             </div>
//           </DatePicker>
//         </div>

//         <button
//           onClick={handleReset}
//           className="text-sm rounded-md border-2 border-[#F25E26] bg-white p-2 text-[#2A2A2A]"
//         >
//           Reset
//         </button>
//       </div>
//     </section>
//   );
// };



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

    console.log('Date selected:', tempSelectedDate);

    // Convert the selected date to start and end date format
    if (tempSelectedDate) {
      const dateString = tempSelectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      console.log('Date string for API:', dateString);
      onSearch(searchVal, dateString, dateString);
    } else {
      onSearch(searchVal, null, null);
    }
  };

  // Handle Search Input
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchVal(value);

    // Pass the current selected date when searching
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
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

      <div className="flex gap-2 items-center">
        <div className="w-full md:w-auto">
          <DatePicker
            ref={datePickerRef}
            selected={tempSelectedDate}
            onChange={(date) => setTempSelectedDate(date)}
            onCalendarOpen={() => setTempSelectedDate(selectedDate)}
            placeholderText={selectedDate ? `Filtered by: ${selectedDate.toLocaleDateString()}` : "Select date"}
            className={`border rounded-lg py-2 focus:outline-[#FCDFD4] px-2 w-full ${selectedDate ? 'border-[#F25E26] bg-[#FCDFD4]' : ''}`}
            shouldCloseOnSelect={false}
            dateFormat="yyyy-MM-dd"
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

        <button
          onClick={handleReset}
          className="text-sm rounded-md border-2 border-[#F25E26] bg-white p-2 text-[#2A2A2A]"
        >
          Reset
        </button>
      </div>
    </section>
  );
};