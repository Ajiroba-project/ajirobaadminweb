import React from "react";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";

export const ListFilter = ({onSearch}:any) => {
  const [searchval, setSearchVal] = useState<string>("");
  const [date, setDate] =useState<string>("")

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setSearchVal(value);
    onSearch(value)
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setDate(value);
    // onSearch(value);
  };

  return (
    <section className="flex justify-between items-center py-4 mt-6 ">
      <div className="relative ">
        <span className="absolute mr-6 mt-3">
          <CiSearch className="text-xl mx-2" />
        </span>
        <input
          type="text"
          name="Search here..."
          id="search"
          placeholder="Search"
          className=" pl-8 py-2 focus:text-black focus:outline-[#FCDFD4] border rounded-lg w-auto xl:w-[300px] 2xl:w-[300px] md:w-[300px] xlw-[300px] lg:w-[300px]"
          value={searchval}
          onChange={handleSearchInputChange}
          autoComplete="off"
        />
      </div>
     
      {/* date */}
      <div>
        <input
          type="date"
          placeholder="Select dates"
          min="2024-04-30"
          className="border rounded-lg py-2 focus:outline-[#FCDFD4] px-2"
          onChange={handleDateChange}
        />
      </div>
    </section>
  );
};
