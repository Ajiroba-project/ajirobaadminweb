import React from 'react'
import { Card } from "./Card";
import { regularDetails, auctionDetails } from "@/app/data";
import { UserSearch } from "./UserSearch";
import { useStore } from "@/store/nav-store";
import { section } from "framer-motion/client";
import { div } from "framer-motion/m";
import { IconButton } from "@/app/component/Button";
import { MdOutlineFileDownload } from "react-icons/md";
import { useState } from "react";
import Regulardeals from "./Regulardeals";
import Recharge from "./Recharge";
import Auctiondeals from "./Auctiondeals";
import AnalyticsTable from './AnalyticsTable';

function Analytics() {
  return (
     <div className='' >
      <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-auto  sticky top-0 ">
        <div className="flex justify-between py-6 px-12 flex-wrap gap-4" style={{
      margin : '0 auto',
      width : '85%',
     }} >
          <div>
            <h1 className="xl:text-2xl 2xl:text-2xl md:text-2xl text-base font-bold  leading-tight tracking-tight font-Poppins">
              Intelligence Performance Report
            </h1>
          </div>


        </div>


      </div>


      <section className='pt-8' style={{
      margin : '0 auto',
      width : '85%',
     }}  >

    <AnalyticsTable />

      </section>






    </div>
  )
}

export default Analytics
