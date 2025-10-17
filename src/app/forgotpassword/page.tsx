"use client";
import Link from "next/link";
import Brand from "../asset/logo.svg";
import Image from "next/image";
import React, { Suspense, lazy } from "react";
const AuthHero = lazy(() => import("../component/AuthHero"));
const HeroSubText = lazy(() => import("../component/AuthHero").then(m => ({ default: m.HeroSubText })));
const DefaultButton = lazy(() => import("../component/Button").then(m => ({ default: m.DefaultButton })));
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { HiArrowLongLeft } from "react-icons/hi2";
import { useMutateData } from "@/hooks/useMutateData";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { userOTPStore } from '@/store/store'




const ParentPage = () => {
    const router = useRouter();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<HTMLInputElement[]>([]);
    const searchParams = useSearchParams();
    const [resendEmail, setResendEmail] = useState<string>("");
    const [showEmailField, setShowEmailField] = useState<boolean>(false);
    const [manualEmail, setManualEmail] = useState<string>("");

    const { user_otp, set_user_Otp } = userOTPStore(state => ({
        user_otp: '',
        set_user_Otp: state.set_user_Otp
    }))


    const handleInputChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newOtp = [...otp];
        newOtp[index] = event.target.value.slice(0, 1);
        setOtp(newOtp);
        set_user_Otp(newOtp.join(''));

        // Automatically focus the next input field
        if (index < 5 && newOtp[index].length === 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleBackspace = (
        index: number,
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (index > 0 && event.keyCode === 8 && otp[index].length === 0) {
            inputRefs.current[index - 1].focus();
        }
    };



    const handleSuccess = (data: any) => {


        if (data.status === 200) {

            toast.success(`${data?.data?.message}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                onClose: () => router.push('/setnewpass')

            })
            setOtp(["", "", "", "", "", ""])


        } else if (data.status === 400) {
            toast.error(`${data?.data?.message}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",

            });
            setOtp(["", "", "", "", "", ""])

        } else {
            toast.error(`${'An Error Occured'}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",

            });
            setOtp(["", "", "", "", "", ""])
        }
    };

    const handleError = (error: any) => {
        toast.error(`${'An Error Occured'}`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",

        });
        setOtp(["", "", "", "", "", ""])

    };

    const { data, error, isError, isSuccess, mutate, status } = useMutateData(
        "signup",
        handleSuccess,
        handleError,
    );

    // Resend pass OTP handlers
    const handleResendSuccess = (data: any) => {
        if (data.status === 200) {
            toast.success(`${data?.data?.message || 'OTP resent successfully'}` as string, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            toast.error(`${data?.data?.message || 'An Error Occured'}` as string, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const handleResendError = () => {
        toast.error('An Error Occured', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const { mutate: resendMutate, status: resendStatus } = useMutateData(
        "resendpassotp",
        handleResendSuccess,
        handleResendError,
    );

    const handleVerify = () => {

        const Payload = {
            otp: otp?.join("")
        }

        /*     router.push('/setnewpass') */
        // console.log(Payload, 'payload')

        // console.log(user_otp, 'user-otp')
        // set_user_Otp(Payload)

        // console.log(user_otp, 'user-otp')

        mutate({
            // url: "/api/verifyaccount",
            url: "/api/verifyresetpasswordotp",
            payload: Payload
        });

    };

    const resendotp = () => {
        try {
            // Resolve email immediately without relying on async state update
            let email = (localStorage.getItem('reset_email') || '').trim();
            if (!email) {
                const emailFromParams = searchParams?.get('email') || '';
                const stored = typeof window !== 'undefined' ? localStorage.getItem('reset_email') : null;
                const normalizedStored = stored ? stored.replace(/^"|"$/g, '') : '';
                const chosen = (emailFromParams || normalizedStored).trim();
                if (chosen) {
                    email = chosen;
                    setResendEmail(chosen); // set for subsequent clicks
                }
            }

            if (!email) {
                setShowEmailField(true);
                toast.info('Enter your email to resend OTP.', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }

            resendMutate({
                url: "/api/resendpassotp",
                payload: { email }
            });
        } catch (e) {
            toast.error('An Error Occured', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }

    };

    const submitManualEmail = () => {
        const email = manualEmail.trim();
        if (!email) {
            toast.error('Please enter a valid email.', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        setResendEmail(email);
        resendMutate({ url: "/api/resendpassotp", payload: { email } });
    };

    return (
        <>
            <Suspense fallback={<div className="px-8 py-10 text-sm text-gray-500">Loading...</div>}>
            <div className="px-8">
            {/*     <ToastContainer closeOnClick /> */}
                <nav className="Brand-logo  p-6 lg:px-14 px-7 lg:block xl:block 2xl:block md:block   flex justify-center ">
                    <Link href={"/"}>
                        <Image src={Brand} alt="brand-logo" />
                    </Link>
                </nav>


                   <div className="flex justify-center items-center flex-col min-h-[85vh]">


  {/*  <AuthHero
                    title="OTP Verification"
                    menu="Please provide the 6-digit security code sents to your e-mail address"
                /> */}

                  <HeroSubText
             title="OTP Verification"
                    menu="Please provide the 6-digit security code sents to your e-mail address"
          />

                <div className=" flex justify-center mb-20 mt-12 ">
                    <div className="flex flex-col ">
                        <div className="flex  space-x-2 gap-4 items-center justify-center flex-wrap">
                            {otp.map((value, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={value}
                                    className=" shadow border w-12 border-gray-300 px-2 h-10 rounded-md mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => handleInputChange(index, e)}
                                    onKeyDown={(e) => handleBackspace(index, e)}
                                    ref={(el) => {
                                        if (el) {
                                            inputRefs.current[index] = el;
                                        }
                                    }}
                                />
                            ))}
                        </div>

                        <div className="flex justify-center items-center mt-12">
                            <Suspense fallback={<div className="w-full py-2 text-center text-sm text-gray-500">Loading...</div>}>
                                <DefaultButton
                                    type="submit"
                                    className=" rounded-lg w-4/5 bg-[#FCDFD4] h-10 text-sm hover:bg-[#E84526] hover:text-white"
                                    text={status === 'pending' ? 'loading...' : 'Verify'}
                                    handleClick={() => handleVerify()}
                                />
                            </Suspense>
                        </div>

                        <div className="flex justify-center items-center mt-4">
                            <nav className="flex gap-2">
                                <small className="text-base">Didn’t get email?</small>
                                <small className="text-base">
                                    <button onClick={() => resendotp()} className="text-[#F25E26] text-sm">
                                        Click to resend
                                    </button>
                                </small>
                            </nav>
                        </div>

                        {showEmailField && (
                            <div className="flex justify-center items-center mt-4">
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={manualEmail}
                                        onChange={(e) => setManualEmail(e.target.value)}
                                        className=" shadow border border-gray-300 px-3 h-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <Suspense fallback={<div className="py-2 px-4 text-sm text-gray-500">Loading...</div>}>
                                        <DefaultButton
                                            type="button"
                                            className=" rounded-lg bg-[#FCDFD4] h-10 text-sm  hover:bg-[#E84526] hover:text-white"
                                            text={resendStatus === 'pending' ? 'Sending...' : 'Send'}
                                            handleClick={submitManualEmail}
                                        />
                                    </Suspense>
                                </div>
                            </div>
                        )}


                        <div className="flex cursor-pointer justify-center items-center mt-4">
                            <nav onClick={() => router.back()} className="flex items-center gap-2">
                                <HiArrowLongLeft />
                                <small className="text-base">
                                    Back
                                </small>
                            </nav>
                        </div>
                    </div>
                </div>

                   </div>


            </div>
            </Suspense>
        </>
    );
}



export default function Page() {

  
    return (
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      }>
        <ParentPage />
      </Suspense>
    );
  }