'use client'
import { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { users } from "@/app/data"
import Image from "next/image"
import Link from "next/link"
import { useGetDatanew } from '@/hooks/useGetData'
import Cookies from 'js-cookie'
import user_img from "@/app/asset/user.png"
import Loading from '@/app/components/Loading'

interface User {
  first_name: string;
  surname: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  ticketPurchase: number;
  totalAmount: string;
  photo: string;
}

export const UserSearch: React.FC = () => {
  const [searchVal, setSearchVal] = useState<string | undefined>();
  const [userInfo, setUserInfo] = useState<any | null>();
  const [active, setActive] = useState<number | null>(null);
  const [userToken, setUserToken] = useState(Cookies.get('token'));
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/admin_profile/`;

  const { data: userdetails, isLoading: userLoading } = useGetDatanew(
    `/api/userdetails/`,
    'get_user_details',
    userToken || ' '
  );

  useEffect(() => {
    if (userdetails) {
      /*   console.log(userdetails?.data?.data?.users, 'userdetails') */
      const usersdata: User[] = userdetails?.data?.data?.users.map((user: any) => ({
        first_name: user.first_name,
        surname: user.last_name,
        email: user.email || 'N/A',
        phone: user.phone || 'N/A',
        city: user.city || 'N/A',
        address: user.address || 'N/A',
        ticketPurchase: user.tickets || 'N/A',
        totalAmount: user.total_amount || 'N/A',
        photo: user.profile_image || user_img,
        id: user.id,
      }));
      setFilteredUsers(usersdata);
      if (usersdata.length > 0) {
        setUserInfo(usersdata[0]);
        setActive(0);
      }
    }
  }, [userdetails]);


  const searchQuery = (value: string | undefined) => {
    if (!value) {
      setFilteredUsers(userdetails?.data?.data?.users.map((user: any) => ({
        first_name: user.first_name,
        surname: user.last_name,
        email: user.email || 'N/A',
        phone: user.phone || 'N/A',
        city: user.city || 'N/A',
        address: user.address || 'N/A',
        ticketPurchase: user.tickets || 'N/A',
        totalAmount: user.total_amount || 'N/A',
        photo: user.profile_image || user_img,
        id: user.id,
      })) || []);
      return;
    }

    const filtered = userdetails?.data?.data?.users.filter((user: any) =>
      user.first_name.toLowerCase().includes(value.toLowerCase()) ||
      user.last_name.toLowerCase().includes(value.toLowerCase())
    ).map((user: any) => ({
      first_name: user.first_name,
      surname: user.last_name,
      email: user.email || 'N/A',
      phone: user.phone || 'N/A',
      city: user.city || 'N/A',
      address: user.address || 'N/A',
      ticketPurchase: user.tickets || 'N/A',
      totalAmount: user.total_amount || 'N/A',
      photo: user.profile_image || user_img,
      id: user.id,
    }));
    setFilteredUsers(filtered);
  };


  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchVal(value);
    searchQuery(value);
  };

  if (userLoading) {
    return <Loading />;
  }


  /*  { console.log(userdetails?.data?.data?.users, 'userinfo') } */

  return (
    <section className="flex flex-col lg:flex-row gap-4 my-8 h-full">
      <div className="bg-[#FCDFD433] rounded-lg">
        <p className="text-xl p-4">Users</p>
        <div className="relative p-4">
          <span className="absolute mr-6 mt-3">
            <CiSearch className="text-xl mx-2" />
          </span>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search"
            className="pl-8 py-2 focus:text-black border rounded-sm w-auto xl:w-[300px] 2xl:w-[300px] md:w-[300px] xlw-[300px] lg:w-[300px]"
            value={searchVal}
            onChange={handleSearchInputChange}
            autoComplete="off"
          />
        </div>

        <div className="relative">
          <ul>
            <li className="text-break h-[15em] overflow-y-auto pt-2">
              {/* {console.log(filteredUsers, 'filteredUsers')} */}
              {filteredUsers?.map((val: any, index: number) => (
                <div
                  key={index}
                  className={`${active === index ? 'bg-[#F6F6F6]' : ''
                    } flex gap-4 py-2 items-center cursor-pointer hover:bg-[#F6F6F6] p-4`}
                  onClick={() => {
                    setUserInfo(val);
                    setActive(index);
                  }}
                >
                  <Image
                    src={`https://staging.ajiroba.ng/v1${val.photo}`}
                    alt={val.first_name}
                    className="rounded-full w-10 h-10"
                    width={50}
                    height={50}
                  />
                  <div className="flex gap-1.5 items-center">
                    <p>{val.first_name}</p>
                    <p>{val.surname}</p>
                  </div>
                </div>
              ))}
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-[#FCDFD433] w-full rounded-lg span-2">
        <div></div>
        {userInfo && (
          <div className="p-6 flex flex-col gap-5">
            {/*     {console.log(userInfo, 'usee')} */}

            <Image src={`https://staging.ajiroba.ng/v1${userInfo.photo}`} alt={userInfo?.first_name} className="rounded-full w-20 h-20"
              width={50}
              height={50} />
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-2 items-center mt-3">
              <p>FirstName:</p>
              <p>{userInfo?.first_name}</p>
              <p>Surname:</p>
              <p>{userInfo?.surname}</p>
              <p>Email:</p>
              <p>{userInfo?.email}</p>
              <p>Phone:</p>
              <p>{userInfo?.phone}</p>
              <p>City:</p>
              <p>{userInfo?.city}</p>
              <p>Address:</p>
              <p>{userInfo?.address}</p>
              <p>Ticket Purchase:</p>
              <p className="flex gap-1 items-center">
                {userInfo?.ticketPurchase}{' '}
                <Link href={`/dashboard/ticketdetails/${userInfo?.id}`} className="text-[#F25E26] underline">
                  view{' '}
                </Link>
              </p>
              <p>Total Amount:</p>
              <p>
                ₦
                {userInfo?.totalAmount !== undefined && userInfo?.totalAmount !== null
                  ? Number(userInfo.totalAmount).toLocaleString('en-NG', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                  : '0.00'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};