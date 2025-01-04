import {useState} from "react"
import {Regular} from './Regular'
import {Auction} from "./Auction"
import {useStore } from '@/store/nav-store';


export const Upload =()=>{
    const [active, setActive] =useState(0)
    const isNavbarOpen = useStore(state=> state.isNavbarOpen)

    return (


 <div>

  <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-32 flex justify-center items-center sticky top-0 z-20 ">
      <h1 className="xl:text-2xl 2xl:text-2xl md:text-2xl text-base  leading-tight tracking-tight font-Poppins">Product Upload</h1>
    </div>

    <section className="mt-6 ">
        <div className={` flex  items-center px-20 `}>
          <div
            className={`${
              active == 0 ? "bg-[#FCDFD4]" : ""
            } border-2 border-gray-100 p-4 text-sm rounded-lg cursor-pointer w-[14em] `}
            onClick={() => setActive(0)}
          >
            Regular
          </div>
          <div
            className={`${
              active == 1 ? "bg-[#FCDFD4]" : ""
            } border-2 border-[#D2D2D2]] p-4 text-sm rounded-lg cursor-pointer w-[14em] `}
            onClick={() => setActive(1)}
          >
            Auction
          </div>


        </div>



             {active == 0 ? <Regular /> : <Auction />}
    </section>
</div>

    );
}

