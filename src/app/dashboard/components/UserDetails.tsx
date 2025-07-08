'use client';

import { Card } from "./Card"
import { regularDetails, auctionDetails } from "@/app/data"
import { UserSearch } from './UserSearch'
import { useStore } from '@/store/nav-store';
import { section } from "framer-motion/client";
import { div } from "framer-motion/m";
import { useState } from "react";
import Cookies from "js-cookie";
import { useGetDatanew } from "@/hooks/useGetData";
import Loading from "@/app/components/Loading";

import ag from "@/app/asset/ag.svg"
import tmg from "@/app/asset/tmg.svg"
import tns from "@/app/asset/tns.svg"
import ps from "@/app/asset/ps.svg"
import bid from "@/app/asset/bid.svg"
import ticket from "@/app/asset/ticket.svg"
import user_img from "@/app/asset/user.png"


export const UserDetails = () => {
  const isNavbarOpen = useStore(state => state.isNavbarOpen)


  const [userToken, setUserToken] = useState(Cookies.get("token"));

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/admin_profile/`;

  const { data: userInfo, isLoading: userLoading, error, isError } = useGetDatanew(
    `/api/userdetails/`,
    "get_user_details",
    userToken || " ",
  );



  interface UserInfoType {
    data: {
      data: {
        regular: {
          users_count: number;
          total_sales: number;
          amount_generated: number;
          pending_sales: number;
        };
      };
    };
  }

  interface Detail {
    icon: string;
    name: string;
    count: number;
  }


  const mapUserInfoToDetails = [
    {
      icon: tmg,
      name: "TOTAL REGISTERED USER",
      count: userInfo?.data?.data?.regular.users_count || 0,
    },
    {
      icon: tns,
      name: "TOTAL NUMBER OF SALES",
      count: userInfo?.data?.data?.regular.total_sales || 0,
    },
    {
      icon: ag,
      name: "AMOUNT GENERATED",
      count: userInfo?.data?.data?.regular.amount_generated || 0,
    },
    {
      icon: ps,
      name: "PENDING SALES",
      count: userInfo?.data?.data?.regular.pending_sales || 0,
    },
  ];


  const auctionDetails = [
    {
      icon: tmg,
      name: "TOTAL REGISTERED USER",
      count: userInfo?.data?.data?.auction?.users_count || 0,
    },
    {
      icon: ticket,
      name: "TOTAL TICKET PURCHASED",
      count: userInfo?.data?.data?.auction?.total_tickets || 0
    },
    {
      icon: bid,
      name: "TOTAL BID MADE",
      count: userInfo?.data?.data?.auction?.total_bids || 0
    },
    {
      icon: ag,
      name: "TOTAL AMOUNT GENERATED",
      count: userInfo?.data?.data?.auction?.amount_generated || 0
    },
  ]





  if (userLoading) {
    return <Loading />
  }


  // Handle error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="mt-2 text-gray-700">
            {error?.message || "An unexpected error occurred while fetching user details."}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  return (

    <div>

      <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-32 flex justify-center items-center sticky top-0 ">
        <h1 className="xl:text-2xl 2xl:text-2xl md:text-2xl text-base  leading-tight tracking-tight font-Poppins">User Details</h1>
      </div>

      <section className="mt-6 px-4">
        <div className="flex gap-4 lg:flex-row flex-col lg:justify-center lg:items-center">

          <Card title="Regular" object={mapUserInfoToDetails} />
          <Card title="Auction" object={auctionDetails} />
        </div>

        <div className="mt-6 px-2">
          <UserSearch />
        </div>
      </section>
    </div>


  )
}