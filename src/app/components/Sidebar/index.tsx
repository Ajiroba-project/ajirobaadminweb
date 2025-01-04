import React, { useEffect, useState } from "react";

import {
  FiShield,
  FiMonitor,
  FiUser,
  FiSettings,
  FiHome,
} from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import "./style.css";
import { CiHome, CiLogout } from "react-icons/ci";
import Link from "next/link";
import { usePathname } from "next/navigation";


import Brand from "@/app/asset/logo.svg";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { SideNavMenu } from "@/app/data";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

import { useStore, useAuthStore } from "@/store/nav-store";
import { useMutateData } from "@/hooks/useMutateData";
import { Modal } from "@/app/dashboard/components/Modal";
import signoutImage from "@/app/asset/signout.svg";
import user_img from "@/app/asset/user.png";
import { userProfile } from "@/store/store";
import Cookies from "js-cookie";
import { useGetDatanew } from "@/hooks/useGetData";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

type MenuState = number | null;
type handleProp = {
  val: {};
  index: number;
};


const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {

    const toggleNavbar = useStore((state) => state.toggleNavbar);
  const clearAuthCookies = useAuthStore((state) => state.clearAuthCookies);
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  const setHeadingText = useStore((state) => state.setHeadingText);
  const [active, setActive] = useState<MenuState>(0);
  const [signout, setSignout] = useState<boolean>(false);
  const router = useRouter();

  const [userToken, setUserToken] = useState(Cookies.get("token"));

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/user/view_profile/`;

  const { data: userInfo, isLoading: userLoading } = useGetDatanew(
    url,
    "get_user_details",
    userToken || " ",
  );

  const handleClick = ({
    val,
    index,
  }: handleProp & { val: { name: string } }) => {
    setActive(active === index ? null : index);
    setHeadingText(val.name);
  };

  const openModal = () => {
    setSignout(!signout);
  };
  const handleSignout = (x: boolean) => {
    x ? sumbitForm() : openModal();
  };

  const handleSuccess = () => {
    clearAuthCookies();
    router.replace("/signin");
  };
  const handleError = () => {
    console.log("Somthing went wrong...");
    clearAuthCookies();
    router.replace("/signin");
  };

  const { mutate, status } = useMutateData(
    "signup",
    handleSuccess,
    handleError,
  );

  const sumbitForm = async () => {
    mutate({
      url: "api/signout/",
      payload: {}, // Add an empty payload object
    });
  };

  const setNavbarOpen = useStore((state) => state.setNavbarOpen);

  const pathname = usePathname();

  //   const isActive = (path: string) => location.pathname === path;
  const isActive = (path: string) => {
    return pathname === path;
  };

  const [, setDarkMode] = useState(false);

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(matchMedia.matches);
    matchMedia.addEventListener("change", (e) => setDarkMode(e.matches));
  }, []);

  return (
    <aside
      className={`sidebarcard fixed top-0 left-0 h-full w-[278px]  bg-[#F6F6F6]  border-r dark:border-[#1A1924] border-[#D8DEE4] shadow-lg flex flex-col z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 md:translate-x-0 md:relative`}
    >

      <div className="py-8 flex items-center justify-center bg-[#F6F6F6]  shadowCard rounded-none border-none h-[4rem]">
        <div className=" flex items-center justify-center bg-[#F6F6F6]  shadowCard rounded-none border-none h-[4rem]">
         {/*  <Link href="/" className="text-2xl font-bold text-gray-800">
            <span className="text-gray-800 txtNormal">Data</span>
            <span className="text-green-500">mellon</span>
          </Link> */}

           <Link href="/">
              <Image src={Brand} alt="brand logo" />
            </Link>
        </div>
      </div>

   {/*   <nav className="mt-4 flex flex-col space-y-2 px-4">
        <Link href="/" className=" flex items-center mb-4 gap-2 px-4 ">
          <div className="text-[#353A44] txtNormal mt-1 txtNormal">
            <IoIosArrowRoundBack />
          </div>
          <div className="text-[#353A44] txtNormal text-sm cursor-pointer">
            Back
          </div>
        </Link>

        <Link
          href="/fraud-detection"
          className={` text-sm rounded-lg flex items-center px-4 py-2  ${
            isActive("/fraud-detection") ? "bg-[#75B748] text-white" : ""
          }`}
        >
          <div className="mr-3    ">
            <CiHome className="text-base" />
          </div>
          Home
        </Link>
        <Link
          href="/fraud-intelligence"
          className={` text-sm rounded-lg flex items-center px-4 py-2 text-[#6C7688] txtNormal  ${
            isActive("/fraud-intelligence") ? "bg-[#75B748] text-white" : ""
          }`}
        >
          <FiShield className="mr-3  txtNormal" />
          Fraud Intelligence
        </Link>
        <Link
          href="/transaction-monitoring"
          className={` text-sm rounded-lg flex items-center px-4 py-2 text-[#6C7688] txtNormal  ${
            isActive("/transaction-monitoring") ? "bg-[#75B748] text-white" : ""
          }`}
        >
          <FiMonitor className="mr-3" />
          Transaction Monitoring
        </Link>
        <Link
          href="/fraud-user-activity"
          className={` text-sm rounded-lg flex items-center px-4 py-2 text-[#6C7688] txtNormal  ${
            isActive("/fraud-user-activity") ? "bg-[#75B748] text-white" : ""
          }`}
        >
          <FiUser className="mr-3" />
          User Activity & Behaviour
        </Link>
        <Link
          href="/service"
          className={` text-sm rounded-lg 2xl:hidden md:hidden lg:hidden xl:hidden flex  items-center px-8 py-2 text-[#6C7688] txtNormal  ${
            isActive("/transaction-monitoring") ? "bg-[#75B748] text-white" : ""
          }`}
        >
          <FiSettings className="mr-3" />
          Settings
        </Link>

        <div
          onClick={() => console.log("logout")}
          className={` text-sm rounded-lg 2xl:hidden md:hidden lg:hidden xl:hidden flex items-center px-8 py-2 text-[#6C7688] txtNormal`}
        >
          <CiLogout className="mr-3" />
          Logout
        </div>
      </nav> */}


       <nav
          className={`flex flex-col py-10 gap-20 container ${isNavbarOpen ? "hidden lg:block" : "block"}`}
        >
          <div className="mx-6 flex items-center">


          </div>
          <div>
            <ul>
              {SideNavMenu.map((val, index) => (
                <li
                  key={index}
                  onClick={() => handleClick({ val, index })}
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
          <div className="flex flex-col gap-3 items-center justify-center">
            <div className="flex gap-3 pb-4 items-center">
              <div className="rounded-full h-8 w-8 bg-[#FCDFD4] ring-[#F25E26]">
                <Image src={user_img} alt="dp" />
              </div>
              <div>
                <h2 className="text-[#2A2A2A]">{`${userInfo?.data?.first_name}`}</h2>
                <p className="text-sm">{`${userInfo?.data?.email}`}</p>
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


    </aside>
  );
};

export default Sidebar;

