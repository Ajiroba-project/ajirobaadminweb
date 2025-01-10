import { useState } from 'react'
import { FaRegEyeSlash } from 'react-icons/fa'
import { FaRegEye } from 'react-icons/fa6'
import { FiUpload } from 'react-icons/fi'

type inputProps = {
  name: string
  type: string
  label?: string
  placeholder?: string
  register?: any
  errors?: any
  classname?: any
  value?: string
  isdisabled?: boolean
}
type selectProps = {
  name: inputProps['name']
  label?: inputProps['label']
  register: inputProps['register']
  errors: inputProps['errors']
  options?: any
  multiple?: boolean
  isdisabled?: boolean
  showlabel?: boolean
}
type textareaProps = {
  name: inputProps['name']
  label: inputProps['label']
  register: inputProps['register']
  errors: inputProps['errors']
  placeholder: inputProps['placeholder']
  isdisabled?: boolean
}
type fileUpoadProps = {
  // hangleChange : ()=> void,
  label: string
  name: inputProps['name']
  register: inputProps['register']
  errors: inputProps['errors']
}

export const InputField = ({
  label,
  type,
  placeholder,
  name,
  register,
  errors,
  classname,
  value,
  isdisabled
}: inputProps) => {
  const [toggle, setToggle] = useState(false)

  const handleTogglePasswordVisibility = () => {
    setToggle(!toggle)
  }

  return (
    <>
      <div className='relative flex flex-col'>
        {label && <label className='py-2 text-sm'>{label}</label>}
        <input
          name={name}
          type={toggle ? 'text' : type}
          placeholder={placeholder}
            placeholder-gray-500
          className={`${isdisabled ? 'cursor-not-allowed' : ''} ${classname ? classname : ' placeholder-[#A09F9F] text-sm font-medium font-Poppins  text-[#111111]  xlw-[300px] h-12 w-auto rounded border px-5 focus:text-black md:w-[300px] lg:w-[300px] xl:w-[350px] 2xl:w-[300px]'}`}
          {...register(name, { required: true })}
          disabled={isdisabled}
        />

        {type === 'password' || type === 'Password' ? (
          <span
            onClick={handleTogglePasswordVisibility}
            className={`absolute right-3 top-[3.3rem] cursor-pointer  text-xl transition duration-200 ${
              toggle ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            {toggle ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        ) : null}

        <div className='pt-1 text-xs text-rose-500'>
          {errors?.[name]?.message}
        </div>
      </div>
    </>
  )
}

export const InputFieldRounded = ({
  label,
  type,
  placeholder,
  name,
  register,
  errors,
  classname,
  value,
  isdisabled
}: inputProps) => {
  const [toggle, setToggle] = useState(false)

  const handleTogglePasswordVisibility = () => {
    setToggle(!toggle)
  }

  return (
    <>
      <div className='relative flex flex-col'>
        {label && <label className='py-2 text-sm'>{label}</label>}
        <input
          name={name}
          type={toggle ? 'text' : type}
          placeholder={placeholder}
            placeholder-gray-500
          className={`${isdisabled ? 'cursor-not-allowed' : ''} ${classname ? classname : ' placeholder-[#A09F9F] text-sm font-medium font-Poppins  text-[#111111]  xlw-[300px] h-12 w-auto rounded-lg border px-5 focus:text-black md:w-[300px] lg:w-[300px] xl:w-[350px] 2xl:w-[300px]'}`}
          {...register(name, { required: true })}
          disabled={isdisabled}
        />

        {type === 'password' || type === 'Password' ? (
          <span
            onClick={handleTogglePasswordVisibility}
            className={`absolute right-3 top-[3.3rem] cursor-pointer  text-xl transition duration-200 ${
              toggle ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            {toggle ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        ) : null}

        <div className='pt-1 text-xs text-rose-500'>
          {errors?.[name]?.message}
        </div>
      </div>
    </>
  )
}

export const SelectField = ({
  showlabel,
  label,
  name,
  register,
  errors,
  options,
  multiple
}: selectProps) => {
  return (
    <div className='relative flex flex-col'>
      {showlabel && <label className='py-2 text-sm'>{label} </label>}
      <select
        {...register(name, { required: true })}
        name={name}
        className={`xl-[300px] h-12 w-auto rounded border px-5 focus:text-black md:w-[300px] lg:w-[300px] xl:w-[350px] 2xl:w-[300px]`}
      >
        <option value='' className='text-wdc-textbody'>
          {label ? ` Select  ${label}` : ''}
        </option>
        {options.map((val: string, key: number) => (
          <option key={key} className='text-wdc-textbody' value={val}>
            {val}
          </option>
        ))}
      </select>
      <div className='pt-1 text-xs text-rose-500'>
        {errors?.[name]?.message}
      </div>
    </div>
  )
}
export const TextAreaField = ({
  label,
  name,
  register,
  errors,
  placeholder
}: textareaProps) => {
  return (
    <div className='relative flex flex-col '>
      <label className='py-2 text-sm'>{label}: </label>
      <textarea
        name={name}
        className={`xlw-[300px] h-24 w-auto resize-none rounded border p-4 px-5 focus:text-black md:w-[300px] lg:w-[300px] xl:w-[350px] 2xl:w-[300px]`}
        {...register(name, { required: true })}
        placeholder={placeholder}
      ></textarea>
      <div className='pt-1 text-xs text-rose-500'>
        {errors?.[name]?.message}
      </div>
    </div>
  )
}

export const MutipleUpload = ({
  name,
  errors,
  label,
  register
}: fileUpoadProps) => {
  return (
    <div className='flex flex-col'>
      <label htmlFor='upload-files'>
        <p className='py-2'>{label}:</p>
        <span className='relative flex h-[20rem] w-auto cursor-pointer flex-col items-center justify-center rounded-md bg-gray-50 shadow hover:bg-gray-100'>
          <FiUpload className='text-4xl' />
          <div className='flex flex-col items-center justify-center pb-6 pt-5'>
            <p className='mb-2 text-xl text-gray-500 '>SelectFile to upload</p>
            <p className='mb-2 text-xs text-gray-500 '>
              you may upload up to 4 images & video
            </p>
          </div>
        </span>
        <input
          id='upload-files'
          type='file'
          accept='image/*, video/*'
          max='5'
          className='hidden pt-6 '
          multiple
          {...register(name, { required: true })}
        />
      </label>
      <div className='pt-1 text-xs text-rose-500'>
        {errors?.[name]?.message}
      </div>
    </div>
  )
}

export const RadioButton = () => {
  return <></>
}
