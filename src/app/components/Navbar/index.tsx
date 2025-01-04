'use client'

import React, { useState } from "react";
// import ToggleBtn from "../ToggleBtn";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
// import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Header } from "../Header";
import { HeaderNavMenu } from "@/app/data";
import { GoBell } from "react-icons/go";


interface NavbarProps {
  toggleSidebar: () => void;
  navtitle?: string;
}

type headerTitleProps = {
    title:string,
    subtitle?:string,
    className?:any,

}
type activeProps = number | null;

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, navtitle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
//   const { logout } = useAuth();

//   const  toggleNavbar  = useStore(state => state.toggleNavbar );
//   const isNavbarOpen = useStore(state=> state.isNavbarOpen)
  const [active, setActive] = useState <activeProps>(null)

  return (
    <header className="h-[4rem] flex justify-between items-center p-4 bg-[#F6F6F6] shadow-lg z-10 border   rounded-none  w-full">

      <Link href="" className="text-base font-bold text-[#30313D] txtNormal">

        {navtitle}
      </Link>
        <div className="flex items-center space-x-6">
            <ul className="flex gap-6 justify-evenly">
        {HeaderNavMenu.map((val, index)=>(
          <li className="text-[#A09F9F] font-Poppins " key={index} onClick={() => setActive(index)}>
            <Link href={val.path} className={`lg:text-md text-sm ${active === index? "text-[#F25E26]":null}`}>
              {val.name}
            </Link>
          </li>
        ))}

      </ul>
        </div>

      <nav className="hidden md:flex items-center space-x-6">

         <div className="relative mx-6">
        <GoBell className="text-xl"/>
        <span className="absolute"></span>

      </div>


      </nav>

      <button
        onClick={toggleSidebar}
        className="md:hidden flex items-center text-gray-700 focus:outline-none"
      >
        ☰
      </button>
    </header>
  );
};

export default Navbar;
