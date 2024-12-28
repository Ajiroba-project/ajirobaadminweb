// "use client";
// import { useRouter } from "next/navigation";
// import { RegistrationHeader, HeaderTitle } from "../components/Header";
// import { SignUpValidationSchema } from "@/helper/validation";
// import { useMutateData } from "@/hooks/useMutateData";
// import { InputField } from "../components/FormField";
// import { DefaultButton } from "../components/Button";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// type dataProps = {
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   password: string;
//   address: string;
//   city: string;
// };

// // page rendered
// const Page = () => {
//   const router = useRouter();

//   const {
//     reset,
//     register,
//     control,
//     handleSubmit,
//     formState: { errors },
//     trigger,
//     watch,
//     setValue,
//   } = useForm({
//     mode: "all",
//     resolver: yupResolver(SignUpValidationSchema),
//   });

//   const handleSuccess = (data: any) => {
//     if (data.status === 201) {
//       toast.success(`${data?.data?.message}`, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//         onClose: () => router.push("/otpverification"),
//       });
//       reset();
//     } else if (data.status === 400 || data.status === 409) {
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
//       reset();
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
//       reset();
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
//     reset();
//   };
//   const { data, error, isError, isSuccess, mutate, status } = useMutateData(
//     "signup",
//     handleSuccess,
//     handleError
//   );

//   const sumbitForm = (data: dataProps) => {
//     mutate({
//       url: "/api/auth",
//       payload: data,
//     });
//   };

//   return (
//     <section>
//       <ToastContainer closeOnClick />
//       {/* <RegistrationHeader/> */}
//       <HeaderTitle
//         title="Register"
//         subtitle="Create an account kindly provide your details below"
//       />

//       <div className=" flex justify-center mb-20  my-4">
//         <form onSubmit={handleSubmit(sumbitForm)}>
//           <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 2xl:grid-cols-2 grid-cols-1 gap-8 px-3 mt-12">
//             <InputField
//               name="first_name"
//               label="First Name*"
//               placeholder="Enter Firstname"
//               type="text"
//               register={register}
//               errors={errors}
//             />
//             <InputField
//               name="last_name"
//               label="Last Name*"
//               placeholder="Enter Lastname"
//               type="text"
//               register={register}
//               errors={errors}
//             />
//             <InputField
//               name="email"
//               label="Email*"
//               placeholder="Enter Email"
//               type="email"
//               register={register}
//               errors={errors}
//             />
//             <InputField
//               name="phone"
//               label="Phone Number*"
//               placeholder="Enter Phone Number"
//               type="text"
//               register={register}
//               errors={errors}
//             />
//             <InputField
//               name="password"
//               label="Password*"
//               placeholder="Enter Password"
//               type="password"
//               register={register}
//               errors={errors}
//             />
//             <InputField
//               name="address"
//               label="Address*"
//               placeholder="Enter Address"
//               type="text"
//               register={register}
//               errors={errors}
//             />
//             <InputField
//               name="city"
//               label="City*"
//               placeholder="Enter City"
//               type="text"
//               register={register}
//               errors={errors}
//             />
//           </div>
//           <div className="flex justify-center items-center mt-12">
//             <DefaultButton
//               type="submit"
//               className=" w-full bg-[#FCDFD4] py-4 text-sm"
//               handleClick={() => null}
//               text={status === "pending" ? "loading..." : "Create Account"}
//             />
//           </div>
//           <div className="flex justify-center items-center mt-8">
//             <nav className="flex gap-2">
//               <small className="text-base text-sm">
//                 Already Have an Account?
//               </small>
//               <small className="text-base">
//                 <button
//                   onClick={() => router.push("/signin")}
//                   className="text-[#F25E26] text-sm"
//                 >
//                   Sign in
//                 </button>
//               </small>
//             </nav>
//           </div>
//         </form>
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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import Input from "../component/Input";
import { useRouter } from "next/navigation";
import { useMutateData } from "@/hooks/useMutateData";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { Input } from "@nextui-org/react";

