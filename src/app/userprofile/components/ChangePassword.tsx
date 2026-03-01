// 'use client'
// import React, { useState } from 'react'
// import { InputField } from './FormField'
// import { yupResolver } from '@hookform/resolvers/yup'
// import { ChangePass } from './YupValidation'
// import { useForm } from 'react-hook-form'
// import { DefaultButton } from '@/app/component/Button'
// import { useAuthStore, userProfile } from '@/store/store'
// import { Modal } from './Modal'
// import verify from '../../asset/verify.svg'
// import { useMutateData } from '@/hooks/useMutateNewData'
// import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie'

// export const ChangePassword = () => {
//   const [success, setSuccess] = useState(false)

//   const { editPassword, setEditPassword, setSuccessModal } = userProfile(
//     state => ({
//       editPassword: state.editProfile,
//       setEditPassword: state.setEditPassword,
//       setSuccessModal: state.setSuccessModal
//     })
//   )

//     const router = useRouter();

//   const {
//     reset,
//     register,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({
//     mode: 'all',
//     resolver: yupResolver(ChangePass)
//   })

//   const Closefunc = () => {
//     setEditPassword()
//     setSuccess(false)
//     reset()
//   }




//   const handleSuccess = (data: any) => {
//     // console.log(data, 'datttataaa', error)

//     if (data.status === 201 || data.status === 200) {
//      setSuccess(true)
//     /*   toast.success(`${data?.data?.message}`, {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//         onClose: () => router.push('/profile')
//       }); */
//       reset();
//     } else if (data.status === 400 || data.status === 409) {
//       toast.error(`${data?.data?.message || 'Password doesnt match' } `, {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });
//       reset();
//     } else if (data.status === 401) {
//       toast.error(`${data?.data?.message || 'Authentication error'} `, {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });
//       reset();
//     }
//     else if (data.status === 500) {
//       toast.error(`${data?.data?.message || 'old_password'} `, {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });
//       reset();
//     }
//     else {
//       toast.error(`${'An Error Occured' }`, {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });
//       reset();
//     }
//   };

//   const handleError = (error: any) => {
//     console.log(data, 'datttataaa', error)
//     console.log(error, 'errrr')
//     toast.error(`${'An Error Occured'}`, {
//       position: "top-right",
//       autoClose: 2000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//     });
//     reset();
//   };


//   const { isLoggedIn, user, token } = useAuthStore(state => ({
//     isLoggedIn: state.isLoggedIn,
//     user: state.user,
//     token: state.token
//   }))


// const userToken =  Cookies.get('token') as string;


//   const { data, error, isError, isSuccess, mutate, status } = useMutateData(
//     "changeprofilepass",
//     handleSuccess,
//     handleError,
//   );



//   const submitForm = async (data: any) => {
//     // Simulate a successful form submission

//     // Add your form submission logic here
//     // console.log(data, 'datatat')
//     const payload = {
//       old_password: data?.oldpass,
//       new_password: data?.newpass
//     }

//      mutate({
//       url: "/api/changeprofilepass",
//       payload: { payload: payload, token: userToken },
//       token: userToken
//     });
//   }

