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
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string | null>(null);

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

  const onSubmit = async (data: ChatFormValues) => {
    // console.log("Form submitted with data:", data);
    
    if (!data.text.trim() || !userInfo?.id) {
      // console.log("No text or user selected");
      return;
    }

    try {
      const headers = {
        Authorization: `token ${userToken}`,
        "Content-Type": "application/json",
      };

      

            const payload = {
        text: data.text.trim(),
        image: data.image || "",
        chatroom_id: currentChatRoomId,
      };

      // console.log("Sending message with payload:", payload);

      const response = await axios.post(
        "https://staging.ajiroba.ng/v1/admin/send_message/",
        payload,
        { headers }
      );

      console.log(response, 'response')

      if (response.data.status === "success") {
        const newMessage: Message = {
          type: "admin",
          text: data.text.trim(),
        };
        setMessages((prev) => [...prev, newMessage]);
        // console.log("Message sent successfully:", response.data);
        reset();
        
        toast.success("Message sent successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        
        // Refetch customer details to get updated data
        refetch();
      } else if (response.data.status === "failed") {

        console.log(response, 'response?.data?.message')
        toast.error(response?.data?.message || "Failed to send message", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      }
    } catch (error) {
      // console.error("Error sending message:", error);
      toast.error(    "Failed to send message", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    const currentText = getValues("text") || "";
    setValue("text", currentText + emojiObject.emoji);
  };

  const { data: customerdetails, isLoading: customerLoading, refetch } = useGetDatanew(
    `/api/chatroomdetails/`,
    "get_chatroom_details",
    userToken || " "
  );

  const ChatData = useCallback(
    async (chatroom_id: string) => {
      try {
        setMessages([]);
        setCurrentChatRoomId(chatroom_id);
        const headers = {
          Authorization: `token ${userToken}`,
        };

        const response = await axios.get(
          `https://staging.ajiroba.ng/v1/admin/chatroom_messages/?chatroom_id=${chatroom_id}`,
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
        } else {
          // If no messages from API, show sample messages for demo
          setMessages([
            {
              type: "client",
              text: "Good afternoon, I need help",
            },
            {
              type: "admin",
              text: "How may we help you?",
            },
          ]);
        }

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
      } catch (error) {
        if (error instanceof AxiosError) {
          // console.error("Error sending message:", error);
          // Show sample messages if API fails
          setMessages([
            {
              type: "client",
              text: "Good afternoon, I need help",
            },
            {
              type: "admin",
              text: "How may we help you?",
            },
          ]);
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

      // console.log(customerdetails, 'customerdetails')

      const usersdata: User[] = customerdetails?.data?.results?.map(
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
  }, [customerdetails, userToken]);

  const searchQuery = (value: string | undefined) => {
  /*   console.log("Search query called with:", value);
    console.log("Available users:", customerdetails?.data?.data); */

    if (!value) {
      const allUsers =
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
        })) || [];
      // console.log("Setting all users:", allUsers);
      setFilteredUsers(allUsers);
      return;
    }

    const filtered = customerdetails?.data?.data
      ?.filter((item: any) => {
        const fullName = item.customer.full_name || "";
        return fullName.toLowerCase().includes(value.toLowerCase());
      })
      .map((item: any) => ({
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
    // console.log("Filtered users:", filtered);
    setFilteredUsers(filtered);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    // console.log("Search input changed:", value);
    setSearchVal(value);
    searchQuery(value);
  };

  if (customerLoading) {
    return <Loading />;
  }

  // console.log("Current state:", {
  //   searchVal,
  //   filteredUsers: filteredUsers?.length,
  //   userInfo,
  //   messages: messages?.length,
  //   customerdetails: customerdetails?.data?.data?.length,
  // });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
    {/*   <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Live Chat
        </h1>
      </div> */}

      {/* Main Chat Interface */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Messages List */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          {/* Messages Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search here..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchVal}
                onChange={handleSearchInputChange}
              />
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            {filteredUsers?.length > 0 ? (
              filteredUsers.map((val: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    active === index ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    // console.log("User clicked:", val);
                    setUserInfo(val);
                    setActive(index);
                    ChatData(val.id);
                  }}
                >
                  <Image
                    src={val.photo}
                    alt={val.first_name}
                    className="rounded-full w-12 h-12 object-cover"
                    width={48}
                    height={48}
                  />
                  <div className="flex-1 ml-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {val.first_name} {val.surname}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          You: How may we help...
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">3:17 PM</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                {customerLoading ? "Loading users..." : "No users found"}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Active Chat */}
        <div className="flex-1 bg-white flex flex-col">
          {/* Chat Header */}
          {userInfo && (
            <div className="p-4 border-b border-gray-200 flex items-center">
              <Image
                src={userInfo.photo}
                alt={userInfo.first_name}
                className="rounded-full w-10 h-10 object-cover"
                width={40}
                height={40}
              />
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900">
                  {userInfo.first_name} {userInfo.surname}
                </h3>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "client" ? "justify-start" : "justify-end"
                  }`}
                >
                  {message.type === "client" && (
                    <div className="flex items-end space-x-2">
                      <Image
                        src={userInfo?.photo || user_img}
                        alt="User"
                        className="rounded-full w-8 h-8 object-cover"
                        width={32}
                        height={32}
                      />
                      <div className="bg-white text-gray-900 px-5 py-3 rounded-2xl max-w-xs lg:max-w-md shadow-md relative">
                        {message.text}
                        <div className="absolute -bottom-1 left-4 w-3 h-3 bg-white shadow-md transform rotate-45"></div>
                      </div>
                    </div>
                  )}
                  {message.type === "admin" && (
                    <div className="bg-white text-gray-900 px-5 py-3 rounded-2xl max-w-xs lg:max-w-md shadow-md relative">
                      {message.text}
                      <div className="absolute -bottom-1 right-4 w-3 h-3 bg-white shadow-md transform rotate-45"></div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {userInfo
                  ? "No messages yet. Start a conversation!"
                  : "Select a user to start chatting"}
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              {/* Emoji Button */}
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              {/* Image Upload Button */}
              <label className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setSelectedImage(e.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              {/* Message Input */}
              <input
                type="text"
                placeholder="Send a message"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                {...register("text")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const formData = getValues();
                    if (formData.text.trim()) {
                      onSubmit(formData);
                    }
                  }
                }}
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={() => {
                  const formData = getValues();
                  if (formData.text.trim()) {
                    onSubmit(formData);
                  }
                }}
                className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>

            {/* Error Message */}
            {errors.text && (
              <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-20 left-4">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