import { Select, SelectSection, SelectItem } from "@nextui-org/select";

import { state_and_LGA } from '@/app/static-data'
import { useState } from "react";
import { ModalProfile, ModalTerms } from "../profile/components/ModalProfile";
import { IoIosClose } from "react-icons/io";

function Page() {
  type dataProps = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    referral?: string;
    address: string;
    state: string;
    lga: string;
    password: string;
    residential?: string;
    gender?: boolean;
    agree_terms?: boolean;
  };
  const router = useRouter();

  const schema = yup.object().shape({
    first_name: yup.string().required("Firstname is required"),
    last_name: yup.string().required("Surname is required"),
    email: yup
      .string()
      .matches(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
        "Valid email is required",
      )
      .required("Email is required"),
    phone: yup.string().required("Mobile number is required"),
    address: yup.string().required("address is required"),
    state: yup.string().required("State is required"),
    lga: yup.string().required("LGA is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Can't be lesser than 6 digits"),
    gender: yup.boolean().required("Gender is required"),
    // agree_terms: yup
    //   .boolean()
    //   .oneOf([true], "You must agree to the terms and conditions"),
    referral: yup.string(),
    residential: yup.string(),
  });

  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const handleSuccess = (data: any) => {
    setValue('first_name', '')
    if (data.status === 201) {
      reset()
      toast.success(`${data?.data?.message}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: () => router.push("/otpverification"),
      });
      reset();
    } else if (data.status === 400 || data.status === 409) {
        reset()
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
      reset();
    } else {
        reset()
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
      reset();
    }
  };

  const handleError = (error: any) => {
        setValue('first_name', '')
        console.log(error , 'errr')
      reset()
    toast.error(`${"An Error Occured"}`, {
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
  };

  const { data, error, isError, isSuccess, mutate, status } = useMutateData(
    "signup",
    handleSuccess,
    handleError,
  );

  const sumbitForm = (data: dataProps) => {
    // console.log(data, 'datat')
     mutate({
      url: "/api/auth",
      payload: data,
    });
  };

  const [selectedState, setSelectedState] = useState("");
  const [lgas, setLgas] = useState<string[]>([]);

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    const selectedState = state_and_LGA.find((state) => state.state === value);
    setLgas(selectedState ? selectedState.lgas : []);
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="px-4">
        <nav className="Brand-logo  p-6 lg:px-14 px-7 lg:block xl:block 2xl:block md:block   flex justify-center ">
          <Link href={"/"}>
            <Image src={Brand} alt="brand-logo" />
          </Link>
        </nav>

        <AuthHero
          title="Register"
          menu="Start using our e-commerce for all your needs, buy a ticket and start winning through a raffle draw"
        />

        <div className=" flex justify-center items-center mb-20 px-4 ">
          <form
            onSubmit={handleSubmit(sumbitForm)}
            className="w-full max-w-2xl"
          >
            <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 2xl:grid-cols-2 grid-cols-1 gap-8  mt-12">
              <div className="flex flex-col ">
                <label className="text-sm" htmlFor="First Name*">
                  First Name*
                </label>

                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        type="text"
                        {...field}
                        placeholder="Enter firstname"
                        className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal focus:outline-none"
                      />
                    </div>
                  )}
                />
                <div className="text-xs  text-red-700">
                  {errors?.first_name?.message}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm" htmlFor="last_name">
                  Last Name*
                </label>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        type="text"
                        {...field}
                        placeholder="Enter surname"
                        className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal focus:outline-none"
                      />
                    </div>
                  )}
                />
                <div className="text-xs text-red-700">
                  {errors?.last_name?.message}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm" htmlFor="email">
                  Email Address*
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        type="email"
                        {...field}
                        placeholder="Enter email"
                        className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal focus:outline-none"
                      />
                    </div>
                  )}
                />
                <div className="text-xs text-red-700">
                  {errors?.email?.message}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm" htmlFor="phone">
                  Phone Number*
                </label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        type="text"
                        {...field}
                        placeholder="Enter phone number"
                        className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal focus:outline-none"
                      />
                    </div>
                  )}
                />
                <div className="text-xs text-red-700">
                  {errors?.phone?.message}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm" htmlFor="password">
                  Password*
                </label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        type="password"
                        {...field}
                        placeholder="***********"
                        className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal focus:outline-none"
                      />
                    </div>
                  )}
                />
                <div className="text-xs text-red-700">
                  {errors?.password?.message}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm" htmlFor="referral">
                  Referal code (Optional)
                </label>
                <Controller
                  name="referral"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        type="text"
                        {...field}
                        placeholder="Referal code"
                        className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal focus:outline-none"
                      />
                    </div>
                  )}
                />
                <div className="text-xs text-red-700"></div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm" htmlFor="address">
                  Address*
                </label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        type="text"
                        {...field}
                        placeholder="Enter your Address"
                        className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal focus:outline-none"
                      />
                    </div>
                  )}
                />
                <div className="text-xs text-red-700">
                  {errors?.address?.message}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm" htmlFor="state">
                  State*
                </label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal pr-12"
                        {...field}
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "0.25rem",
                        }}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value);
                          handleStateChange(value);
                        }}
                      >
                        {state_and_LGA.map((state) => (
                          <option key={state.state} value={state.state}>
                            {state.state}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                />
                <div className="text-xs text-red-700">
                  {errors?.state?.message}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm" htmlFor="lga">
                  Local Government Area (LGA)*
                </label>
                <Controller
                  name="lga"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal pr-12"
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "0.25rem",
                        }}
                        disabled={!selectedState}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value);
                        }}
                      >
                        {lgas.map((lga) => (
                          <option key={lga} value={lga}>
                            {lga}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                />
                <div className="text-xs text-red-700">
                  {errors?.lga?.message}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm" htmlFor="residential">
                  Residential Number (Optional)
                </label>
                <Controller
                  name="residential"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        type="text"
                        {...field}
                        placeholder="residential Number"
                        className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal focus:outline-none"
                      />
                    </div>
                  )}
                />
                <small className="text-sm text-[#6E6E6E] mt-1">
                  (such as LASRRA etc)
                </small>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="male"
                    {...register("gender", { required: true })}
                    value="true"
                    className="mr-2 text-wdc-inactivebutton focus:outline-none"
                  />
                  <label
                    htmlFor="male"
                    className="text-sm text-wdc-inactivebuttons"
                  >
                    Male
                  </label>
                </div>

                <div className="flex items-center mb-0">
                  <input
                    type="radio"
                    id="female"
                    {...register("gender", { required: true })}
                    value="false"
                    className="mr-2 text-wdc-inactivebutton focus:outline-none"
                  />
                  <label
                    htmlFor="female"
                    className="text-sm text-wdc-inactivebuttons"
                  >
                    Female
                  </label>
                </div>
              </div>

              <div></div>

              <div className="text-xs text-red-700">
                {errors?.gender?.message}
              </div>
            </div>

            <div className="">
              <div className="grid grid-cols-1  mt-4">
                <DefaultButton
                  type="submit"
                  className="w-auto rounded-lg  bg-[#FCDFD4] h-10 text-sm hover:bg-[#E84526] hover:text-white"
                  text={status === "pending" ? "loading..." : "Create Account"}
                  handleClick={() => console.log("clcikeddd")}
                />
              </div>
            </div>

         {/*    <div className="flex justify-center items-center mt-4">
              <input
                type="checkbox"
                id="agreement"
                {...register("agree_terms")}
                value="true"
                className="mr-2 text-wdc-inactivebutton focus:outline-none"
              />
              <span
                className="text-sm"
                onClick={() => setModalOpen(!isModalOpen)}
              >
                I agree with the{" "}
                <small className="text-[#F25E26]"> Terms and Conditions</small>
              </span>
            </div>
            <div className="text-xs text-red-700 text-center">
              {errors?.agree_terms?.message}
            </div> */}

            <div className="flex justify-center items-center mt-4">
              <small className="text-base">
                Already have an account?
                <span
                  onClick={() => router.push("/signin")}
                  className="text-[#F25E26] text-sm cursor-pointer "
                >
                  {" "}
                  Sign in
                </span>
              </small>
            </div>
          </form>
        </div>

        {isModalOpen && (
          <ModalTerms
            icon={""}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title=""
            handleEvent={handleCloseModal}


          >
            <div className=" cursor-pointer" onClick={handleCloseModal}

             style={{
        backgroundImage: "url('/ajirobabg.svg')",  // Add your image path here
       backgroundSize: "33.33%",
        backgroundPosition: "center",
        backgroundRepeat: "repeat-x",
   /*       backgroundPosition: "top", */
      }}
            >
              <div className="bg-[#F6F6F6] items-center cursor-pointer p-8">
                <div className="flex justify-between items-center">
                  <div className="">
                    <Link href={"/"}>
                      <Image src={Brand} alt="" />
                    </Link>
                  </div>

                  <div>
                    <IoIosClose size={32} />
                  </div>
                </div>

                <p className="flex justify-center font-Poppins font-normal text-[#2A2A2A] text-base items-center">
                  Terms and Conditions
                </p>
              </div>

              <div className="p-8 flex flex-col gap-5">
                <div>
                  <div>
                    <h1 className="text-[#2A2A2A] font-Poppins font-semibold text-lg">
                      Age declaration
                    </h1>
                  </div>

                  <div>
                    <p className="text-sm font-Poppins text-[#2A2A2A] font-normal">
                      This platform is open to users who are at least 18 years
                      old as at the time of transacting on the platform
                    </p>
                  </div>
                </div>

                <div>
                  <div>
                    <h1 className="text-[#2A2A2A] font-Poppins font-semibold text-lg">
                      Tickets Cancellation
                    </h1>
                  </div>

                  <div>
                    <p className="text-sm font-Poppins text-[#2A2A2A] font-normal">
                      Once a ticket is bought for any products, such a ticket
                      can no longer be cancelled
                    </p>
                  </div>
                </div>

                <div>
                  <div>
                    <h1 className="text-[#2A2A2A] font-Poppins font-semibold text-lg">
                      Refund Policy
                    </h1>
                  </div>

                  <div>
                    <p className="text-sm font-Poppins text-[#2A2A2A] font-normal">
                      There is no refund for any ticket already bought on the
                      platofm as every ticket is deemed to be use or loose
                    </p>
                  </div>
                </div>


                 <div>
                  <div>
                    <h1 className="text-[#2A2A2A] font-Poppins font-semibold text-lg">
                     Auction Winning
                    </h1>
                  </div>

                  <div>
                    <p className="text-sm font-Poppins text-[#2A2A2A] font-normal">
                     There is no guarantee that you win the item you bid for as the auction
                     process is purely a game of chance with everyone as represented by every ticket has equal winning opportunity. However, you may increase your chances of winning by buying as many tickets as possible for your item of choice on auction.
                    </p>
                  </div>
                </div>


                   <div>
                  <div>
                    <h1 className="text-[#2A2A2A] font-Poppins font-semibold text-lg">
                     Winning Redemption
                    </h1>
                  </div>

                  <div>
                    <p className="text-sm font-Poppins text-[#2A2A2A] font-normal">
                     Any item won on the platform can be redeemed through physical delivery of
                     the items to you or through a gift voucher which can be redeemed at any of our designated stores or in some instances through cash tranfer to the winner where cash transfer
                     remains the only efficient and feasible option
                    </p>
                  </div>
                </div>

              </div>
            </div>
            <div></div>
          </ModalTerms>
        )}
      </div>
    </>
  );
}

export default Page;
