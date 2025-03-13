'use client'
import Link from 'next/link'
import Brand from '../asset/logo.svg'
import Image from 'next/image'
import AuthHero, { HeroSubText } from '../component/AuthHero'
import { DefaultButton } from '../component/Button'
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
// import Input from '../component/Input'
import { useRouter } from 'next/navigation'
import { FaRegEyeSlash } from 'react-icons/fa'
import { FaRegEye } from 'react-icons/fa6'
import { useMutateData } from '@/hooks/useMutateData'
import { ToastContainer, toast } from 'react-toastify'
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

import { useAuthStore } from '@/store/store'

// import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'
 import Cookies from 'js-cookie'

function Page() {



  type dataProps = {
    // email: string;
    email_or_phone?: string

    password: string
  }

  const router = useRouter()

  const emailOrPhoneNumberSchema = yup.string().matches(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$|^(\+\d{1,3}[- ]?)?\d{11}$/, // Regular expression for a string containing either a valid email or a valid phone number
    'Valid email or phone number is required'
  )

  const schema = yup.object().shape({


    email_or_phone: emailOrPhoneNumberSchema.required(
      'Email or phone number is required'
    ),

    password: yup
      .string()
      .required('Password is required')
      .min(6, "Can't be lesser than 6 digits")
  })

  const { setUser, isLoggedIn, setAuthCookie } = useAuthStore(state => ({
    setUser: state.setUser,
    isLoggedIn: state.isLoggedIn,
    setAuthCookie: state.setAuthCookie
  }))



  const [rememberMe, setRememberMe] = useState(false);


  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema)
  })

  const handleSuccess = (data: any) => {
    // console.log(data, 'datatta----1')
    // console.log(data.data.status)

    if (data.status === 200) {
      toast.success(`${data?.data?.message}`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        onClose: () => router.push('/dashboard')
      })

      setAuthCookie(data?.data?.token, 0)
        Cookies.set("token", data?.data?.token, { expires: 1 });



      setUser(data?.data)
      //  Cookies.set('ik', JSON.stringify(data?.data?.token), { sameSite: 'strict' });

      reset()
    } else if (data.status === 403 || data.status === 404) {
      toast.error(`${data?.data?.message}`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      })
      reset()
    } else if (data.status === 401 || data.data.status === 'failed') {
      toast.error(`${'Incorrect login details'}`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      })
      reset()
    }


    else {
      toast.error(`${data?.data?.message}`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      })
      reset()
    }
  }

  const handleError = (error: any) => {

    toast.error(`${'An Error Occured'}`, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    })
    reset()
  }

  const { data, error, isError, isSuccess, mutate, status } = useMutateData(
    'signin',
    handleSuccess,
    handleError
  )

  const [showPassword, setShowPassword] = useState(false);

  const sumbitForm = async (data: dataProps) => {
    // console.log(data, 'datatat')

    mutate({
      url: '/api/signin',
      payload: data
    })
  }


  return (
    <>


      <div className="px-4">
  <nav className="Brand-logo flex justify-center p-6 px-7 md:block lg:block lg:px-14 xl:block 2xl:block">
    <Link href={"/"}>
      <Image src={Brand} alt="brand-logo" />
    </Link>
  </nav>

  <div className="flex justify-center items-center flex-col min-h-[90vh]">
    <HeroSubText title="Welcome Back" menu="Sign in to shop on Ajiroba" />

    <div className="mb-20 flex justify-center w-full">
      <form
        onSubmit={handleSubmit(sumbitForm)}
        className="w-full max-w-sm p-4 md:p-8"
      >
        <div className="mt-4 grid grid-cols-1 gap-8">
          <div className="flex flex-col">
            <label className="text-sm" htmlFor="email_or_phone">
              Email Address/Phone Number*
            </label>
            <Controller
              name="email_or_phone"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  placeholder="Enter your Email or Phone number"
                  className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal focus:outline-none"
                />
              )}
            />
            <div className="text-xs text-red-700">
              {errors?.email_or_phone?.message}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm" htmlFor="password">
              Password
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
                    className="text-sm w-full h-auto p-2.5 border rounded-lg font-Inter font-normal focus:outline-none"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </div>
                </div>
              )}
            />
            <div className="text-xs text-red-700">
              {errors?.password?.message}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <DefaultButton
            type="submit"
            className="rounded-lg h-10 w-full bg-[#FCDFD4] text-sm hover:bg-[#E84526] hover:text-white"
            text={status === "pending" ? "loading..." : "Sign in"}
            handleClick={() => console.log("")}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <input
              type="checkbox"
              id="agreement"
              value="true"
              className="text-wdc-inactivebutton mr-2"
            />
            <span className="text-sm">Remember me</span>
          </div>
          <div onClick={() => router.push("forgot-password")}>
            <span className="cursor-pointer">Forgot password?</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <small className="text-sm text-[#353131] font-normal font-Poppins">
            Don’t have an account?
            <span
              onClick={() => router.push("/signup")}
              className="cursor-pointer text-base text-[#F25E26] ml-2"
            >
              {" "}
              Sign up
            </span>
          </small>
        </div>
      </form>
    </div>
  </div>
</div>

    </>
  )
}

export default Page
