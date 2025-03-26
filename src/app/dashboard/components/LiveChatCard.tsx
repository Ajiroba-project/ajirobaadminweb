"use client";
import { useCallback, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { users } from "@/app/data";
import Image from "next/image";
import Link from "next/link";
import { useGetDatanew } from "@/hooks/useGetData";
import Cookies from "js-cookie";
import user_img from "@/app/asset/user.png";
import Loading from "@/app/components/Loading";
import "./style.css";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios, { AxiosError } from "axios";

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

type ChatFormValues = {
  text: string;
  image?: string;
};

interface Message {
  type: "client" | "admin";
  text: string;
  image?: string;
}

export const LiveChatCard: React.FC = () => {
  const [searchVal, setSearchVal] = useState<string | undefined>();
  const [userInfo, setUserInfo] = useState<any | null>();
  const [active, setActive] = useState<number | null>(null);
  const [userToken, setUserToken] = useState(Cookies.get("token"));
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const chatSchema = yup.object().shape({
    text: yup.string().required("text is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
    reset,
  } = useForm<ChatFormValues>({
    resolver: yupResolver(chatSchema),
  });

  const onEmojiClick = (emojiObject: any) => {
    const currentText = getValues("text") || "";
    setValue("text", currentText + emojiObject.emoji);
  };

  const { data: customerdetails, isLoading: customerLoading } = useGetDatanew(
    `/api/chatroomdetails/`,
    "get_chatroom_details",
    userToken || " "
  );

const ChatData = useCallback(
  async (chatroom_id: string) => {
    try {
      setMessages([]);
      const headers = {
        Authorization: `token ${userToken}`,
      };

      const response = await axios.get(
        `https://ajiroba.onrender.com/v1/admin/chat_messages/?chatroom_id=${chatroom_id}`,
        { headers }
      );

      if (response.data.status === "success") {
        const NewMessage: Message[] = response.data.data.map(
          (item: { text: any; image: any; sender_role: any }) => {
            return {
              type: item.sender_role === "client" ? "client" : "admin",
              text: item.text,
              image: item.sender_role?.profile_image,
            };
          }
        );

        setMessages([...NewMessage]);

        toast.success(`${response.data.message || "Success"}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        reset();
      } else {
        alert("Failed to send message: " + response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error sending message:", error);
        toast.error(
          `${error.response?.data?.message || "An Error Occurred"}`,
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  },
  [userToken, reset]
);


  useEffect(() => {
    if (customerdetails) {
      const usersdata: User[] = customerdetails?.data?.data?.map(
        (item: any) => ({
          first_name: item.customer.full_name.split(" ")[0] || "N/A",
          surname: item.customer.full_name.split(" ")[1] || "N/A",
          email: "N/A",
          phone: "N/A",
          city: "N/A",
          address: "N/A",
          ticketPurchase: "N/A",
          totalAmount: "N/A",
          photo: item.customer.profile_image || user_img,
          id: item.id,
        })
      );

      setFilteredUsers(usersdata);

    }
  }, [customerdetails, userToken, ]);

  const searchQuery = (value: string | undefined) => {
    if (!value) {
      setFilteredUsers(
        customerdetails?.data?.data?.map((item: any) => ({
          first_name: item.customer.full_name.split(" ")[0] || "N/A",
          surname: item.customer.full_name.split(" ")[1] || "N/A",
          email: "N/A",
          phone: "N/A",
          city: "N/A",
          address: "N/A",
          ticketPurchase: "N/A",
          totalAmount: "N/A",
          photo: item.customer.profile_image || user_img,
          id: item.id,
        })) || []
      );
      return;
    }

    const filtered = customerdetails?.data?.data?.map((item: any) => ({
      first_name: item.customer.full_name.split(" ")[0] || "N/A",
      surname: item.customer.full_name.split(" ")[1] || "N/A",
      email: "N/A",
      phone: "N/A",
      city: "N/A",
      address: "N/A",
      ticketPurchase: "N/A",
      totalAmount: "N/A",
      photo: item.customer.profile_image || user_img,
      id: item.id,
    }));
    setFilteredUsers(filtered);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setSearchVal(value);
    searchQuery(value);
  };

  if (customerLoading) {
    return <Loading />
  }

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
                  className={`${
                    active === index ? "bg-[#F6F6F6]" : ""
                  } flex gap-4 py-2 items-center cursor-pointer hover:bg-[#F6F6F6] p-4`}
                  onClick={() => {
                    setUserInfo(val);
                    setActive(index);

                    ChatData(val.id)
                  }}>
                  <Image
                    src={val.photo}
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

        <div
          className="md:w-1/2 w-full flex justify-center"
          style={{
            height: " min-content",
            overflow: "scroll",
            overflowY: "scroll",
            overflowX: "scroll",
          }}>
          <div className="  flex justify-center items-center ">
            <div
              className="bg-white shadow-md rounded-lg w-full max-w-lg"
              style={{
                height: "80vh",
              }}>
              <div className="px-2 py-4 bg-[#fef9f6]">
                <div className="p-6 space-y-4  ">
                  <div className="flex justify-between  items-center 2xl:gap-40 lg:gap-10 md:gap-10 gap-6  xl:gap-4  border shadow-lg rounded-lg border-[#FCFCFC] p-4  ">
                    <div className="flex flex-wrap gap-4  items-center space-x-2">
                      <div className="avatar">
                        <div className="ring-primary ring-offset-base-100 w-8 rounded-full ring ring-offset-2">
                          <Image
                            src={userInfo?.photo}
                            alt={userInfo?.first_name}
                            className=" rounded-lg mt-1"
                            width={40}
                            height={40}
                          />
                        </div>
                      </div>
                      <h2 className="font-semibold text-gray-800 text-sm">
                        {userInfo?.first_name || userInfo?.first_name}
                      </h2>
                    </div>

                    <div>
                     {/*  <button
                        onClick={() => console.log("end chat")}
                        className="bg-[#EF5E4A] text-white text-sm px-4 py-2 rounded-lg hover:bg-red-500">
                        End Chat
                      </button> */}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`chat ${
                          message.type === "admin" ? "chat-start" : "chat-end"
                        } mb-4 `}>
                        {message.type === "admin" && (
                          <div className="chat-image avatar mt-8">
                            <div className="w-10 rounded-full">
                              <Image
                                alt="Admin Avatar"
                                src={
                                  message?.image
                                    ? `https://ajiroba.onrender.com${message?.image}`
                                    : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                }
                                width={24}
                                height={24}
                              />
                            </div>
                          </div>
                        )}
                        <div
                          className={`bubble ${
                            message.type === "admin"
                              ? "bubble-bottom-left"
                              : "bubbleright bubbleright-bottom-right"
                          } mb-12 `}>
                          {message.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form>
                    <div
                      className="flex flex-col"
                      style={{
                        marginTop: "3rem",
                      }}>
                      {selectedImage && (
                        <div className="mb-2 flex justify-end">
                          <Image
                            alt="selected Image"
                            src={selectedImage}
                            className="w-24 h-24 object-cover rounded-md border"
                            width={24}
                            height={24}
                          />
                        </div>
                      )}

                      <div className="flex items-center border-t border-gray-300 p-3 bg-white sm:space-x-2 space-x-1">
                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 15v2m0 4h.01M4 12h16M4 6h16m-6 12h6m-6-6h6"
                            />
                          </svg>
                        </button>

                        <label
                          htmlFor="image-upload"
                          className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 12v6m0 0v2m6-6v6m0 0h-6"
                            />
                          </svg>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/* "
                            className="hidden"
                          />
                        </label>

                        <input
                          type="text"
                          placeholder="Send a message"
                          className="flex-1 mx-3 px-4 py-2 border rounded-full text-gray-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />

                        <button
                          className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 focus:outline-none"
                          type="submit">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M20 12H4m8 0l6 6m-6-6l6-6"
                            />
                          </svg>
                        </button>
                      </div>

                      <small className="text-[#F56630] text-sm items-center flex justify-center">
                        {"errors.text.message"}
                      </small>

                      {showEmojiPicker && (
                        <div className="">
                          <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
