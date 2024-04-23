import {useState} from 'react'
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";

type inputProps ={
    label:string,
    type:string,
    placeholder:string,
    name:string,
    register: any;
    errors:any
    showPassword?:boolean 
}

export const InputField =({label, type, placeholder, name, register, errors, showPassword}:inputProps)=>{
    const [toggle, setToggle] = useState(showPassword)

    const handleTogglePasswordVisibility=()=>{
        setToggle(!toggle)
    }

    return (
        <>
        <div className="relative flex flex-col">
            <label>{label}</label>
            <input name={name} type={toggle ? "text" :type} placeholder={placeholder} className={`px-5 h-12 focus:text-black border rounded w-auto xl:w-[350px] 2xl:w-[300px] md:w-[300px] xlw-[300px] lg:w-[300px]`}
             {...register(name, { required: true })}/>
             {showPassword && (
             <span onClick={handleTogglePasswordVisibility} className={`cursor-pointer absolute top-9 right-3 text-xl transition duration-200 ${toggle ? "text-blue-500" : "text-gray-400"
                }`}>{!toggle ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
)}

            <div className="text-xs text-rose-500 pt-1">
                {errors?.[name]?.message}
            </div>
        </div>
        </>
    )
}

export const SelectField =()=>{
    return (
        <>
        </>
    )
}

export const RadioButton =()=>{
    return (
        <>
        </>
    )
}