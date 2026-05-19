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
import { formatCurrency } from '@/utils/formatCurrency'
import ModalComponent from '@/app/components/ModalComponent'
import { toast } from 'react-toastify'

interface User {
  id?: number;
  first_name: string;
  surname: string;
  date_of_birth: string;
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
  const [resetPinModalOpen, setResetPinModalOpen] = useState(false);
  const [resetPinLoading, setResetPinLoading] = useState(false);

 /*  console.log(filteredUsers, 'filteredUsers') */

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/admin_profile/`;

  const { data: userdetails, isLoading: userLoading } = useGetDatanew(
    `/api/userdetails/`,
    'get_user_details',
    userToken || ' '
  );

  useEffect(() => {
    if (userdetails) {

      //  console.log(userdetails?.data?.data?.users, 'userdetails') 

      const usersdata: User[] = userdetails?.data?.data?.users.map((user: any) => ({
        first_name: user.first_name,
        surname: user.last_name,
        email: user.email || 'N/A',
        phone: user.phone || 'N/A',
        city: user.city || 'N/A',
        address: user.address || 'N/A',
        ticketPurchase: user.tickets || 'N/A',
        totalAmount: formatCurrency(user.total_amount) || 'N/A',
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

  useEffect(() => {
    setResetPinModalOpen(false);
  }, [userInfo?.id]);

  const searchQuery = (value: string | undefined) => {
    if (!value) {
      setFilteredUsers(userdetails?.data?.data?.users.map((user: any) => ({
        first_name: user.first_name,
        surname: user.last_name,
        date_of_birth: user.date_of_birth,
        email: user.email || 'N/A',
        phone: user.phone || 'N/A',
        city: user.city || 'N/A',
        address: user.address || 'N/A',
        ticketPurchase: user.tickets || 'N/A',
        totalAmount: formatCurrency(user.total_amount) || 'N/A',
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
      date_of_birth: user.date_of_birth,
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


  // console.log(filteredUsers, 'filtered')


  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchVal(value);
    searchQuery(value);
  };

  const handleConfirmResetPin = async () => {
    const email = userInfo?.email;
    if (!email || email === 'N/A') {
      toast.error('No valid email for this user.');
      return;
    }
    const token = Cookies.get('token');
    if (!token) {
      toast.error('You must be signed in to reset a user pin.');
      return;
    }

    setResetPinLoading(true);
    try {
      const res = await fetch('/api/request-pin-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      let json: { data?: { status?: string; message?: string; detail?: unknown }; error?: string };
      try {
        json = await res.json();
      } catch {
        toast.error('Invalid response from server.');
        return;
      }
      const payload = json.data;

      if (res.ok && payload?.status === 'success') {
        toast.success(payload?.message || 'Reset link sent');
        setResetPinModalOpen(false);
        return;
      }

      const errMsg =
        payload?.message ||
        payload?.detail ||
        json?.error ||
        'Could not send reset email.';
      toast.error(typeof errMsg === 'string' ? errMsg : 'Request failed');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setResetPinLoading(false);
    }
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
              {filteredUsers?.map((val: any, index: number) => (
                <div
                  key={index}
                  className={`${active === index ? 'bg-[#D9D9D9]' : ''
                    } flex gap-4 py-2 items-center cursor-pointer hover:bg-[#F6F6F6] p-4`}
                  onClick={() => {
                    setUserInfo(val);
                    setActive(index);
                  }}
                >
                  <Image
                    src={val.photo && typeof val.photo === 'string' && val.photo.includes('/media/users/') ? `${process.env.NEXT_PUBLIC_BASE_URL_IMG || ''}${val.photo}` : user_img}
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
        {userInfo && (
          <div className="p-6 flex flex-col gap-5">
            <div className="flex justify-end w-full">
              <button
                type="button"
                onClick={() => setResetPinModalOpen(true)}
                className="text-sm font-Poppins font-medium rounded-lg py-2 px-4 bg-[#FCDFD4] text-[#222] hover:bg-[#F25E26] hover:text-white transition-all duration-200 focus:outline-none"
              >
                Reset pin
              </button>
            </div>

            <Image src={userInfo.photo && typeof userInfo.photo === 'string' && userInfo.photo.includes('/media/users/') ? `${process.env.NEXT_PUBLIC_BASE_URL_IMG || ''}${userInfo.photo}` : user_img} alt={userInfo?.first_name} className="rounded-full w-20 h-20"
              width={50}
              height={50} />
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-2 items-center mt-3">
              <p>FirstName:</p>
              <p>{userInfo?.first_name}</p>
              <p>Surname:</p>
              <p>{userInfo?.surname}</p>
              <p>Date of Birth:</p>
              <p>{userInfo?.date_of_birth || 'N/A'}</p>
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
                {userInfo?.totalAmount}
               {/*  ₦
                {userInfo?.totalAmount !== undefined && userInfo?.totalAmount !== null
                  ? Number(userInfo.totalAmount).toLocaleString('en-NG', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                  : '0.00'} */}
              </p>
            </div>
          </div>
        )}

        <ModalComponent
          isModalOpen={resetPinModalOpen}
          handleCancel={() => setResetPinModalOpen(false)}
          handleOk={() => setResetPinModalOpen(false)}
          content={
            <div className="flex flex-col items-center justify-center p-6">
              <h2 className="text-xl font-Poppins font-bold text-black mb-3 text-center">
                Reset pin?
              </h2>
              <p className="text-center text-sm font-Poppins text-[#353131] mb-8 leading-6 max-w-md">
                This will initiate the pin reset for this user. A mail will be sent to this user to reset pin
              </p>
              <div className="flex w-full justify-center">
                <button
                  type="button"
                  disabled={resetPinLoading}
                  className={`w-full max-w-[280px] font-Poppins font-medium rounded-lg py-3 px-6 transition-colors duration-200 focus:outline-none ${
                    resetPinLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#FCDFD4] text-[#222] hover:bg-[#F25E26] hover:text-white'
                  }`}
                  onClick={handleConfirmResetPin}
                >
                  {resetPinLoading ? 'Sending…' : 'Confirm'}
                </button>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
};