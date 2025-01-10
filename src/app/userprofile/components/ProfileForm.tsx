"use client";
import React from 'react';
import { InputField} from './FormField';
import { useState } from "react";
import { Modal } from './Modal';
import { DefaultButton } from '@/app/component/Button';
import { userProfile } from '@/store/store';
import { ChangePassword } from "./ChangePassword";
import verify from '../../asset/verify.svg';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { state_and_LGA } from '../../../app/static-data'
import { useForm, Controller } from "react-hook-form";
import { useMutateData } from "@/hooks/useMutateNewData";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/store'
import Cookies from 'js-cookie';

type ProfileFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  Phone: string;
  gender?: boolean;
  pass?: string;
  address: string;
  state: string;
  lga: string;
  residential?: string;
}

export const ProfileForm: React.FC = () => {
  const {
    successModal,
    setSuccessModal,
    setUserDetails,
    setEditProfile,
    editPassword,
    setEditPassword,
  } = userProfile((state) => ({
    successModal: state.successModal,
    setSuccessModal: state.setSuccessModal,
    setUserDetails: state.setUserDetails,
    setEditProfile: state.setEditProfile,
    editPassword: state.editPassword,
    setEditPassword: state.setEditPassword,
  }));


  const router = useRouter();

  const ProfileSchema = yup.object().shape({
    first_name: yup.string().required('First Name is required'),
    last_name: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    Phone: yup.string().required('Phone number is required'),
    address: yup.string().required('Address is required'),
    state: yup.string().required('State is required'),
    lga: yup.string().required('Local Government Area is required'),
    gender: yup.boolean().required("Gender is required"),
  });


  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(ProfileSchema),
  });


  const [selectedState, setSelectedState] = useState("");
  const [lgas, setLgas] = useState<string[]>([]);

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    const selectedState = state_and_LGA.find(state => state.state === value);
    setLgas(selectedState ? selectedState.lgas : []);
  };


  const handleSuccess = (data: any) => {
  /*   console.log(data, 'datttataaa', error) */

    if (data.status === 201 || data.status === 200) {
      setSuccessModal(!successModal)
      toast.success(`${data?.data?.message}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: () => router.push('/profile')
      });
      reset();
    } else if (data.status === 400 || data.status === 409) {
      toast.error(`${data?.data?.message || 'user with this email already exists.' || "user with this phone already exists."} `, {
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
    } else if (data.status === 401) {
      toast.error(`${data?.data?.message || 'Authentication error'} `, {
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


    else {
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
  /*   console.log(data, 'datttataaa', error)
    console.log(error, 'errrr') */
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


  const { isLoggedIn, user, token } = useAuthStore(state => ({
    isLoggedIn: state.isLoggedIn,
    user: state.user,
    token: state.token
  }))


  const userToken =  Cookies.get('token') as string;


  const { data, error, isError, isSuccess, mutate, status } = useMutateData(
    "editprofile",
    handleSuccess,
    handleError,
  );

  const submitForm = (data: ProfileFormValues) => {
    const { pass, ...restData } = data;
    mutate({
      url: "/api/editprofile",
      payload: { payload: restData, token: userToken },
      token: userToken
    });
  };


  return (
    <div className='flex flex-col'>
    {/*   <ToastContainer closeOnClick /> */}
      <form onSubmit={handleSubmit(submitForm)} className='flex flex-col'>
        <div className='flex flex-col gap-4 lg:flex-row lg:gap-10'>
          <InputField
            label='First Name*'
            name='first_name'
            type='text'
            placeholder='Enter first_name'
            register={register}
            errors={errors}
          />
          <InputField
            label='Last name*'
            name='last_name'
            type='text'
            placeholder='Enter last_name'
            register={register}
            errors={errors}
          />
        </div>
        <div className='flex flex-col gap-4 lg:flex-row lg:gap-10'>
          <InputField
            label='Email Address*'
            name='email'
            type='text'
            placeholder='Enter Email Address'
            register={register}
            errors={errors}
          />
          <InputField
            label='Phone Number*'
            type='text'
            placeholder='Enter Phone Number'
            name='Phone'
            register={register}
            errors={errors}
          />
        </div>

        <div className="flex flex-col   mt-2">
          <label className='  mb-2 text-sm text-[#111111] font-Poppins font-medium'>Gender</label>
          <div className="flex gap-4" >

            <div className="flex items-center">
              <label
                htmlFor="male"
                className=" mr-2 text-sm text-wdc-inactivebuttons"
              >
                Male
              </label>
              <input
                type="radio"
                id="male"
                {...register("gender", { required: true })}
                value="true"
                className="mr-2 text-wdc-inactivebutton"
              />

            </div>



            <div className="flex items-center mb-0">
              <label
                htmlFor="female"
                className=" mr-2 text-sm text-wdc-inactivebuttons"
              >
                Female
              </label>
              <input
                type="radio"
                id="female"
                {...register("gender", { required: true })}
                value="false"
                className=" text-wdc-inactivebutton"
              />

            </div>
          </div>

        </div>

        <div className="text-xs text-red-700 py-1">
          {errors?.gender?.message}
        </div>

        <div className='flex lg:items-center lg:flex-row flex-col py-2 lg:py-0'>
          <InputField
            name='pass'
            type='text'
            placeholder='********'
            register={register}
            errors={errors}
            label='Password*'
            isdisabled
            classname='lg:p-3 bg-transparent outline-none lg:w-1/2 w-full'
          />
          <div>
            <p className='brand1 cursor-pointer w-fit lg:text-md text-xs' onClick={setEditPassword}>
              Change password
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-4 lg:flex-row lg:gap-10'>
          <InputField
            label='Address*'
            name='address'
            type='text'
            placeholder='Enter Address'
            register={register}
            errors={errors}
          />

          <Controller
            name="state"
            control={control}
            render={({ field }) => (

              <div className='relative flex flex-col'>
                {<label className='py-2 text-sm'>{'State*'} </label>}
                <select
                  {...register('state', { required: true })}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value);
                    handleStateChange(value);
                  }}
                  className={`xl-[300px] h-12 w-auto rounded border px-5 focus:text-black md:w-[300px] lg:w-[300px] xl:w-[350px] 2xl:w-[300px]`}
                >
                  <option value='' className='text-wdc-textbody'>
                    Select a state
                  </option>

                  {state_and_LGA.map((state) => (

                    <option key={state.state} className='text-wdc-textbody' value={state.state}>
                      {state.state}
                    </option>
                  ))}


                </select>
                <div className='pt-1 text-xs text-rose-500'>
                  {errors?.state?.message}
                </div>
              </div>

            )}
          />
        </div>
        <div className='flex flex-col gap-4 pt-2 lg:flex-row lg:gap-10'>

          <Controller
            name="lga"
            control={control}
            render={({ field }) => (

              <div className='relative flex flex-col'>
                {<label className='py-2 text-sm'>{'Local Government Area(LGA)*'} </label>}
                <select
                  {...register('lga', { required: true })}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value);
                    // handleStateChange(value);
                  }}
                  className={`xl-[300px] h-12 w-auto rounded border px-5 focus:text-black md:w-[300px] lg:w-[300px] xl:w-[350px] 2xl:w-[300px]`}
                >
                  <option value='' className='text-wdc-textbody'>
                    Select lga
                  </option>

                  {lgas.map((lga) => (

                    <option key={lga} value={lga} className='text-wdc-textbody' >
                      {lga}
                    </option>
                  ))}


                </select>
                <div className='pt-1 text-xs text-rose-500'>
                  {errors?.lga?.message}
                </div>
              </div>


            )}
          />


          <div>
            <InputField
              type='text'
              placeholder='Enter R.A Number'
              name='residential'
              register={register}
              errors={errors}
              label='Residential Agency Number(optional)'
            />
            <p className='text-sm italic text-gray-300'>
              (such as LASRRA etc.)
            </p>
          </div>
        </div>
        <div className='mt-8 flex w-full justify-center'>
          <DefaultButton
            text={status === 'pending' ? 'loading...' : "Update Profile"}
            type='submit'
            className='w-[80%] rounded-md bg-[#FCDFD4] p-4 hover:bg-[#F25E26] hover:text-white'
          />
        </div>
      </form>

      <div className={`${successModal ? 'absolute left-0 top-0' : 'hidden'}`}>
        <Modal
          buttoncount={1}
          title='Profile Updated Successfully'
          icon={verify}
          buttontype='button'
          buttonclass='w-full rounded-md bg-[#FCDFD4] p-4 hover:bg-[#F25E26] hover:text-white'
          buttontext='Proceed to Profile'
          handleEvent={setSuccessModal}
        />
      </div>

      <div className={`${editPassword ? 'absolute left-0 top-0' : 'hidden'}`}>
        <ChangePassword />
      </div>
    </div>
  );
};
