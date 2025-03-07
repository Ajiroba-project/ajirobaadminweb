"use client";
import Link from "next/link";
import Brand from "../asset/logo.svg";
import passwordlock from "../asset/passwordlock.svg";
import Image from "next/image";
import AuthHero, { HeroSubText } from "../component/AuthHero";
import { DefaultButton } from "../component/Button";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Input from "../component/Input";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { HiArrowLongLeft } from "react-icons/hi2";
import { useMutateData } from "@/hooks/usePutMutateData";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { userOTPStore } from '@/store/store'

function Page() {
    type dataProps = {

        password: string
        c_password: string
        otp?: string
    };

    const router = useRouter();

    const { user_otp } = userOTPStore(state => ({
        user_otp: state.user_otp
    }));

    const schema = yup.object().shape({
        password: yup
            .string()
            .required("Password is required")
            .min(6, "Can't be lesser than 6 digits"),
        c_password: yup
            .string().oneOf([yup.ref('password')], 'Passwords must match')
            .required("Password is required"),

    });

    const {
        reset,
        register,
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        watch,
        setValue,
    } = useForm({
        mode: "all",
        resolver: yupResolver(schema),
    });


    const handleSuccess = (data: any) => {

        //   console.log(data, 'data')


        if (data.data.status === 200 ||  data.data.status === 201 || data.data.status === 'success') {

            toast.success(`${data?.data?.message}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                onClose: () => router.push('/passset')

            })
            reset();

        } else if (data.data.status === 400 || data.data.status === 409 || data.data.status === 'failed') {
          console.log(data, 'data', data?.data?.message)
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
            reset();
        }
    };

    const handleError = (error: any) => {

         console.log(error, 'error')

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
        reset();
    };

    const { data, error, isError, isSuccess, mutate, status } = useMutateData(
        "signup",
        handleSuccess,
        handleError,
    );



    const sumbitForm = async (data: dataProps) => {


        const Payload = {
            password: data.password,
            otp: user_otp
        }

        mutate({
            url: "/api/newpass",
            payload: Payload,
            // otp: user_otp
        });

     /*     console.log(user_otp, '1111')
        console.log(Payload, 'Payload')
 */

    };

    return (
        <>
            <div className="px-8">
             {/*    <ToastContainer closeOnClick /> */}
                <nav className="Brand-logo  p-6 lg:px-14 px-7 lg:block xl:block 2xl:block md:block   flex justify-center ">
                    <Link href={"/"}>
                        <Image src={Brand} alt="brand-logo" />
                    </Link>
                </nav>

                  <div className="flex justify-center items-center flex-col min-h-[80vh]">

            <HeroSubText
            title="Set new password"
                    menu="Fill in the details with your preferred new password"
          />

                {/* <AuthHero
                    title="Set new password"
                    menu="Fill in the details with your preferred new password"
                /> */}

                <section className="flex justify-center items-center mb-8 mt-10">
                    <Image
                        src={passwordlock}
                        alt="password-logo"
                        width={60}
                        height={60}
                    />
                </section>

               <div className=" flex justify-center w-full">
                    <form onSubmit={handleSubmit(sumbitForm)}   className="w-full max-w-sm px-12">
                        <div className="grid xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 2xl:grid-cols-1 grid-cols-1 gap-8  ">
                            <div className="flex flex-col">
                              {/*   <Input
                                    label="New Password"
                                    type="password"
                                    name="password"
                                    placeholder="*********"
                                    register={register}
                                    errors={errors.password}
                                /> */}
                                 <label className="text-sm" htmlFor="email">
                  New Password
                  </label>

                                 <Controller
                      name="password"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <input
                         type="password"
                          {...field}
               placeholder="*********"
                          className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal"
                        />
                      </div>
                    )}
                  />
                                <small>Minimum of 6 characters</small>
                                <div className="text-xs text-red-700">
                                    {errors?.password?.message}
                                </div>
                            </div>
                        </div>

                        <div className=" mt-8 mb-8  grid xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 2xl:grid-cols-1 grid-cols-1 gap-8  ">
                            <div className="flex flex-col">
                               {/*  <Input
                                    label="Confirm Password"
                                    type="password"
                                    name="c_password"
                                    placeholder="*********"
                                    register={register}
                                    errors={errors.c_password}
                                    HiEyeSlash={<FaRegEyeSlash />}
                                    HiEye={<FaRegEye />}
                                /> */}
                                  <label className="text-sm" htmlFor="email">
                   Confirm Password
                  </label>

                                  <Controller
                       name="c_password"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <input
                       type="password"
                          {...field}
               placeholder="*********"
                          className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal"
                        />
                      </div>
                    )}
                  />

                                <small>Minimum of 6 characters</small>
                                <div className="text-xs text-red-700">
                                    {errors?.c_password?.message}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center mt-4">
                            <DefaultButton
                                type="submit"
                                className=" rounded-lg w-full bg-[#FCDFD4] h-10 text-sm hover:bg-[#E84526] hover:text-white"
                                // text="Reset Password"
                                text={status === 'pending' ? 'loading...' : 'Reset Password'}
                                handleClick={() => console.log("")}
                            />
                        </div>


                    </form>

                </div>
                <div className="flex cursor-pointer justify-center items-center mt-4 ">
                    <nav onClick={() => router.push('/signin')} className="flex items-center gap-2">
                        <HiArrowLongLeft />
                        <small className="text-base">
                            Back to login
                        </small>
                    </nav>
                </div>

                  </div>

            </div>
        </>
    );
}

export default Page;
