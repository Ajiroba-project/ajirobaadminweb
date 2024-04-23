"use client"
import { useRouter } from 'next/navigation'
import {RegistrationHeader, HeaderTitle} from '../component/Header'
import {SignInValidationSchema} from "@/helper/validation"
import {InputField} from "../component/FormField";
import { DefaultButton } from "../component/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const router = useRouter()

    type dataProps = {
        email: string;
        password: string;

    };

   const { reset, register, control, handleSubmit, formState: { errors }, trigger, watch, setValue,
    } = useForm({
        mode: "all",
        resolver: yupResolver(SignInValidationSchema),
    });

        const sumbitForm = async (data: dataProps) => {
        mutate({
            url: "/api/signin",
            payload: data
        });
    };


  return (
    <section>
      <RegistrationHeader/>
      <HeaderTitle title="Welcome Back" subtitle="Kindly Enter your Login Details" />

      <div className="flex justify-center mb-20  my-4">
        <form onSubmit={handleSubmit(sumbitForm)}>
          <div className="grid xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 2xl:grid-cols-1 grid-cols-1 gap-8 px-3 mt-12">
            <InputField name="email" label="Email Address/Phone Number" placeholder="Enter Email Address or Phone Number" type="text" register={register} errors={errors}/>
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
              text="Sign In"
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