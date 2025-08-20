"use client";
import React from 'react';
import { InputField} from './FormField';
import { useState, useEffect } from "react";
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
  gender: boolean;
  pass?: string;
  address: string;
  state: string;
  lga: string;
  residential?: string;
}

interface ProfileFormProps {
  userData?: any;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ userData }) => {
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
    residential: yup.string().optional(),
  });


  // Prepare default values from userData
  const defaultValues = {
    first_name: userData?.first_name || userData?.firstname || '',
    last_name: userData?.last_name || userData?.lastname || '',
    email: userData?.email || '',
    Phone: userData?.phone || '',
    gender: userData?.gender !== undefined ? Boolean(userData?.gender) : false,
    address: userData?.address || '',
    state: userData?.state || '',
    lga: userData?.lga || '',
    residential: userData?.residential || userData?.residency || '',
  };

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormValues>({
    mode: "all",
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const [selectedState, setSelectedState] = useState(userData?.state || "");
  const [lgas, setLgas] = useState<string[]>([]);

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    const selectedState = state_and_LGA.find(state => state.state === value);
    setLgas(selectedState ? selectedState.lgas : []);
  };

  // Initialize LGAs when component mounts with existing userData
  useEffect(() => {
    if (userData?.state) {
      const selectedStateData = state_and_LGA.find(state => state.state === userData.state);
      if (selectedStateData) {
        setLgas(selectedStateData.lgas);
      }
    }
  }, [userData]);


  const handleSuccess = (data: any) => {
  /*   console.log(data, 'datttataaa', error) */

 /*  console.log(data, 'datttataaa') */

    if (data.status === 201 || data.status === 200) {
    /*   setSuccessModal(!successModal) */
      toast.success(`${data?.data?.message}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: () => router.push('/userprofile')
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
    } else if (data.status === 500) {
      toast.error(`${data?.data?.message || 'Internal Server Error'} `, {
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
    <div className='flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
    {/*   <ToastContainer closeOnClick /> */}
      <form onSubmit={handleSubmit(submitForm)} className='flex flex-col w-full space-y-6'>
        {/* First Name and Last Name Row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8'>
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

        {/* Email and Phone Row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8'>
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

        {/* Gender Section */}
        <div className="flex flex-col space-y-3">
          <label className='text-sm sm:text-base text-[#111111] font-Poppins font-medium'>Gender*</label>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6" >
            <div className="flex items-center">
              <input
                type="radio"
                id="male"
                {...register("gender", { required: true })}
                value="true"
                className="mr-3 w-4 h-4 text-[#F25E26] focus:ring-[#F25E26]"
              />
              <label
                htmlFor="male"
                className="text-sm sm:text-base text-[#111111] cursor-pointer"
              >
                Male
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="female"
                {...register("gender", { required: true })}
                value="false"
                className="mr-3 w-4 h-4 text-[#F25E26] focus:ring-[#F25E26]"
              />
              <label
                htmlFor="female"
                className="text-sm sm:text-base text-[#111111] cursor-pointer"
              >
                Female
              </label>
            </div>
          </div>
          {errors?.gender?.message && (
            <div className="text-xs sm:text-sm text-red-700 py-1">
              {String(errors.gender.message)}
            </div>
          )}
        </div>

        {/* Password Section */}
        <div className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6'>
          <div className='flex-1'>
            <InputField
              name='pass'
              type='text'
              placeholder='********'
              register={register}
              errors={errors}
              label='Password*'
              isdisabled
              classname='w-full p-3 bg-transparent outline-none'
            />
          </div>
          <div className='flex-shrink-0'>
            <p className='brand1 cursor-pointer w-fit text-sm sm:text-base hover:underline' onClick={setEditPassword}>
              Change password
            </p>
          </div>
        </div>

        {/* Address and State Row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8'>
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
              <div className='flex flex-col'>
                <label className='py-2 text-sm sm:text-base font-medium text-[#111111]'>State*</label>
                <select
                  {...register('state', { required: true })}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value);
                    handleStateChange(value);
                  }}
                  className='w-full h-12 rounded border px-3 sm:px-4 focus:text-black focus:border-[#F25E26] focus:outline-none transition-colors'
                >
                  <option value='' className='text-gray-500'>
                    Select a state
                  </option>
                  {state_and_LGA.map((state) => (
                    <option key={state.state} className='text-[#111111]' value={state.state}>
                      {state.state}
                    </option>
                  ))}
                </select>
                {errors?.state?.message && (
                  <div className='pt-1 text-xs sm:text-sm text-red-700'>
                    {String(errors.state.message)}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        {/* LGA and Residential Row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8'>
          <Controller
            name="lga"
            control={control}
            render={({ field }) => (
              <div className='flex flex-col'>
                <label className='py-2 text-sm sm:text-base font-medium text-[#111111]'>Local Government Area (LGA)*</label>
                <select
                  {...register('lga', { required: true })}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value);
                  }}
                  className='w-full h-12 rounded border px-3 sm:px-4 focus:text-black focus:border-[#F25E26] focus:outline-none transition-colors'
                >
                  <option value='' className='text-gray-500'>
                    Select LGA
                  </option>
                  {lgas.map((lga) => (
                    <option key={lga} value={lga} className='text-[#111111]'>
                      {lga}
                    </option>
                  ))}
                </select>
                {errors?.lga?.message && (
                  <div className='pt-1 text-xs sm:text-sm text-red-700'>
                    {String(errors.lga.message)}
                  </div>
                )}
              </div>
            )}
          />

          <div className='flex flex-col'>
            <InputField
              type='text'
              placeholder='Enter R.A Number'
              name='residential'
              register={register}
              errors={errors}
              label='Residential Agency Number (optional)'
            />
            <p className='text-xs sm:text-sm italic text-gray-500 mt-1'>
              (such as LASRRA etc.)
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex justify-center pt-6 sm:pt-8'>
          <DefaultButton
            text={status === 'pending' ? 'Updating...' : "Update Profile"}
            type='submit'
            className='w-full sm:w-auto px-8 py-3 sm:py-4 rounded-md bg-[#FCDFD4] hover:bg-[#F25E26] hover:text-white transition-colors duration-200 text-sm sm:text-base font-medium'
          />
        </div>
      </form>

      {/* Success Modal */}
      <div className={`${successModal ? 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50' : 'hidden'}`}>
        <Modal
          buttoncount={1}
          title='Profile Updated Successfully'
          icon={verify}
          buttontype='button'
          buttonclass='w-full rounded-md bg-[#FCDFD4] p-3 sm:p-4 hover:bg-[#F25E26] hover:text-white transition-colors duration-200'
          buttontext='Proceed to Profile'
          handleEvent={setSuccessModal}
        />
      </div>

      {/* Change Password Modal */}
      <div className={`${editPassword ? 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50' : 'hidden'}`}>
        <ChangePassword />
      </div>
    </div>
  );
};
