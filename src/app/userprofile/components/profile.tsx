"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import photo from "../../asset/image/photo.png";
// import { ProfileContent } from './ProfileContent';
import { IoIosCamera } from "react-icons/io";
import { userProfile, useAuthStore, profilePhoto } from "@/store/store";
import { LuMenuSquare } from "react-icons/lu";
import { useGetDatanew } from "@/hooks/useGetData";
import Cookies from "js-cookie";
import { ProfileContent } from "./ProfileContent";

export const Profile = () => {
  const [sideNav, setSideNav] = useState<boolean>(false);

  const {
    activeMenu,
    setactiveMenu,
    setProfile,
    setEditProfile,
    editProfile,
    userDetails,
  } = userProfile((state) => ({
    activeMenu: state.activeMenu,
    setactiveMenu: state.setactiveMenu,
    setProfile: state.setProfile,
    setEditProfile: state.setEditProfile,
    editProfile: state.editProfile,
    userDetails: state.userDetails,
  }));

  const { profileurl, setProfileurl } = profilePhoto((state) => ({
    profileurl: state.profileurl,
    setProfileurl: state.setProfileurl,
  }));

  const { isLoggedIn, user, token } = useAuthStore((state) => ({
    isLoggedIn: state.isLoggedIn,
    user: state.user,
    token: state.token,
  }));

  const [userToken, setUserToken] = useState(Cookies.get("token"));

  useEffect(() => {
    setUserToken(userToken);
  }, [userToken]);

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/admin_profile/`;

  const { data: userInfo, isLoading: userLoading } = useGetDatanew(
    url,
    "get_user_details",
    userToken || " ",
  );

  useEffect(() => {
    if (isLoggedIn && userInfo?.profile_image_url) {
      setProfileurl(userInfo.profile_image_url);
    }
  }, [isLoggedIn, userInfo, setProfileurl]);

  const userData = isLoggedIn ? userInfo?.data : userDetails;
  const userphoto = profileurl || userDetails?.profile_image_url || "";

  const menu = ["my profile"];

  return (
    <section
      className=" "
      style={{
        zIndex: 1,
      }}
    >
      <span
        className={`absolute left-0 top-0 cursor-pointer text-[#f25e26] lg:hidden `}
        onClick={() => setSideNav(!sideNav)}
      >
        <LuMenuSquare className="text-2xl" />
      </span>

      <div className="flex 2xl:flex-row xl:flex-row lg:flex-row md:flex-row flex-row gap-10  flex-wrap justify-between">

        <section className="">
          <div className="flex flex-col justify-center lg:w-full">
            <div
              className={`${activeMenu === "my order" || activeMenu === "wallet" || activeMenu === "wallet" || activeMenu === "community" ? "border rounded  flex flex-col  px-2" : " flex flex-col  px-2"}`}
            >
               <div className="relative justify-center flex items-center mt-2 ">
                <Image
                  src={userphoto}
                  width={50}
                  height={50}
                  alt={"profile"}
                  className=" w-24 h-24 rounded-full object-cover"
                  draggable={false}
                />

                <span
                  className="absolute cursor-pointer bottom-0 right-0 rounded-full bg-[#FCDFD4] p-1"
                  onClick={setProfile}
                >
                  <IoIosCamera className="text-xl text-[#F25E26]" />
                </span>
              </div>



            </div>
          </div>
        </section>

        <section className=" 2xl:w-3/5 xl:w-3/5 lg:w-3/5 md:w-3/5 w-full">
          <div className=" ">
            <ProfileContent />
          </div>
        </section>

        <section>
          <div className="">
            {activeMenu === "my profile" ? (
              <p
                className="brand1 text-[#F25E26]  cursor-pointer  lg:text-left  justify-end underline"
                onClick={setEditProfile}
              >
                {!editProfile ? "Edit Profile" : "Cancel"}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </section>
  );
};
