import {Card} from "./Card"
import {regularDetails, auctionDetails} from "@/app/data"
import {UserSearch} from './UserSearch'
import {useStore } from '@/store/nav-store';
import { section } from "framer-motion/client";
import { div } from "framer-motion/m";



export const UserDetails =()=>{
    const isNavbarOpen = useStore(state=> state.isNavbarOpen)
    return (

        //  <section className={`${!isNavbarOpen ? "lg:mt-[15%] xl:mt-[15%] md:mt-[15%] lg:ml-[20%] xl:ml-[20%] mr-[3%] md:ml-[20] ":" mx-[10%]"}flex flex-col`}>

       <div>
  {/* <div className="bg-[#F6F6F6] h-32 p-6  flex justify-center items-center ">
    <h1>User Details</h1>
  </div>

  <section className="">
    <div className="flex gap-4 lg:flex-row flex-col lg:justify-center lg:items-center">
      <Card title="Regular" object={regularDetails} />
      <Card title="Auction" object={auctionDetails} />
    </div>

    <div className="">
      <UserSearch />
    </div>
  </section> */}

  {/* <section className='flex justify-center items-center text-center flex-col bg-[#F6F6F6] p-6 w-full fixed z-10  py-12'>
            <h1 className='xl:text-2xl 2xl:text-2xl md:text-2xl text-base  leading-tight tracking-tight font-Poppins '>{headingText}</h1>
        </section>  */}


  <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-32 flex justify-center items-center sticky top-0 ">
      <h1 className="xl:text-2xl 2xl:text-2xl md:text-2xl text-base  leading-tight tracking-tight font-Poppins">User Details</h1>
    </div>

    <section className="mt-6">
      <div className="flex gap-4 lg:flex-row flex-col lg:justify-center lg:items-center">
        <Card title="Regular" object={regularDetails} />
        <Card title="Auction" object={auctionDetails} />
      </div>

      <div className="mt-6">
        <UserSearch />
      </div>
    </section>
</div>


    )
}