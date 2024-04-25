'use client'
import {useState} from 'react'
import { CiSearch } from 'react-icons/ci'
import {users} from "@/app/data"
import Image from "next/image"

interface UserSearchProps {
    object?:any
    // Define props here if needed
}

export const UserSearch: React.FC<UserSearchProps> = () => {
    const [searchval, setSearchVal] = useState<string | undefined>();
    const [filteredUsers, setFilteredUsers] = useState<any[]>(users);
    const [userInfo, setUserInfo] = useState<any[]>(null);
    const [active, setActive]=useState<number>()

    
    const searchQuery = (value: string | undefined) => {
        if (!value) {
            // If search value is empty, set filtered users to the entire user list
            setFilteredUsers(users);
            return;
        }

        // Filter users based on first name or surname containing the search value
        const filtered = users.filter(user =>
            user.first_name.toLowerCase().includes(value.toLowerCase()) ||
            user.surname.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchVal(value);
        searchQuery(value);
    };


    return (
        <section className="flex flex-col lg:flex-row gap-4 my-6 h-full lg:justify-start justify-center">
            <div className="bg-[#FCDFD433] lg:w-[22rem] rounded-lg">
                <p className="text-xl p-2 ">User</p>
                <div className="relative p-4">
                <span className="absolute mr-6 mt-3">
                    <CiSearch className="text-xl mx-2"/>
                </span>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search"
                        className=" pl-8 py-2 focus:text-black border rounded-sm w-auto xl:w-[300px] 2xl:w-[300px] md:w-[300px] xlw-[300px] lg:w-[300px]"
                        value={searchval}
                        onChange={handleSearchInputChange}
                        autoComplete="off"
                    />
                </div>

                <div className="relative">
                    <ul>
                        <li className="text-break h-[15em] overflow-y-auto pt-2">
                            {filteredUsers?.map((val:any, index:number)=>(
                                <div key={index} className={`${active===index ? "bg-gray-300":""} flex gap-4 py-2 items-center cursor-pointer hover:bg-gray-300 p-4`} onClick={()=>{setUserInfo(val); setActive(index)}}>
                                    <Image src={val.photo} alt={val.first_name} className="h-auto w-[15%]" />
                                    <p>{val.first_name}</p>
                                    <p>{val.surname}</p>
                                </div>
                            ))}
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-[#FCDFD433] w-full flex-auto  rounded-lg">
                <div></div>
                {userInfo && (<div className="p-6 flex flex-col gap-5">
                    <Image src={userInfo?.photo} alt={userInfo?.first_name}/>
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1  gap-5 items-center mt-3">
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
                        <p>{userInfo?.ticketPurchase}</p>
                        <p>Total Amount:</p>
                        <p>₦{userInfo?.totalAmount}</p>
                    </div>

                </div>)}

            </div>
        </section>
    );
};
