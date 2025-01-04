import {useState} from 'react'
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";

type inputProps ={
    label:string,
    type:string,
    placeholder?:string,
    name:string,
    register?: any,
    errors?:any,
    showPassword?:boolean,
    classname?:any,
    value?:string
    isdisabled?:boolean
}
type selectProps ={
    name:inputProps["name"],
    label:inputProps["label"],
    register:inputProps["register"],
    errors:inputProps["errors"],
    options?:any
    multiple?:boolean
    isdisabled?:boolean
    classname?:any,
}
type textareaProps ={
    name:inputProps["name"],
    label:inputProps["label"],
    register:inputProps["register"],
    errors:inputProps["errors"],
    placeholder:inputProps["placeholder"],
    isdisabled?:boolean
   classname?:any,
}
type fileUpoadProps ={
    // hangleChange : ()=> void,
    label:string;
    name:inputProps["name"],
    register:inputProps["register"],
    errors:inputProps["errors"],
       classname?:any,

}


interface CheckboxProps {
  label: string;
  name: string;
  register: any; // Replace `any` with the correct type if using TypeScript and a specific form library like React Hook Form
  errors?: any;  // Replace with appropriate error type
  options: string[]; // Array of options for the checkboxes
  classname?: string; // Optional custom className for styling
}


export const CheckboxField = ({
  label,
  name,
  register,
  errors,
  options,
  classname,
}: CheckboxProps) => {
  return (
    <div className="relative flex flex-col">
      <label className="py-2 font-Poppins text-sm text-[#353131]">{label}</label>
      <div className={`flex flex-col gap-2 ${classname ? classname : ""}`}>
        {options.map((option: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register(name, { required: true })}
              value={option}
              id={`${name}-${index}`}
              className="h-4 w-4 border-gray-300 rounded focus:ring focus:ring-blue-500"
            />
            <label htmlFor={`${name}-${index}`} className="text-sm text-[#353131]">
              {option}
            </label>
          </div>
        ))}
      </div>
      <div className="text-xs text-rose-500 pt-1">
        {errors?.[name]?.message}
      </div>
    </div>
  );
};

export const InputField =({label, type, placeholder, name, register, errors, showPassword, classname, value}:inputProps)=>{
    const [toggle, setToggle] = useState(showPassword)

    const handleTogglePasswordVisibility=()=>{
        setToggle(!toggle)
    }

    return (
        <>
        <div className="relative flex flex-col">
            <label className="py-2 font-Poppins text-sm text-[#353131]">{label}</label>
            <input name={name} type={toggle ? "text" :type} placeholder={placeholder} className={`${classname ? classname :"px-5 h-12 focus:text-black border rounded w-auto xl:w-[350px] 2xl:w-[300px] md:w-[300px] xlw-[300px] lg:w-[300px]"}`}
             {...register(name, { required: true })}/>
             {showPassword && (
             <span onClick={handleTogglePasswordVisibility} className={`cursor-pointer absolute top-14 right-3 text-xl transition duration-200 ${toggle ? "text-blue-500" : "text-gray-400"
                }`}>{toggle ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
)}

            <div className="text-xs text-rose-500 pt-1">
                {errors?.[name]?.message}
            </div>
        </div>
        </>
    )
}

export const SelectField =({label, name, register, errors, options, classname, multiple}:selectProps)=>{
    return (
        <div className="relative flex flex-col">
            <label className="py-2 font-Poppins text-sm text-[#353131]">{label} </label>
             <select {...register(name, { required: true })} name={name} className={`${classname ? classname : "px-5 h-12 focus:text-black border rounded w-auto xl:w-[350px] 2xl:w-[300px] md:w-[300px] xl-[300px] lg:w-[300px]"}  `} >
                <option value="" className="text-wdc-textbody">
                    Select a {label}
                </option>
                {options.map((val:string, key:number) => (
                    <option key={key} className="text-wdc-textbody" value={val}>
                        {val}
                    </option>
                ))}
            </select>

            <div className="text-xs text-rose-500 pt-1">
                {errors?.[name]?.message}
            </div>
        </div>
    )
}
export const TextAreaField =({label, name, register, errors, classname, placeholder}:textareaProps)=>{
    return (
        <div className="relative flex flex-col ">
       <label className="py-2 font-Poppins text-sm text-[#353131]">{label} </label>
            <textarea name={name} className={`${classname ? classname : "resize-none px-5 h-24 focus:text-black border rounded w-auto xl:w-[350px] 2xl:w-[300px] md:w-[300px] xlw-[300px] lg:w-[300px] p-4"}  `} {...register(name, { required: true })} placeholder={placeholder}>

            </textarea>
            <div className="text-xs text-rose-500 pt-1">
                {errors?.[name]?.message}
            </div>
        </div>
    )
}

export const MutipleUpload =({name,errors, label, register, }:fileUpoadProps)=>{
    return (
        <div className="flex flex-col">
            <label htmlFor="upload-files">
              <p className="py-2">{label}:</p>
              <span className="bg-gray-50 relative rounded-md shadow hover:bg-gray-100 h-[20rem] w-auto flex justify-center items-center cursor-pointer flex-col">
                <FiUpload className="text-4xl" />
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-xl text-gray-500 ">
                    SelectFile to upload
                  </p>
                  <p className="mb-2 text-xs text-gray-500 ">
                    you may upload up to 4 images & video
                  </p>
                </div>
              </span>
              <input
                id="upload-files"
                type="file"
                accept="image/*, video/*"
                max="5"
                className="pt-6 hidden "
                multiple
                {...register(name, { required: true })}
              />
            </label>
            <div className="text-xs text-rose-500 pt-1">
              {errors?.[name]?.message}
            </div>
        </div>
    )
}

export const RadioButton =()=>{
    return (
        <>
        </>
    )
}
