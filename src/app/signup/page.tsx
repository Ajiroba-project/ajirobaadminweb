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

import { state_and_LGA } from "../../app/static-data";
import { useState } from "react";
import { ModalProfile, ModalTerms } from "../profile/components/ModalProfile";
import { IoIosClose } from "react-icons/io";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

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
    first_name: yup
      .string()
      .required("Firstname is required")
      .matches(/^[A-Za-z\s]+$/, "Firstname can only contain letters"),
    last_name: yup
      .string()
      .required("Surname is required")
      .matches(/^[A-Za-z\s]+$/, "Surname can only contain letters"),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address"
      )
      .required("Email is required"),
    phone: yup
      .string()
      .matches(/^[0-9]+$/, "Phone number must contain only numbers")
      .min(10, "Phone number must be at least 10 digits")
      .max(11, "Phone number cannot exceed 11 digits")
      .required("Mobile number is required"),
    address: yup
      .string()
      .required("Address is required")
      .min(10, "Address must be at least 10 characters long")
      .matches(/^[a-zA-Z0-9\s,.-]+$/, "Address can only contain letters, numbers, spaces, commas, periods, and hyphens"),
    state: yup.string().required("State is required").notOneOf([''], "Please select a state"),
    lga: yup.string().required("LGA is required").notOneOf([''], "Please select an LGA"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
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
    if (data.status === 201) {
      reset();
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
    } else if (data.status === 400 || data.status === 409) {
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
    }
  };

  const handleError = (error: any) => {
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
  };

  const { data, error, isError, isSuccess, mutate, status } = useMutateData(
    "signup",
    handleSuccess,
    handleError,
  );

  const sumbitForm = (data: dataProps) => {
    // Validate email before submission
    const emailIsValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email);
    if (!emailIsValid) {
      toast.error("Please enter a valid email address", {
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
    // Clear the LGA selection when state changes
    setValue('lga', '');
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const [showPassword, setShowPassword] = useState(false);

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
                        onBlur={() => trigger("email")}
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
                        type="tel"
                        {...field}
                        placeholder="Enter phone number"
                        className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal focus:outline-none"
                        maxLength={15}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
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
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...field}
                        placeholder="***********"
                        className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal focus:outline-none pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <IoEyeOffOutline size={20} />
                        ) : (
                          <IoEyeOutline size={20} />
                        )}
                      </button>
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
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "0.25rem",
                        }}
                        value={field.value || ''}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value);
                          handleStateChange(value);
                        }}
                      >
                        <option value="">Select State</option>
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
                        value={field.value || ''}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value);
                        }}
                      >
                        <option value="">Select LGA</option>
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

            {/* <div className="flex justify-center items-center mt-4">
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
                      platform as every ticket is deemed to be use or loose
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
