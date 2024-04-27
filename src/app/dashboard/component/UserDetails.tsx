import {Card} from "./Card"
import {regularDetails, auctionDetails} from "@/app/data"
import {UserSearch} from './UserSearch'



export const UserDetails =()=>{
    return (
        
        <section className="lg:mx-6 mx-2 flex  flex-col">
            <div className="flex gap-4 lg:flex-row flex-col lg:justify-center lg:items-center">
                <Card title="Regular" object={regularDetails}/>
                <Card title="Auction" object={auctionDetails}/>
            </div>

            <div className="container">
                <UserSearch/>
            </div>
            
        </section>
    )
}