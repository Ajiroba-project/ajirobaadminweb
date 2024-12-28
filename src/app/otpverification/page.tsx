// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import { RegistrationHeader, HeaderTitle } from "../components/Header";
// import { DefaultButton } from "../components/Button";
// import { useRouter } from "next/navigation";
// import { useRef, useState } from "react";
// import { HiArrowLongLeft } from "react-icons/hi2";
// import { useMutateData } from "@/hooks/useMutateData";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Page = () => {
//   const router = useRouter();
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const inputRefs = useRef<HTMLInputElement[]>([]);

//   const handleInputChange = (
//     index: number,
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const newOtp = [...otp];
//     newOtp[index] = event.target.value.slice(0, 1);
//     setOtp(newOtp);
//     if (index < 5 && newOtp[index].length === 1) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const handleBackspace = (
//     index: number,
//     event: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (index > 0 && event.keyCode === 8 && otp[index].length === 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handleSuccess = (data: any) => {
//     if (data.status === 200) {
//       toast.success(`${data?.data?.message}`, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//         onClose: () => router.push("/verification"),
//       });
//       setOtp(["", "", "", "", "", ""]);
//     } else if (data.status === 400) {
//       toast.error(`${data?.data?.message}`, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });
//       setOtp(["", "", "", "", "", ""]);
//     } else {
//       toast.error(`${"An Error Occured"}`, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });
//       setOtp(["", "", "", "", "", ""]);
//     }
//   };

//   const handleError = (error: any) => {
//     toast.error(`${"An Error Occured"}`, {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//     });
//     setOtp(["", "", "", "", "", ""]);
//   };

//   const { data, error, isError, isSuccess, mutate, status } = useMutateData(
//     "signup",
//     handleSuccess,
//     handleError
//   );

//   const handleVerify = () => {
//     const Payload = {
//       otp: otp?.join(""),
//     };

//     mutate({
//       url: "/api/verifyaccount",
//       payload: Payload,
//     });
//   };

//   const resendotp = () => {
//     router.push("/resendotp");
//   };

//   return (
//     <section>
//       <RegistrationHeader />
//       <HeaderTitle
//         title="OTP Verification"
//         subtitle="Please provide the 6-digit security code sents to your e-mail address"
//       />

//       <div className=" flex justify-center mb-20 mt-12 ">
//         <div className="flex flex-col">
//           <div className="flex  space-x-2 gap-4 items-center justify-center flex-wrap">
//             {otp.map((value, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 maxLength={1}
//                 value={value}
//                 className=" shadow border w-12 border-gray-300 px-2 h-10 rounded-md mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onChange={(e) => handleInputChange(index, e)}
//                 onKeyDown={(e) => handleBackspace(index, e)}
//                 ref={(el) => {
//                   if (el) {
//                     inputRefs.current[index] = el;
//                   }
//                 }}
//               />
//             ))}
//           </div>

//           <div className="flex justify-center items-center mt-12">
//             <DefaultButton
//               type="submit"
//               className=" w-full bg-[#FCDFD4] h-10 text-sm"
//               text={status === "pending" ? "loading..." : "Verify"}
//               handleClick={() => handleVerify()}
//             />
//           </div>

//           <div className="flex justify-center items-center mt-4">
//             <nav className="flex gap-2">
//               <small className="text-base">Didn’t get email?</small>
//               <small className="text-base">
//                 <button
//                   onClick={() => resendotp()}
//                   className="text-[#F25E26] text-sm"
//                 >
//                   Click to resend
//                 </button>
//               </small>
//             </nav>
//           </div>

//           <div className="flex cursor-pointer justify-center items-center mt-4">
//             <nav
//               onClick={() => router.back()}
//               className="flex items-center gap-2"
//             >
//               <HiArrowLongLeft />
//               <small className="text-base">Back</small>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Page;



"use client";
import Link from "next/link";
import Brand from "../asset/logo.svg";
import Image from "next/image";
import AuthHero from "../component/AuthHero";
import { DefaultButton } from "../component/Button";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });


    const router = useRouter();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    // const inputRefs = useRef<HTMLInputElement[]>([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));


    const handleInputChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newOtp = [...otp];
        newOtp[index] = event.target.value.slice(0, 1);
        setOtp(newOtp);
        if (index < 5 && newOtp[index].length === 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (
        index: number,
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (index > 0 && event.keyCode === 8 && otp[index].length === 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };



    const handleSuccess = (data: any) => {
      // console.log(data, 'data')

        if (data.status === 200) {
          console.log(data?.data?.message, data, 'datata')

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
        "otpverification",
        handleSuccess,
        handleError,
    );

    const handleVerify = () => {

        const Payload = {
            otp: otp?.join("")
        }


        mutate({
            url: "/api/verifyaccount",
            payload: Payload
        });



    };

    const resendotp = () => {

        router.push('/resendotp')

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

                <AuthHero
                    title="OTP Verification"
                    menu="Please provide the 6-digit security code sents to your e-mail address"
                />

                <div className="flex justify-center mb-20 mt-12">
                    <div className="flex flex-col">
                        <form onSubmit={handleSubmit(handleVerify)}>
                            <div className="flex space-x-2 gap-4 items-center justify-center flex-wrap">
                                {otp.map((value, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={value}
                                        className="shadow-md border w-12 border-gray-300 px-2 h-10 rounded-md mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onKeyDown={(e) => handleBackspace(index, e)}
                                        ref={(el) => {
                                            if (el) {
                                                inputRefs.current[index] = el;
                                            }
                                        }}

                                        onChange={(e) => {
                                            handleInputChange(index, e); // Call your custom onChange function
                                            register(`otp.${index}`).onChange(e); // Call react-hook-form's onChange function with the correct field name
                                        }}
                                    />


                                ))}
                            </div>
                            {errors.otp && <div className="text-red-500">{errors.otp.message}</div>}
                            <div className="flex justify-center items-center mt-12">
                                {/* <DefaultButton
                                    type="submit"
                                    className="w-full bg-[#FCDFD4] h-10 text-sm hover:bg-[#E84526] hover:text-white"
                                    text={status === 'pending' ? 'loading...' : 'Verify'}
                                    handleClick={() => handleVerify()}
                                /> */}
                                <DefaultButton type="submit"
                                    className="w-full bg-[#FCDFD4] h-10 text-sm hover:bg-[#E84526] hover:text-white"
                                    text={status === 'pending' ? 'loading...' : 'Verify'}
                                />

                            </div>
                        </form>

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
