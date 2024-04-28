"use client"
import Image from "next/image";
import Brand from "../asset/logo.svg";
import Link from "next/link"
import {HeaderNavMenu} from "@/app/data"
import { FiMenu } from 'react-icons/fi'
// import { IoClose } from 'react-icons/io5'
import { GoBell } from "react-icons/go";
import { useState } from 'react';
import {useStore} from '@/store/nav-store';

type headerTitleProps = { 
    title:string,
    subtitle?:string,
    className?:any,

}
type activeProps = number | null;

export const Header = () => {
  const  toggleNavbar  = useStore(state => state.toggleNavbar );
  const isNavbarOpen = useStore(state=> state.isNavbarOpen)
  const [active, setActive] = useState <activeProps>(null)


  return <div className="bg-[#F6F6F6] shadow-lg py-6 z-30 w-full fixed">
    <nav className="flex justify-between items-center">
      <div className="mx-4">
          {/* if NavbarOpen is true then show close button else show menu button */}
            {isNavbarOpen ? (<FiMenu className="text-2xl cursor-pointer" onClick={toggleNavbar}/>):(<FiMenu className="text-2xl cursor-pointer" onClick={toggleNavbar}/>)}
        
      </div>
      <ul className="flex gap-6 justify-evenly">
        {HeaderNavMenu.map((val, index)=>(
          <li key={index} onClick={() => setActive(index)}>
            <Link href={val.path} className={`lg:text-md text-sm ${active === index? "text-[#F25E26]":null}`}>
              {val.name}
            </Link>
          </li>
        ))}

      </ul>

        {/* icon */}
      <div className="relative mx-6">
        <GoBell className="text-xl"/>
        <span className="absolute"></span>

      </div>
      
    </nav>

  </div>
};

export const RegistrationHeader = () => {
  return (
    <>
      <nav className="container p-10 lg:px-14 px-7 md:block   flex justify-center">
       <Link href="/">
        <Image src={Brand} alt="Ajiroba Logo" />
       </Link>
      </nav>
    </>
  );
};


export const HeaderTitle =({title, subtitle, className}:headerTitleProps )=>{
    return (
        <>
        <section className='flex justify-center items-center flex-col '>
            <h1 className={`xl:text-2xl 2xl:text-2xl md:text-2xl text-base font-bold leading-tight tracking-tight text-left ${className}`}>{title}</h1>
            <p className=' mt-4 text-sm font-normal leading-6 text-center w-auto  text-[#353131]' >{subtitle}</p>
        </section>
        </>
   
    )
}