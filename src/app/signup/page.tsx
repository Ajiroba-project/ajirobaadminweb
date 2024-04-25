"use client"
import { useRouter } from 'next/navigation'
import {RegistrationHeader, HeaderTitle} from '../component/Header'
import {SignUpValidationSchema} from "@/helper/validation"
import { useMutateData } from "@/hooks/useMutateData";
import {InputField} from "../component/FormField";
import { DefaultButton } from "../component/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

   type dataProps = {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        password: string;
        address: string;
        city: string;
    };

// page rendered
const Page = () => {
    const router = useRouter()

 const { reset, register, control, handleSubmit, formState: { errors }, trigger, watch, setValue,
    } = useForm({
        mode: "all",
        resolver: yupResolver(SignUpValidationSchema),
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
            onClose: () => router.push("/otpverification"),
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


const sumbitForm = (data: dataProps) => {
        mutate({
            url: "/api/auth",
            payload: data
        });
    };




  return (
    <section>
        <ToastContainer closeOnClick />
        {/* <RegistrationHeader/> */}
        <HeaderTitle title="Register" subtitle="Create an account kindly provide your details below" />

        <div className=" flex justify-center mb-20  my-4">
            <form onSubmit={handleSubmit(sumbitForm)}>
                <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 2xl:grid-cols-2 grid-cols-1 gap-8 px-3 mt-12">
                    <InputField name="first_name" label="First Name*" placeholder="Enter Firstname" type="text" register={register} errors={errors}/>
                    <InputField name="last_name" label="Last Name*" placeholder="Enter Lastname" type="text" register={register} errors={errors}/>
                    <InputField name="email" label="Email*" placeholder="Enter Email" type="email" register={register} errors={errors}/>
                    <InputField name="phone" label="Phone Number*" placeholder="Enter Phone Number" type="text" register={register} errors={errors}/>
                    <InputField name="password" label="Password*" placeholder="Enter Password" type="password" register={register} errors={errors}/>
                    <InputField name="address" label="Address*" placeholder="Enter Address" type="text" register={register} errors={errors}/>
                    <InputField name="city" label="City*" placeholder="Enter City" type="text" register={register} errors={errors}/>
                </div>
                <div className="flex justify-center items-center mt-12">
                            <DefaultButton
                                type="submit"
                                className=" w-full bg-[#FCDFD4] py-4 text-sm"
                                handleClick={() => null}
                                text={status === 'pending' ? 'loading...' : "Create Account"}
                
                            />
                </div>
                <div className="flex justify-center items-center mt-8">
                            <nav className="flex gap-2">
                                <small className="text-base text-sm">Already Have an Account?</small>
                                <small className="text-base">
                                    <button
                                     onClick={() => router.push('/signin')}
                                     className="text-[#F25E26] text-sm">
                                        Sign in
                                    </button>
                                </small>
                            </nav>
                </div>
            </form>
        </div>
    </section>
  )
}

export default Page