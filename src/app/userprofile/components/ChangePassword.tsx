'use client'
import React, { useState } from 'react'
import { InputField } from './FormField'
import { yupResolver } from '@hookform/resolvers/yup'
import { ChangePass } from './YupValidation'
import { useForm } from 'react-hook-form'
import { DefaultButton } from '@/app/component/Button'
import { useAuthStore, userProfile } from '@/store/store'
import { Modal } from './Modal'
import verify from '../../asset/verify.svg'
import { useMutateData } from '@/hooks/useMutateNewData'
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'

export const ChangePassword = () => {
  const [success, setSuccess] = useState(false)

  const { editPassword, setEditPassword, setSuccessModal } = userProfile(
    state => ({
      editPassword: state.editProfile,
      setEditPassword: state.setEditPassword,
      setSuccessModal: state.setSuccessModal
    })
  )

    const router = useRouter();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(ChangePass)
  })

  const Closefunc = () => {
    setEditPassword()
    setSuccess(false)
    reset()
  }




  const handleSuccess = (data: any) => {
    // console.log(data, 'datttataaa', error)

    if (data.status === 201 || data.status === 200) {
     setSuccess(true)
    /*   toast.success(`${data?.data?.message}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: () => router.push('/profile')
      }); */
      reset();
    } else if (data.status === 400 || data.status === 409) {
      toast.error(`${data?.data?.message || 'Password doesnt match' } `, {
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
    else if (data.status === 500) {
      toast.error(`${data?.data?.message || 'old_password'} `, {
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
      toast.error(`${'An Error Occured' }`, {
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
    console.log(data, 'datttataaa', error)
    console.log(error, 'errrr')
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
    "changeprofilepass",
    handleSuccess,
    handleError,
  );



  const submitForm = async (data: any) => {
    // Simulate a successful form submission

    // Add your form submission logic here
    // console.log(data, 'datatat')
    const payload = {
      old_password: data?.oldpass,
      new_password: data?.newpass
    }

     mutate({
      url: "/api/changeprofilepass",
      payload: { payload: payload, token: userToken },
      token: userToken
    });
  }

  return (
        <section className="fixed left-0 top-0 z-50 flex h-full w-screen items-center justify-center bg-black bg-opacity-50 p-4">
    {/*   <ToastContainer closeOnClick /> */}
      {!success ? (
        <div className='mb-8 flex h-auto flex-col items-center justify-center gap-6 rounded-md bg-white p-8'>
          <form onSubmit={handleSubmit(submitForm)} className='flex flex-col'>
            <div>
              <InputField
                label='Old Password'
                type='password'
                placeholder='*****'
                name='oldpass'
                register={register}
                errors={errors}
              />
              <p className='text-xs italic'>minimum of 6 characters</p>
            </div>
            <div>
              <InputField
                label='New Password'
                type='password'
                placeholder='*****'
                name='newpass'
                register={register}
                errors={errors}
              />
              <p className='text-xs italic'>minimum of 6 characters</p>
            </div>
            <div>
              <InputField
                label='Confirm Password'
                type='password'
                placeholder='*****'
                name='confirmpass'
                register={register}
                errors={errors}
              />
              <p className='text-xs italic'>minimum of 6 characters</p>
            </div>
            <div className='mt-5 flex justify-between'>
              {/* buttons */}
              <DefaultButton
                text='Cancel'
                className='rounded-md border-2 border-[#F25E26] p-2 text-[#F25E26]'
                type='button'
                handleClick={Closefunc}
              />
              <DefaultButton
                /* text='Save' */
                     text={status === 'pending' ? 'loading...' : "Save"}
                className='rounded-md bg-[#F25E26] p-2 px-4 text-white'
                type='submit'
              />
            </div>
          </form>
        </div>
      ) : (
        <Modal
          title='Password Updated Successfully'
          buttoncount={1}
          icon={verify}
          buttontype='button'
          buttonclass='w-full rounded-md bg-[#FCDFD4] p-4 hover:bg-[#F25E26] hover:text-white'
          buttontext='Proceed to Profile'
          handleEvent={Closefunc}
        />
      )}
    </section>
  )
}

