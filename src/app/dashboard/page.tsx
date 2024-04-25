'use client'
import {HeaderTitle} from "./component/HeaderTitle"
import {SideNav} from "@/app/component/SideNav"
import {Header} from "@/app/component/Header"
import useStore from '@/store/nav-store';
import {UserDetails} from "./component/UserDetails"
import {Upload} from "./component/Upload"


const Page =()=>{
      const isNavbarOpen = useStore(state=>(state.isNavbarOpen))
      const headingText = useStore(state => state.headingText);
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