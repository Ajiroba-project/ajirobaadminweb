import React from 'react'
import { useState } from 'react'
import { InputField } from '@/app/component/FormField'
import { CiSearch } from 'react-icons/ci'

export const SearchFilter = () => {
    const [searchval, setSearchVal] = useState<string>('');

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchVal(value);
    }

  return (
    <section>
        <div className="bg-[#FCDFD433]  rounded-lg ">
          <p className="text-xl p-4 ">User</p>
          <div className="relative p-4">
            <span className="absolute mr-6 mt-3">
              <CiSearch className="text-xl mx-2" />
            </span>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search"
              className=" pl-8 py-2 focus:text-black border rounded-sm w-auto xl:w-[300px] 2xl:w-[300px] md:w-[300px] xlw-[300px] lg:w-[300px]"
              value={searchval}
              onChange={handleSearchInputChange}
              autoComplete="off"
            />
          </div>
          </div>

    </section>
  )
}
