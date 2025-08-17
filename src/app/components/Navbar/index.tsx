'use client'

import React, { useState } from "react";
// import ToggleBtn from "../ToggleBtn";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
// import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Header } from "../Header";
import { HeaderNavMenu } from "@/app/data";
import { GoBell } from "react-icons/go";
import { FiMenu } from "react-icons/fi";

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
    <header className="h-16 lg:h-20 flex justify-between items-center px-4 lg:px-6 bg-[#F6F6F6] shadow-lg z-30 border rounded-none w-full">

      <Link href="" className="text-sm lg:text-base font-bold text-[#30313D] txtNormal truncate">

        {navtitle}
      </Link>
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <ul className="flex gap-4 lg:gap-6 justify-evenly">
        {HeaderNavMenu.map((val, index)=>(
          <li className="text-[#A09F9F] font-Poppins " key={index} onClick={() => setActive(index)}>
            <Link href={val.path} className={`text-sm lg:text-base transition-colors duration-200 ${active === index? "text-[#F25E26]": "hover:text-[#E84526]"}`}>
              {val.name}
            </Link>
          </li>
        ))}

      </ul>
        </div>

      <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">

         <div className="relative mx-4 lg:mx-6">
        <GoBell className="text-lg lg:text-xl cursor-pointer hover:text-[#F25E26] transition-colors duration-200"/>
        <span className="absolute"></span>

      </div>


      </nav>

      <button
        onClick={toggleSidebar}
        className="md:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-[#F25E26] focus:outline-none focus:ring-2 focus:ring-[#F25E26] rounded-lg transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        <FiMenu className="text-xl" />
      </button>
    </header>
  );
};

export default Navbar;
