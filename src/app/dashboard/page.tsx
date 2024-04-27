'use client'
import { useRouter } from 'next/navigation'
import {useEffect} from "react"
import {HeaderTitle} from "./component/HeaderTitle"
import {SideNav} from "@/app/component/SideNav"
import {Header} from "@/app/component/Header"
import {useStore} from '@/store/nav-store';
import {UserDetails} from "./component/UserDetails"
import {Upload} from "./component/Upload"
import useAuthMiddleware from "@/hooks/useAuthMiddleware"

const Page =()=>{
    const router = useRouter()
    const isNavbarOpen = useStore(state=>state.isNavbarOpen)
    const headingText = useStore(state => state.headingText);
    useAuthMiddleware(router)

    return(
    <section className="flex">
        <div className={`${isNavbarOpen? "hidden":""}`}>
            <SideNav/>
        </div>
        
        <div className="flex-auto">
            <Header/>
            <HeaderTitle/>

            <div className="my-4 ">
                { headingText === "User Details"?
                <UserDetails/>
                :headingText === "Upload"?<Upload/>:
                "..."
                }

            </div>
        </div>
    </section>
    )
}

export default Page;