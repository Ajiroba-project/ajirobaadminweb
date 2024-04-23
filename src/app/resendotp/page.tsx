"use client";
import Link from "next/link";
import passwordlock from "../asset/passwordlock.svg";
import { RegistrationHeader, HeaderTitle } from "../component/Header";
import Image from "next/image";
import { DefaultButton } from "../component/Button";
import { useRouter } from "next/navigation";
import { InputField } from "../component/FormField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EmailSchema } from "@/helper/validation";
import { HiArrowLongLeft } from "react-icons/hi2";
import { useMutateData } from "@/hooks/useMutateData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Page() {
    type dataProps = {
        email: string;
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
        resolver: yupResolver(EmailSchema),
    });

    const handleSuccess = (data: any) => {


        if (data.status === 200) {

            toast.success(`${data?.data?.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                onClose: () => router.push('/otpverification')

            })
            reset()

        } else if (data.status === 403 || data.status === 404) {
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
            reset()
        } else {
            toast.error(`${'An Error Occured'}`, {
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
        toast.error(`${'An Error Occured'}`, {
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
        handleError,
    );



    const sumbitForm = async (data: dataProps) => {
        reset();
        mutate({
            url: "/api/resendotp",
            payload: data
        });
    };

    return (
        <>
            <div className="px-8">
                <ToastContainer closeOnClick />
                <RegistrationHeader/>

                <HeaderTitle
                    title="OTP"
                    subtitle="No worries! An OTP will be sent to reset your password"
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
                                    label="Email"
                                    type="text"
                                    name="email"
                                    placeholder="Enter Email Address"
                                    register={register}
                                    errors={errors}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center items-center mt-4 mx-3">
                            <DefaultButton
                                type="submit"
                                className=" w-full bg-[#FCDFD4] py-4 text-sm rounded-sm"
                                text="Proceed"
                                handleClick={() => null}
                            />
                        </div>


                    </form>



                </div>
                {/* <div className="flex cursor-pointer justify-center items-center mt-4 ">
                    <nav onClick={() => router.back()} className="flex items-center gap-2">
                        <HiArrowLongLeft />
                        <small className="text-base">
                            Back to login
                        </small>
                    </nav>
                </div> */}
            </div>
        </>
    );
}

export default Page;
