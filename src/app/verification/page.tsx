// "use client";
// import Link from "next/link";
// import { RegistrationHeader, HeaderTitle } from "../components/Header";
// import Verify_icon from "../asset/verify.svg";
// import Image from "next/image";
// import { DefaultButton } from "../components/Button";
// import { useRouter } from "next/navigation";

// function Page() {
//   const router = useRouter();

//   const handleVerify = () => {
//     router.push("/signin");
//   };

//   return (
//     <>
//       <div className="px-8">
//         <RegistrationHeader />

//         <section className="flex justify-center items-center mb-8 mt-20">
//           <Image src={Verify_icon} alt="brand-logo" width={60} height={60} />
//         </section>

//         <HeaderTitle
//           title="Verification Successful!"
//           menu="Your Email address has ben verified"
//         />

//         <div className=" flex justify-center mb-20 mt-4 ">
//           <div className="flex flex-col">
//             <div className="flex justify-center items-center mx-3">
//               <DefaultButton
//                 type="submit"
//                 className=" w-full bg-[#FCDFD4] py-4 text-sm"
//                 text="Proceed"
//                 handleClick={() => handleVerify()}
//               />
//             </div>

//             <div className=" invisible flex justify-center items-center mt-4">
//               <nav className="flex gap-2">
//                 <small className="text-base">Didn’t get email?</small>
//                 <small className="text-base">
//                   <button
//                     onClick={() => handleVerify()}
//                     className="text-[#F25E26] text-sm"
//                   >
//                     Click to resend
//                   </button>
//                 </small>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Page;



"use client";
import Link from "next/link";
import Brand from "../asset/logo.svg";
import Verify_icon from "../asset/verify.svg";
import Image from "next/image";
import AuthHero from "../component/AuthHero";
import { DefaultButton } from "../component/Button";
import { useRouter } from "next/navigation";


function Page() {
    const router = useRouter();

    const handleVerify = () => {
        router.push("/signin");
    };

    return (
        <>
            <div className="px-8">
                <nav className="Brand-logo  p-6 lg:px-14 px-7 lg:block xl:block 2xl:block md:block   flex justify-center ">
                    <Link href={"/"}>
                        <Image src={Brand} alt="brand-logo" />
                    </Link>
                </nav>

                <section className="flex justify-center items-center mb-8 mt-20">
                    <Image src={Verify_icon} alt="brand-logo" width={60} height={60} />
                </section>

                <AuthHero
                    title="Verification Successful!"
                    menu="Your Email address has ben verified"
                />

                <div className=" flex justify-center mb-20 mt-4 ">
                    <div className="flex flex-col">
                        <div className="flex justify-center items-center ">
                            <DefaultButton
                                type="submit"
                                className=" w-full bg-[#FCDFD4] h-10 text-sm hover:bg-[#E84526] hover:text-white"
                                text="Proceed"
                                handleClick={() => handleVerify()}
                            />
                        </div>

                        <div className=" invisible flex justify-center items-center mt-4">
                            <nav className="flex gap-2">
                                <small className="text-base">Didn’t get email?</small>
                                <small className="text-base">
                                    <button
                                        onClick={() => handleVerify()}
                                        className="text-[#F25E26] text-sm"
                                    >
                                        Click to resend
                                    </button>
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
