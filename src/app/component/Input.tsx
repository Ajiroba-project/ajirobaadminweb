import { useState } from "react";

interface InputProps {
    label?: string;
    type: string;
    name: string;
    placeholder: string;
    register: any;
    errors?: any;
    className?: string;
    HiEye?: any;
    HiEyeSlash?: any;
}

const Input: React.FC<InputProps> = ({
    label,
    type,
    name,
    placeholder,
    register,
    errors,
    className,
    HiEyeSlash,
    HiEye,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col">
            {label && (<label htmlFor={name} className="text-sm">
                {label}*
            </label>)}
            <div className="relative">
                <input
                    id={name}
                    type={showPassword ? "text" : type}
                    name={name}
                    placeholder={placeholder}
                    className={`px-8 h-12 focus:text-black border rounded w-auto xl:w-[300px] 2xl:w-[300px] md:w-[300px] xlw-[300px] lg:w-[300px] ${className || ""}`}
                    {...register(name, { required: true })} // Spread validation errors
                />


                <span onClick={handleTogglePasswordVisibility} className={`cursor-pointer absolute top-3 right-3 text-xl transition duration-200 ${showPassword ? "text-blue-500" : "text-gray-400"
                    }`} >{showPassword ? HiEyeSlash : HiEye}</span>
            </div>
            <div className="text-xs text-red-700">{errors?.[name]?.message}</div>
        </div>
    );
};

export default Input;
