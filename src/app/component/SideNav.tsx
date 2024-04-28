'use client'
import {useState, Fragment} from 'react'
import Brand from "@/app/asset/logo.svg"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import {SideNavMenu} from "@/app/data"
import { FiMenu } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import {CiLogout} from 'react-icons/ci'
import {useStore, useAuthStore } from '@/store/nav-store';
import { useMutateData } from "@/hooks/useMutateData";
import {Modal} from "@/app/dashboard/component/Modal"
import signoutImage from "@/app/asset/signout.svg"
import user_img from "@/app/asset/user.png"

type MenuState =  number | null
type handleProp = {
    val:{},
    index:number
}

export const SideNav =()=>{
    const  toggleNavbar  = useStore(state => state.toggleNavbar );
    const clearAuthCookies = useAuthStore(state => state.clearAuthCookies)
    const  user  = useAuthStore(state => state.user );
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const isNavbarOpen = useStore(state=> state.isNavbarOpen)
    const setHeadingText  = useStore(state => state.setHeadingText);
    const [active, setActive]= useState<MenuState>(0)
    const [signout, setSignout]=useState<boolean>(false)
    const router = useRouter()
        
    const handleClick =({val, index}:handleProp & {val: {name: string}})=>{
        setActive(active === index ? null : index)
        setHeadingText(val.name)
    }

    const openModal =()=>{
        setSignout(!signout)
    }
    const handleSignout=(x:boolean)=>{
      x ? sumbitForm() :openModal()
    }

    const handleSuccess=()=>{
        clearAuthCookies();
        router.replace("/signin");
    }
    const handleError =()=>{
      console.log("Somthing went wrong...")
    }
    
    const { mutate } = useMutateData(
        "signup",
        handleSuccess,
        handleError,
    );

    const sumbitForm = async () => {
      mutate({
        url: "api/signout/",
        payload: {} // Add an empty payload object
      });
    };



    return (
      <Fragment>
        <section className="shadow bg-[#F6F6F6]  w-[15em] lg:h-full fixed h-screen z-40">
          <nav className="flex flex-col  py-10 gap-20 container">
            <div className="mx-6 flex items-center">
              {/* brand icon */}
              <Link href="/">
                <Image src={Brand} alt="brand logo" />
              </Link>
              <div className="mx-4">
                {/* if NavbarOpen is true then show close button else show menu button */}
                {isNavbarOpen ? (
                  <FiMenu
                    className="text-2xl cursor-pointer lg:hidden"
                    onClick={toggleNavbar}
                  />
                ) : (
                  <IoClose
                    className="text-2xl cursor-pointer lg:hidden"
                    onClick={toggleNavbar}
                  />
                )}
              </div>
            </div>
            {/* menu */}
            <div className="">
              <ul>
                {SideNavMenu.map((val, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleClick({ val, index });
                    }}
                    className={`${
                      active == index ? "bg-[#FCDFD4] ring-[#E84526]" : ""
                    } py-4 hover:ring-[#E84526] hover:ring-2 hover:bg-[#FCDFD4] px-6`}
                  >
                    <Link href={val.path} className="flex gap-3 items-center">
                      <Image src={val.icon} alt={val.name} /> <p>{val.name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* profile */}
            <div className=" flex flex-col gap-3 items-center justify-center">
              <div className="flex gap-3 pb-4 items-center">
                <div className="rounded-full h-8 w-8 bg-[#FCDFD4] ring-[#F25E26]">
                  <Image src={user_img} alt="dp"/>
                </div>
                <div>
                  <h2 className="text-[#2A2A2A]">
                    {isLoggedIn ? `${user?.data.first_name}` : "Admin"}
                  </h2>
                  <p className="text-sm">
                    {isLoggedIn
                      ? `${user?.data.email}`
                      : "admin@ajiroba.com"}
                  </p>
                </div>
              </div>
              <div
                className="cursor-pointer flex gap-2 items-center text-[#F25E26]"
                onClick={openModal}
              >
                <CiLogout className="text-2xl text-[#F25E26]" />
                <p className="">Sign Out</p>
              </div>
            </div>
          </nav>

          {signout && (
            <div className="flex absolute top-0">
              <Modal
                title="Are you sure you want to sign out"
                subtitle="you will be logged out of the system"
                buttoncount={2}
                buttontext="Yes"
                button2text="No"
                buttonclass="bg-[#FCDFD4] p-5 rounded-lg text-sm hover:shadow w-full px-14"
                button2class="p-4 rounded-lg border-2 border-[#F25E26] px-14"
                buttontype="submit"
                button2type="submit"
                handleEvent={() => handleSignout(true)}
                handleEvent2={() => handleSignout(false)}
                icon={signoutImage}
              />
            </div>
          )}
        </section>
      </Fragment>
    );
}

