"use client";
import Link from "next/link";
import Brand from "../asset/logo.svg";
import Image from "next/image";
import { Suspense, lazy, useRef, useState, useEffect } from "react";
const AuthHero = lazy(() => import("../component/AuthHero"));
const DefaultButton = lazy(() => import("../component/Button").then(m => ({ default: m.DefaultButton })));
import { useRouter, useSearchParams } from "next/navigation";
import { HiArrowLongLeft } from "react-icons/hi2";
import { useMutateData } from "@/hooks/useMutateData";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

function Page() {



    const schema = yup.object().shape({
        otp: yup
            .array()
            .of(yup.string().length(1, "OTP must be exactly 1 character").matches(/\d/, "OTP must be a digit"))
            .required("All OTP fields are required"),
    });

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            otp: ["", "", "", "", "", ""]
        }
    });


    const router = useRouter();
    const searchParams = useSearchParams();
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
    const [resendEmail, setResendEmail] = useState<string>("");
    const [showEmailField, setShowEmailField] = useState<boolean>(false);
    const [manualEmail, setManualEmail] = useState<string>("");

    useEffect(() => {
        // Focus the first input field when component mounts
        inputRefs.current[0]?.focus();
        // Initialize resend email from query param or localStorage
        try {
            const emailFromParams = searchParams?.get('email') || '';
            const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('signup_email') : null;
            const normalizedStored = storedEmail ? storedEmail.replace(/^"|"$/g, '') : '';
            const chosen = emailFromParams || normalizedStored;
            if (chosen) {
                setResendEmail(chosen);
            }
        } catch (e) {
            // ignore storage errors
        }
    }, [searchParams]);

    const handleInputChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const input = event.target.value;
        
        // Only allow numbers (0-9)
        const numericValue = input.replace(/[^0-9]/g, '');
        
        // Take only the first character if multiple characters are entered
        const value = numericValue.slice(0, 1);
        
        // Update the form value
        setValue(`otp.${index}`, value);
        
        // Update the input field value to show only the numeric character
        event.target.value = value;

        // Move to next input if a valid number is entered
        if (index < 5 && value.length === 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (
        index: number,
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        const isNumber = /^[0-9]$/.test(event.key);
        const isAllowedKey = allowedKeys.includes(event.key);

        if (!isNumber && !isAllowedKey) {
            event.preventDefault();
            return;
        }

        if (index > 0 && event.key === 'Backspace' && !event.currentTarget.value) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    

    // Handle pasting a full OTP into any field
    const handlePaste = (
        startIndex: number,
        event: React.ClipboardEvent<HTMLInputElement>,
    ) => {
        const pasted = event.clipboardData.getData('text');
        const digits = (pasted || '').replace(/\D/g, '').split('');
        // If only one digit, let default behavior handle it
        if (digits.length <= 1) return;

        event.preventDefault();
        const maxLen = 6 - startIndex;
        const slice = digits.slice(0, maxLen);

        slice.forEach((d, offset) => {
            const idx = startIndex + offset;
            setValue(`otp.${idx}`, d);
            const input = inputRefs.current[idx];
            if (input) input.value = d;
        });

        const lastIdx = startIndex + slice.length - 1;
        if (lastIdx < 5) {
            inputRefs.current[lastIdx + 1]?.focus();
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
                onClose: () => router.push('/verification')

            })


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

        } else {
            toast.error(`${'An Error Occurred'}`, {
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

    const handleError = (error: any) => {
        toast.error(`${'An Error Occurred'}`, {
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

    const { data, error, isError, isSuccess, mutate, status } = useMutateData(
        "signup",
        handleSuccess,
        handleError,
    );

    // Resend OTP specific handlers
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
            toast.error(`${data?.data?.message || 'An Error Occurred'}` as string, {
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
        toast.error('An Error Occurred', {
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
        "resendotp",
        handleResendSuccess,
        handleResendError,
    );

    const handleVerify = () => {

        const Payload = {
            otp: inputRefs.current.map(el => el?.value).join("")
        }


        mutate({
            url: "/api/verifyaccount",
            payload: Payload
        });



    };

    const resendotp = () => {
        try {
            const email = resendEmail?.trim();
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
                url: "/api/resendotp",
                payload: { email }
            });
        } catch (e) {
            toast.error('An Error Occurred', {
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
        resendMutate({ url: "/api/resendotp", payload: { email } });
    };

    return (
        <>

            <div className="px-8">
                {/*      <ToastContainer closeOnClick /> */}
                <nav className="Brand-logo p-6 lg:px-14 px-7 lg:block xl:block 2xl:block md:block flex justify-center">
                    <Link href={"/"}>
                        <Image src={Brand} alt="brand-logo" />
                    </Link>
                </nav>

                <Suspense fallback={<div className="py-6 text-sm text-gray-500">Loading...</div>}>
                    <AuthHero
                        title="OTP Verification"
                        menu="Please provide the 6-digit security code sents to your e-mail address"
                    />
                </Suspense>

                <div className="flex justify-center mb-20 mt-12">
                    <div className="flex flex-col">
                        <form onSubmit={handleSubmit(handleVerify)}>
                            <div className="flex space-x-2 gap-4 items-center justify-center flex-wrap">
                                {[...Array(6)].map((_, index) => (
                                    <input
                                        key={index}
                                        type="tel"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        className="shadow-md border w-12 border-gray-300 px-2 h-10 rounded-md mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                        onKeyDown={(e) => handleBackspace(index, e)}
                                        onPaste={(e) => handlePaste(index, e)}
                                        {...register(`otp.${index}`)}
                                        ref={(el) => {
                                            if (el) {
                                                inputRefs.current[index] = el;
                                            }
                                        }}
                                        onChange={(e) => handleInputChange(index, e)}
                                    />
                                ))}
                            </div>
                            {errors.otp && <div className="text-red-500">{errors.otp.message}</div>}
                            <div className="flex justify-center items-center mt-12">
                                <Suspense fallback={<div className="w-full py-2 text-center text-sm text-gray-500">Loading...</div>}>
                                    <DefaultButton type="submit"
                                        className="w-full bg-[#FCDFD4] h-10 text-sm hover:bg-[#E84526] hover:text-white"
                                        text={status === 'pending' ? 'loading...' : 'Verify'}
                                    />
                                </Suspense>
                            </div>
                        </form>

                        <div className="flex justify-center items-center mt-4">
                            <nav className="flex gap-2">
                                <small className="text-base">Didn&apos;t get email?</small>
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
                                        className="shadow-md border border-gray-300 px-3 h-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <Suspense fallback={<div className="py-2 px-4 text-sm text-gray-500">Loading...</div>}>
                                        <DefaultButton
                                            type="button"
                                            className="bg-[#FCDFD4] h-10 text-sm hover:bg-[#E84526] hover:text-white"
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
        </>
    );
}

export default Page;
