import {Card} from "./Card"
import {regularDetails, auctionDetails} from "@/app/data"
import {UserSearch} from './UserSearch'
import {useStore } from '@/store/nav-store';



export const UserDetails =()=>{
    const isNavbarOpen = useStore(state=> state.isNavbarOpen)
    return (
        
        <section className={`${!isNavbarOpen ? "lg:mt-[15%] xl:mt-[15%] md:mt-[15%] lg:ml-[20%] xl:ml-[20%] mr-[3%] md:ml-[20] m":" mx-[10%]"}flex flex-col`}>
            <div className="flex gap-4 lg:flex-row flex-col lg:justify-center lg:items-center">
                <Card title="Regular" object={regularDetails}/>
                <Card title="Auction" object={auctionDetails}/>
            </div>

            <div className="">
                <UserSearch/>
            </div>
            
        </section>
    )
}