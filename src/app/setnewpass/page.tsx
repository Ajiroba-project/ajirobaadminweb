"use client";
import Link from "next/link";
import passwordlock from "../asset/passwordlock.svg";
import Image from "next/image";
import { RegistrationHeader, HeaderTitle } from "../components/Header";
import { DefaultButton } from "../components/Button";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { InputField } from "../components/FormField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PasswordResetschema } from "@/helper/validation";
import { HiArrowLongLeft } from "react-icons/hi2";
import { useMutateData } from "@/hooks/useMutateData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Page() {
  type dataProps = {
    password: string;
    c_password: string;
  };

  const router = useRouter();

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
    resolver: yupResolver(PasswordResetschema),
  });

  const handleSuccess = (data: any) => {
    if (data.status === 201) {
      toast.success(`${data?.data?.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: () => router.push("/passset"),
      });
      reset();
    } else if (data.status === 400 || data.status === 409) {
      toast.error(`${data?.data?.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      reset();
    } else {
      toast.error(`${"An Error Occured"}`, {
        position: "top-right",
        autoClose: 5000,
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
    toast.error(`${"An Error Occured"}`, {
      position: "top-right",
      autoClose: 5000,
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
    handleError
  );

  const sumbitForm = async (data: dataProps) => {
    const Payload = {
      password: data.password,
    };

    mutate({
      url: "/api/newpass",
      payload: data,
    });
  };

  return (
    <>
      <div className="px-8">
        <ToastContainer closeOnClick />
        <RegistrationHeader />

        <HeaderTitle
          title="Set new password"
          subtitle="Fill in the details with your preferred new password"
        />

        <section className="flex justify-center items-center mb-8 mt-10">
          <Image
            src={passwordlock}
            alt="password-logo"
            width={60}
            height={60}
          />
        </section>

        <div className=" flex justify-center ">
          <form onSubmit={handleSubmit(sumbitForm)}>
            <div className="grid xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 2xl:grid-cols-1 grid-cols-1 gap-8 px-3 ">
              <div className="flex flex-col">
                <InputField
                  label="New Password"
                  type="password"
                  name="password"
                  placeholder="*********"
                  register={register}
                  errors={errors}
                />
              </div>
            </div>

            <div className=" mt-8 mb-8  grid xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 2xl:grid-cols-1 grid-cols-1 gap-8 px-3 ">
              <div className="flex flex-col">
                <InputField
                  label="Confirm Password"
                  type="password"
                  name="c_password"
                  placeholder="*********"
                  register={register}
                  errors={errors}
                  showPassword={true}
                />
              </div>
            </div>
            <div className="flex justify-center items-center mt-4 mx-3">
              <DefaultButton
                type="submit"
                className=" w-full bg-[#FCDFD4] py-4 text-sm"
                text="Reset Password"
                handleClick={() => null}
              />
            </div>
          </form>
        </div>
        <div className="flex cursor-pointer justify-center items-center mt-4 ">
          <nav
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <HiArrowLongLeft />
            <small className="text-base">Back to login</small>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Page;
