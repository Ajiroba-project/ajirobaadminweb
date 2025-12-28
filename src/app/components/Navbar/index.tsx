'use client'

import React, { useCallback, useEffect, useRef, useState } from "react";
// import ToggleBtn from "../ToggleBtn";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
// import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Header } from "../Header";
import { HeaderNavMenu } from "@/app/data";
import { GoBell } from "react-icons/go";
import { FiMenu } from "react-icons/fi";
import Cookies from "js-cookie";
import { useGetDatanew } from "@/hooks/useGetData";
import { IoClose } from "react-icons/io5";

interface NavbarProps {
  toggleSidebar: () => void;
  navtitle?: string;
}

type headerTitleProps = {
    title:string,
    subtitle?:string,
    className?:any,

}
type activeProps = number | null;

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, navtitle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
//   const { logout } = useAuth();

//   const  toggleNavbar  = useStore(state => state.toggleNavbar );
//   const isNavbarOpen = useStore(state=> state.isNavbarOpen)
  const [active, setActive] = useState <activeProps>(null)

  // Notification state
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [expandedNotifications, setExpandedNotifications] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [loadingNotifications, setLoadingNotifications] = useState<Record<string, boolean>>({});
  const [notificationMessages, setNotificationMessages] = useState<Record<string, { type: 'success' | 'error'; message: string }>>({});

  const token = Cookies.get("token") as string | undefined;
  const notificationsUrl = token ? `${process.env.NEXT_PUBLIC_BASE_URL}/user/notifications/` : "";
  const { data: notificationsData, isLoading: notificationsLoading, refetch: refetchNotifications } = useGetDatanew(
    notificationsUrl,
    "get_notifications",
    token || "",
    { cacheTime: 0, staleTime: 0, enabled: !!token }
  );

  useEffect(() => {
    if (!token) {
      setNotifications([]);
      setNotificationCount(0);
      return;
    }
    if (notificationsData?.data && Array.isArray(notificationsData.data)) {
      const transformed = notificationsData.data.map((n: any, idx: number) => ({
        ...n,
        id: n.id || idx + 1,
        read: !!n.read,
        url: n.url || "/profile",
      }));
      setNotifications(transformed);
      setNotificationCount(transformed.filter((n: any) => !n.read).length);
      setNotificationError(null);
    } else if (notificationsData?.status === "failed") {
      setNotificationError(notificationsData.message || "Unable to load notifications");
      setNotifications([]);
      setNotificationCount(0);
    }
  }, [notificationsData, token]);

  useEffect(() => {
    if (!token) return;
    const id = setInterval(() => refetchNotifications(), 30000);
    return () => clearInterval(id);
  }, [token, refetchNotifications]);

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
    setExpandedNotifications([]);
    setLoadingNotifications({});
    setNotificationMessages({});
  };

  const toggleNotification = async (index: number) => {
    const notification = notifications[index];
    const notificationId = notification?.id?.toString();
    setExpandedNotifications(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    if (notification && !notification.read && notificationId) {
      setLoadingNotifications(prev => ({ ...prev, [notificationId]: true }));
      setNotificationMessages(prev => { const u = { ...prev }; delete u[notificationId]; return u; });
      const result = await markNotificationAsRead(notificationId);
      setLoadingNotifications(prev => { const u = { ...prev }; delete u[notificationId]; return u; });
      if (result.success) {
        setNotificationMessages(prev => ({ ...prev, [notificationId]: { type: 'success', message: result.message || 'Marked as read' } }));
        setTimeout(() => {
          setNotificationMessages(prev => { const u = { ...prev }; delete u[notificationId]; return u; });
        }, 2000);
      } else {
        setNotificationMessages(prev => ({ ...prev, [notificationId]: { type: 'error', message: result.message || 'Failed to mark as read' } }));
        setTimeout(() => {
          setNotificationMessages(prev => { const u = { ...prev }; delete u[notificationId]; return u; });
        }, 3000);
      }
    }
  };

  const markNotificationAsRead = async (notificationId: string): Promise<{ success: boolean; message?: string }> => {
    try {
      if (!token) return { success: false, message: 'No authentication token' };
      const res = await fetch(`/api/read_notification/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          refetchNotifications();
          return { success: true, message: 'Notification marked as read' };
        }
        return { success: false, message: data.message || 'Failed to mark notification as read' };
      }
      const errorData = await res.json().catch(() => ({}));
      return { success: false, message: errorData.message || 'Failed to mark notification as read' };
    } catch {
      return { success: false, message: 'An error occurred. Please try again.' };
    }
  };

  return (
    <>
    <header className="h-16 lg:h-20 flex justify-between items-center px-4 lg:px-6 bg-[#F6F6F6] shadow-lg z-30 border rounded-none w-full">

      <Link href="" className="text-sm lg:text-base font-bold text-[#30313D] txtNormal truncate">

        {navtitle}
      </Link>
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <ul className="flex gap-4 lg:gap-6 justify-evenly">
        {HeaderNavMenu.map((val, index)=>(
          <li className="text-[#A09F9F] font-Poppins " key={index} onClick={() => setActive(index)}>
            <Link href={val.path} className={`text-sm lg:text-base transition-colors duration-200 ${active === index? "text-[#F25E26]": "hover:text-[#E84526]"}`}>
              {val.name}
            </Link>
          </li>
        ))}

      </ul>
        </div>

      <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">

         <div className="relative mx-4 lg:mx-6">
        <button
          onClick={() => token && setShowNotificationModal(true)}
          className="relative"
          aria-label={`Notifications (${notificationCount} unread)`}
        >
          <GoBell className="text-lg lg:text-xl cursor-pointer hover:text-[#F25E26] transition-colors duration-200"/>
          {token && notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#F25E26] text-white text-[10px] rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>
        <span className="absolute"></span>

      </div>


      </nav>

      <button
        onClick={toggleSidebar}
        className="md:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-[#F25E26] focus:outline-none focus:ring-2 focus:ring-[#F25E26] rounded-lg transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        <FiMenu className="text-xl" />
      </button>
    </header>
    {/* Notification Modal */}
    {showNotificationModal && (
      <div className="fixed inset-0 z-50 flex">
        <div className="flex-1 bg-black bg-opacity-30" onClick={closeNotificationModal}></div>
        <div
          className="w-full max-w-md bg-white shadow-2xl h-full overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-[#2A2A2A] font-Poppins w-full text-center">Notification</h3>
            <button onClick={closeNotificationModal} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Close notifications">
              <IoClose className="text-xl text-[#A09F9F]" />
            </button>
          </div>
          <div className="h-full overflow-y-auto">
            {notificationsLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F25E26]"></div>
              </div>
            ) : notificationError ? (
              <div className="text-center py-10 px-6">
                <p className="text-gray-600 font-Poppins mb-2">{notificationError}</p>
                <button onClick={() => refetchNotifications()} className="px-4 py-2 bg-[#F25E26] text-white rounded-md hover:bg-[#E54D26] transition-colors duration-200">
                  Try Again
                </button>
              </div>
            ) : notifications.length > 0 ? (
              <div className="p-4 space-y-3">
                {notifications.map((n: any, idx: number) => (
                  <div key={n.id} className={`border border-gray-200 rounded-lg bg-[#F6F6F6CC] shadow-sm`}>
                    <button
                      onClick={() => toggleNotification(idx)}
                      className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-t-lg"
                      disabled={loadingNotifications[n.id?.toString() || '']}
                    >
                      <div>
                        <h4 className={`font-Poppins text-sm ${!n.read ? 'font-semibold text-[#2A2A2A]' : 'font-medium text-[#504D4D]'}`}>
                          {n.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {n.date_created ? new Date(n.date_created).toLocaleString() : ''}
                        </p>
                      </div>
                      <IoIosArrowDown className={`text-sm text-[#A09F9F] transition-transform duration-200 ${expandedNotifications.includes(idx) ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedNotifications.includes(idx) && (
                      <div className="px-3 pb-3 border-t border-gray-100">
                        {loadingNotifications[n.id?.toString() || ''] && (
                          <div className="flex items-center gap-2 mt-2 mb-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#F25E26]"></div>
                            <p className="text-xs text-gray-500 font-Poppins">Marking as read...</p>
                          </div>
                        )}
                        {notificationMessages[n.id?.toString() || ''] && !loadingNotifications[n.id?.toString() || ''] && (
                          <div className={`mt-2 mb-2 px-3 py-2 rounded-md text-xs font-Poppins ${
                            notificationMessages[n.id?.toString() || '']?.type === 'success'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {notificationMessages[n.id?.toString() || '']?.message}
                          </div>
                        )}
                        <p className="text-sm text-[#504D4D] font-Poppins leading-relaxed mt-2">{n.message}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <GoBell className="text-3xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-Poppins">No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Navbar;
