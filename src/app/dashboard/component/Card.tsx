import {regularDetails} from "@/app/data"
import Image from "next/image"
import { Poppins } from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "900"], });


type cardProps={
    title:string,
    object?:{}|[]

}

export const Card =({title, object}:cardProps)=>{
    return (
        <section className={`${poppins.className} border-2 border-gray-100 rounded-lg p-4 shadow `}>
        <h1 className="text-xl pb-2">{title}</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 justify-center items-center gap-4 ">
                {
                    object?.map((val, index)=>(
                    <div className={`${index === 0 ?  "bg-[#FCDFD44D]": index=== 1 ? "bg-[#D1DEF64D]": index=== 2 ? "bg-[#D7F8EE4D]": "bg-[#F9F2CC99]"} p-6 h-[10em] w-auto rounded-lg hover:shadow-md cursor-pointer flex flex-col gap-3 items-center justify-center text-center`} key={index}>

                        <div className="flex items-center justify-center">
                            <Image src={val.icon} alt={val.name}/>
                        </div>
                        <div className="">{val.name}</div>
                        <h2 className="leading-2 font-bold">{val.count}</h2>

                    </div>
                    ))
                }

            </div>
        </section>
    )
}