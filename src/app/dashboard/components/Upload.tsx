import {useState} from "react"
import {Regular} from './Regular'
import {Auction} from "./Auction"
import {useStore } from '@/store/nav-store';


export const Upload =()=>{
    const [active, setActive] =useState(0)
    const isNavbarOpen = useStore(state=> state.isNavbarOpen)

    return (
      <section
        className={` ${
          !isNavbarOpen
            ? "lg:mt-[15%] xl:mt-[15%] md:mt-[20%] lg:ml-[20%] xl:ml-[20%] mr-[3%] md:ml-[20] mt-[38%]"
            : "mt-[38%] md:mt-[25%] mx-[5%] lg:mt-[10%] justify-center"
        }`}
      >
        <div className={`${!isNavbarOpen ?"":"justify-center"} flex  items-center `}>
          <div
            className={`${
              active == 0 ? "bg-[#FCDFD4]" : ""
            } border-2 border-gray-100 p-3 text-sm rounded-lg cursor-pointer w-[10em] `}
            onClick={() => setActive(0)}
          >
            Regular
          </div>
          <div
            className={`${
              active == 1 ? "bg-[#FCDFD4]" : ""
            } border-2 border-gray-100 p-3 text-sm rounded-lg cursor-pointer w-[10em] `}
            onClick={() => setActive(1)}
          >
            Auction
          </div>
        </div>

        {active == 0 ? <Regular /> : <Auction />}
      </section>
    );
}

