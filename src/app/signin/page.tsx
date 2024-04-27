"use client"
import { useRouter } from 'next/navigation'
import {RegistrationHeader, HeaderTitle} from '../component/Header'
import {SignInValidationSchema} from "@/helper/validation"
import { useMutateData } from "@/hooks/useMutateData";
import {InputField} from "../component/FormField";
import { DefaultButton } from "../component/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import {useAuthStore} from '@/store/nav-store';
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";


const Page = () => {
    const setAuthCookie = useAuthStore(state => state.setAuthCookie);
    const setUser = useAuthStore(state => state.setUser);
    const router = useRouter()
    
    type dataProps = {
        email_or_phone: string;
        password: string;

    };

   const { reset, register, control, handleSubmit, formState: { errors }, trigger, watch, setValue,
    } = useForm({
        mode: "all",
        resolver: yupResolver(SignInValidationSchema),
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
                onClose: () => router.push('/dashboard')

            })
            setAuthCookie(data?.data?.token, 1)
            setUser(data?.data);
            reset();


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
            reset();
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
        mutate({
            url: "api/signin/",
            payload: data
        });
    };


  return (
    <section>
      <ToastContainer closeOnClick />
      <RegistrationHeader/>
      <HeaderTitle title="Welcome Back" subtitle="Kindly Enter your Login Details" />
      <div className="flex justify-center mb-15  my-4">
        <form onSubmit={handleSubmit(sumbitForm)}>
          <div className="grid xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 2xl:grid-cols-1 grid-cols-1 gap-6 px-3 mt-10">
            <InputField name="email_or_phone" label="Email Address/Phone Number" placeholder="Enter Email Address or Phone Number" type="text" register={register} errors={errors}/>
            <InputField name="password" label="Password" placeholder="*****" type="password" register={register} errors={errors} showPassword={true}/>
          </div>
          
            <div className="flex flex-wrap gap-2 justify-between items-center mt-4 mx-3">
                <div>
                    <input
                        type="checkbox"
                        id="agreement"
                        value="true"
                        className="mr-2 text-wdc-inactivebutton"
                    />
                    <span className="text-sm">
                        Remember me

                    </span>
                </div>
                <div onClick={() => router.push('forgot-password')} >
                    <span className="cursor-pointer" >Forgot password?</span>
                </div>
            </div>
          <div className="flex justify-center items-center mt-6 mx-3">
            <DefaultButton
              type="submit"
              className=" w-full bg-[#FCDFD4] text-sm py-4"
              text={status === 'pending' ? 'loading...' : "Sign In"}
             handleClick={() => null}/>
          </div>

            <div className="flex justify-center items-center mt-4">
                <small className="text-base">
                    Don`t have an account?
                    <span onClick={() => router.push('/signup')} className="text-[#F25E26] text-sm  cursor-pointer "> Sign up</span>
                </small>
            </div>
        </form>
      </div>
    </section>
  )
}

export default Page