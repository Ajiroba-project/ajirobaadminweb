'use client'
import {useState} from 'react'
import Brand from "@/app/asset/logo.svg"
import Image from "next/image"
import Link from "next/link"
import {SideNavMenu} from "@/app/data"
import { FiMenu } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import useStore from '@/store/nav-store';

type MenuState =  number | null
type handleProp = {
    val:{},
    index:number
}

export const SideNav =()=>{
      const  toggleNavbar  = useStore(state => state.toggleNavbar );
  const isNavbarOpen = useStore(state=> state.isNavbarOpen)
        const setHeadingText  = useStore(state => state.setHeadingText);
        const [active, setActive]= useState<MenuState>(0)
        
        const handleClick =({val, index}:handleProp & {val: {name: string}})=>{
            setActive(active === index ? null : index)
            setHeadingText(val.name)
        }

    return (
        <>
            <section className="shadow bg-[#F6F6F6]  w-[15em] lg:h-full lg:sticky fixed h-screen z-20">
                <nav className="flex flex-col  py-10 gap-32 container">
                   <div className="mx-6 flex items-center"> 
                   {/* brand icon */}
                        <Link href="/">
                            <Image src={Brand} alt="brand logo"/>
                        </Link>
                        <div className="mx-4">
          {/* if NavbarOpen is true then show close button else show menu button */}
            {isNavbarOpen ? (<FiMenu className="text-2xl cursor-pointer lg:hidden" onClick={toggleNavbar}/>):(<IoClose className="text-2xl cursor-pointer lg:hidden" onClick={toggleNavbar}/>)}
        
      </div>
                    </div>

                    {/* menu */}
                    <div className="">
                        <ul>
                            {SideNavMenu.map((val, index)=>(
                                <li key={index} onClick={()=>{handleClick({val, index}) }} className={`${active== index ? "bg-[#FCDFD4] ring-[#E84526]":""} py-4 hover:ring-[#E84526] hover:ring-2 hover:bg-[#FCDFD4] px-6`}>
                                    <Link href={val.path} className="flex gap-3 items-center">
                                    <Image src={val.icon} alt={val.name}/> <p>{val.name}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* profile */}
                    <div className="px-6 flex gap-3">
                        <div className="rounded-full h-[3em] w-[4em] bg-[#FCDFD4]">
                            ..
                        </div>
                        <div> 
                            <h2 className="text-[#2A2A2A]">Admin </h2>
                            <p className="text-sm">admin@yahoo.com</p>
                        </div>

                    </div>
                </nav>
            </section>
        </>
    )
}

