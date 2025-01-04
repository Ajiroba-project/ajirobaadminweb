import {Card} from "./Card"
import {regularDetails, auctionDetails} from "@/app/data"
import {UserSearch} from './UserSearch'
import {useStore } from '@/store/nav-store';
import { section } from "framer-motion/client";
import { div } from "framer-motion/m";



export const UserDetails =()=>{
    const isNavbarOpen = useStore(state=> state.isNavbarOpen)
    return (

       <div>

  <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-32 flex justify-center items-center sticky top-0 ">
      <h1 className="xl:text-2xl 2xl:text-2xl md:text-2xl text-base  leading-tight tracking-tight font-Poppins">User Details</h1>
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