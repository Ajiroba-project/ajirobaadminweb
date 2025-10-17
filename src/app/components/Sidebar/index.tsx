import React, { useEffect, useState } from "react";


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

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/admin_profile/`;

  const { data: userInfo, isLoading: userLoading } = useGetDatanew(
    url,
    "get_user_details",
    userToken || " ",
  );

  // console.log(userInfo?.profile_image_url, 'usss')

  const handleClick = ({
    val,
    index,
  }: handleProp & { val: { name: string, url: string } }) => {
    setActive(active === index ? null : index);
    setHeadingText(val.name);
    router.push(`/dashboard/${val.url}`)
  };

  const openModal = () => {
    setSignout(!signout);
  };
  const handleSignout = (x: boolean) => {
    x ? sumbitForm() : openModal();
  };

  const handleSuccess = () => {
    clearAuthCookies();
    localStorage.removeItem("user");
    localStorage.clear();
    router.replace("/signin");
  };
  const handleError = () => {
    // console.log("Somthing went wrong...");
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
      url: "/api/signout/",
      payload: {}, // Add an empty payload object
    });
  };

  const setNavbarOpen = useStore((state) => state.setNavbarOpen);

  const pathname = usePathname();

  //

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
      className={`sidebarcard fixed top-0 left-0 h-full w-64 lg:w-72 xl:w-80 bg-[#F6F6F6] border-r dark:border-[#1A1924] border-[#D8DEE4] shadow-lg flex flex-col z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative`}
    >

      <div className="py-6 lg:py-8 flex items-center bg-[#F6F6F6] shadowCard rounded-none border-none h-16 lg:h-20 px-4 lg:px-6">
        <Link href="/signin">
          <Image src={Brand} alt="brand logo" className="w-32 lg:w-36 xl:w-40" />
        </Link>
      </div>

      <nav className={`flex flex-col flex-1 py-6 lg:py-10 gap-8 lg:gap-20 container ${
        isNavbarOpen ? "hidden lg:block" : "block"
      }`}>
        <div className="mx-4 lg:mx-6 flex items-center">
          {/* ... existing content ... */}
        </div>
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {SideNavMenu.map((val, index) => (
              <li
                key={index}
                onClick={() => handleClick({ val, index })}
                className={`${
                  pathname === val.path ? "bg-[#FCDFD4] ring-[#E84526]" : ""
                } py-3 lg:py-4 hover:ring-[#E84526] hover:ring-2 hover:bg-[#FCDFD4] px-4 lg:px-6 transition-all duration-200`}
              >
                <Link href={val.path} className="flex gap-2 lg:gap-3 items-center">
                  <Image src={val.icon} alt={val.name} className="w-5 h-5 lg:w-6 lg:h-6" />
                  <p className="text-sm lg:text-base">{val.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* User Profile and Sign Out - Fixed at Bottom */}
      <div className="mt-auto p-4 lg:p-6 border-t border-gray-200">
        <div className="flex flex-col gap-3 items-center justify-center">
          <div className="flex gap-2 lg:gap-3 pb-4 items-center">
            <div className="rounded-full h-8 w-8 lg:h-10 lg:w-10 bg-[#FCDFD4] ring-[#F25E26] overflow-hidden">
              <Image 
                src={userInfo?.profile_image_url || user_img} 
                alt="dp" 
                width={40} 
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-[#2A2A2A] text-sm lg:text-base font-medium truncate">
                {userInfo?.data?.first_name || 'User'}
              </h2>
              <p className="text-xs lg:text-sm text-gray-600 truncate">
                {userInfo?.data?.email || 'email@example.com'}
              </p>
            </div>
          </div>
          <div
            className="cursor-pointer flex gap-2 items-center text-[#F25E26] hover:text-[#E84526] transition-colors duration-200"
            onClick={openModal}
          >
            <CiLogout className="text-xl lg:text-2xl" />
            <p className="text-sm lg:text-base">Sign Out</p>
          </div>
        </div>
      </div>

      {/* ... existing modal code ... */}


      {signout && (
        <div className="flex absolute top-0">
          <Modal
            title="Are you sure you want to sign out"
            subtitle="you will be logged out of the system"
            buttoncount={2}
            buttontext={status == "Pending" ? "Signing out..." : "Yes"}
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

    </aside>
  );
};

export default Sidebar;

