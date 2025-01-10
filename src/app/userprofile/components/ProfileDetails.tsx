'use client'
import React, { useEffect, useState } from 'react';
import { userProfile, useAuthStore } from '@/store/store';
import { ProfileForm } from "./ProfileForm";
import { useGetDatanew } from '@/hooks/useGetData';
// import Loading from '@/app/component/Loading';
import Cookies from 'js-cookie'
import Loading from '@/app/components/Loading';

interface CardInfoItem {
  id?: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  name?: string;
  image?: any;
  price?: string;
  images?: { id: string; product: string; image: string }[];
  discount?: string;
  reviews?: string;
  message?: string;
}

interface AuctionResponse {
  message?: any;
  data: CardInfoItem[];
}

export const ProfileDetails = () => {
  const { userDetails, editProfile } = userProfile((state) => ({
    userDetails: state.userDetails,
    editProfile: state.editProfile,
  }));

  const { isLoggedIn, user, token } = useAuthStore((state) => ({
    isLoggedIn: state.isLoggedIn,
    user: state.user,
    token: state.token,
  }));

  const [userData, setUserData] = useState<any>(null); // State to store user data
  const [isTokenReady, setIsTokenReady] = useState(false); // State to track if the token is available

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/admin_profile/`;

const tkn_: string = Cookies.get('token') as string;


  const { data: userInfo, isLoading: userLoading, isFetching } = useGetDatanew(
    url,
    'get_user_details',
    tkn_ , {
        cacheTime: 0, // disables cache
  staleTime: 0, // data will be considered stale immediately
    }
  );

  useEffect(() => {

    if (tkn_ || Cookies.get('token')) {
      setIsTokenReady(true);
    }
  }, [tkn_]);

  useEffect(() => {
    if (isTokenReady) {
      if (isLoggedIn && userInfo) {
        setUserData(userInfo?.data || {});
      } else if (!isLoggedIn) {
        setUserData(userDetails);
      }
    }
  }, [isTokenReady, userInfo, isLoggedIn, userDetails]);

  // if (userLoading || !userData) {
  //   return <Loading />;
  // }

    if (userLoading) {
    return <Loading />;
  }

  return (
    <section className="mb-6">
      {!editProfile ? (
        <div className="mt-4 flex flex-col gap-8 p-8 shadow-lg">
          <div>
            <h3 className="capitalize text-[#6E6E6E]">First Name</h3>
            <p className="text-semibold capitalize">{userData?.first_name || userData?.firstname}</p>
          </div>
          <div>
            <h3 className="capitalize text-[#6E6E6E]">Last Name</h3>
            <p className="text-semibold capitalize">{userData?.last_name || userData?.lastname}</p>
          </div>
          <div>
            <h3 className="capitalize text-[#6E6E6E]">Email</h3>
            <p className="text-semibold">{userData?.email}</p>
          </div>
          <div>
            <h3 className="capitalize text-[#6E6E6E]">Phone</h3>
            <p className="text-semibold capitalize">{userData?.phone}</p>
          </div>
          <div>
            <h3 className="capitalize text-[#6E6E6E]">Address</h3>
            <p className="text-semibold capitalize">{userData?.address}</p>
          </div>
          <div>
            <h3 className="capitalize text-[#6E6E6E]">State</h3>
            <p className="text-semibold capitalize">{userData?.state}</p>
          </div>
          <div>
            <h3 className="capitalize text-[#6E6E6E]">Local Government Area (LGA)</h3>
            <p className="text-semibold capitalize">{userData?.lga}</p>
          </div>
          <div>
            <h3 className="capitalize text-[#6E6E6E]">Residential Agency Number</h3>
            <p className="text-semibold capitalize">{userData?.residential || userData?.residency}</p>
          </div>
        </div>
      ) : (
        <ProfileForm />
      )}

      {isFetching && <Loading />}
    </section>
  );
};