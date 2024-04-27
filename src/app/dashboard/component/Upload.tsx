import {useState} from "react"
import {Regular} from './Regular'
import {Auction} from "./Auction"

export const Upload =()=>{
    const [active, setActive] =useState(0)
    return (
        <section className="flex  flex-col mx-6">

        <div className="flex  items-center">
                <div className={`${active ==0?"bg-[#FCDFD4]":""} border-2 border-gray-100 p-3 text-sm rounded-lg cursor-pointer w-[10em] `} onClick={()=>setActive(0)}>Regular</div>
                <div className={`${active ==1?"bg-[#FCDFD4]":""} border-2 border-gray-100 p-3 text-sm rounded-lg cursor-pointer w-[10em] `} onClick={()=>setActive(1)}>Auction</div>
        </div>

        {active == 0 ? <Regular/>:<Auction/>}

        </section>
    )
}

