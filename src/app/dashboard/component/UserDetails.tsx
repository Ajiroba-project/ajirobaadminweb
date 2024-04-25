import {Card} from "./Card"
import {regularDetails, auctionDetails} from "@/app/data"
import {UserSearch} from './UserSearch'



export const UserDetails =()=>{
    return (
        
        <section className="lg:mx-6 mx-2 flex  flex-col">
            <div className="flex gap-4 lg:flex-row flex-col lg:justify-center items-center">
                <Card title="Regular" object={regularDetails}/>
                <Card title="Auction" object={auctionDetails}/>
            </div>

            <div className="lg:mx-16 mx-2">
                <UserSearch/>
            </div>
            
        </section>
    )
}