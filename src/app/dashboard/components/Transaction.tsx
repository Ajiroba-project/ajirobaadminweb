import {Card} from "./Card"
import {regularDetails, auctionDetails} from "@/app/data"
import {UserSearch} from './UserSearch'
import {useStore } from '@/store/nav-store';
import { section } from "framer-motion/client";
import { div } from "framer-motion/m";
import { IconButton } from "@/app/component/Button";
import { MdOutlineFileDownload } from "react-icons/md";
import { useState } from "react";



export const Transaction =()=>{
    const isNavbarOpen = useStore(state=> state.isNavbarOpen)
        const [active, setActive] =useState(0)

    return (

       <div>

  <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-auto  sticky top-0 ">

      <div className="flex justify-between py-6 px-12 flex-wrap gap-4" >
        <div>
          <h1 className="xl:text-2xl 2xl:text-2xl md:text-2xl text-base font-bold  leading-tight tracking-tight font-Poppins">Gross Transaction Volume</h1>
        </div>

        <div>
             <IconButton
          type='button'
          text='export Csv'
          className='flex items-center gap-2 rounded-lg bg-[#F25E26] p-1 capitalize text-white w-fit justify-items-center'
          icon={<MdOutlineFileDownload className='text-base font-Poppins' />}
        />
        </div>
      </div>



<div className="flex gap-4 2xl:gap-14 xl:gap-14 lg:gap-14 md:gap-14 flex-wrap py-6 px-12" >

<div>
  <h1>Regular Deals</h1>
</div>

<div>
  <h1>Auction Deals</h1>
</div>


<div>
  <h1>Recharge</h1>
</div>

</div>
  </div>

    <section className="mt-6 px-4">
      <div className="flex gap-4 lg:flex-row flex-col lg:justify-center lg:items-center">
        <Card title="Regular" object={regularDetails} />
        <Card title="Auction" object={auctionDetails} />
      </div>

      <div className="mt-6 px-2">
        <UserSearch />
      </div>
    </section>
</div>


    )
}