//   return (
//         <section className="fixed left-0 top-0 z-50 flex h-full w-screen items-center justify-center bg-black bg-opacity-50 p-4">
//     {/*   <ToastContainer closeOnClick /> */}
//       {!success ? (
//         <div className='mb-8 flex h-auto flex-col items-center justify-center gap-6 rounded-md bg-white p-8'>
//           <form onSubmit={handleSubmit(submitForm)} className='flex flex-col'>
//             <div>
//               <InputField
//                 label='Old Password'
//                 type='password'
//                 placeholder='*****'
//                 name='oldpass'
//                 register={register}
//                 errors={errors}
//               />
//               <p className='text-xs italic'>minimum of 6 characters</p>
//             </div>
//             <div>
//               <InputField
//                 label='New Password'
//                 type='password'
//                 placeholder='*****'
//                 name='newpass'
//                 register={register}
//                 errors={errors}
//               />
//               <p className='text-xs italic'>minimum of 6 characters</p>
//             </div>
//             <div>
//               <InputField
//                 label='Confirm Password'
//                 type='password'
//                 placeholder='*****'
//                 name='confirmpass'
//                 register={register}
//                 errors={errors}
//               />
//               <p className='text-xs italic'>minimum of 6 characters</p>
//             </div>
//             <div className='mt-5 flex justify-between'>
//               {/* buttons */}
//               <DefaultButton
//                 text='Cancel'
//                 className='rounded-md border-2 border-[#F25E26] p-2 text-[#F25E26]'
//                 type='button'
//                 handleClick={Closefunc}
//               />
//               <DefaultButton
//                 /* text='Save' */
//                      text={status === 'pending' ? 'loading...' : "Save"}
//                 className='rounded-md bg-[#F25E26] p-2 px-4 text-white'
//                 type='submit'
//               />
//             </div>
//           </form>
//         </div>
//       ) : (
//         <Modal
//           title='Password Updated Successfully'
//           buttoncount={1}
//           icon={verify}
//           buttontype='button'
//           buttonclass='w-full rounded-md bg-[#FCDFD4] p-4 hover:bg-[#F25E26] hover:text-white'
//           buttontext='Proceed to Profile'
//           handleEvent={Closefunc}
//         />
//       )}
//     </section>
//   )
// }




'use client'
import React, { useState, useEffect } from 'react'
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
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    color: 'text-gray-400',
    strengthText: ''
  })

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      return { score: 0, feedback: '', color: 'text-gray-400', strengthText: '' };
    }

    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 6) score += 1;
    else feedback.push('At least 6 characters');

    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('One uppercase letter');

    // Lowercase check
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('One lowercase letter');

    // Number check
    if (/\d/.test(password)) score += 1;
    else feedback.push('One number');

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
    else feedback.push('One special character');

    // No common patterns
    const commonPatterns = ['123', 'abc', 'qwerty', 'password', 'admin', 'user'];
    if (!commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) score += 1;
    else feedback.push('No common patterns');

    // No repeating characters
    if (!/(.)\1{3,}/.test(password)) score += 1;
    else feedback.push('No repeating characters');

    let color = 'text-red-500';
    let strengthText = '';

    if (score >= 6) {
      color = 'text-green-500';
      strengthText = 'Strong';
    } else if (score >= 4) {
      color = 'text-yellow-500';
      strengthText = 'Medium';
    } else if (score >= 2) {
      color = 'text-orange-500';
      strengthText = 'Weak';
    } else {
      color = 'text-red-500';
      strengthText = 'Very Weak';
    }

    return {
      score,
      feedback: feedback.join(', '),
      color,
      strengthText
    };
  };

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
    watch,
    formState: { errors }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(ChangePass)
  })

  // Watch the new password field for real-time strength checking
  const newPassword = watch('newpass');

  useEffect(() => {
    if (newPassword) {
      const strength = checkPasswordStrength(newPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, feedback: '', color: 'text-gray-400', strengthText: '' });
    }
  }, [newPassword]);

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
              {newPassword && (
                <div className='mt-2'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-xs font-medium'>Password Strength:</span>
                    <span className={`text-xs font-bold ${passwordStrength.color}`}>
                      {passwordStrength.strengthText}
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score >= 6 ? 'bg-green-500' :
                        passwordStrength.score >= 4 ? 'bg-yellow-500' :
                        passwordStrength.score >= 2 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                    ></div>
                  </div>
                  {passwordStrength.feedback && (
                    <p className={`text-xs mt-1 ${passwordStrength.color}`}>
                      Missing: {passwordStrength.feedback}
                    </p>
                  )}
                </div>
              )}
              <p className='text-xs italic'>Password must be at least 6 characters with uppercase, lowercase, number, and special character</p>
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

