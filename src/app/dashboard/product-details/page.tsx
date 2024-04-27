'use client'
import {useState} from "react"
import {RegistrationHeader} from '@/app/component/Header';
import {DefaultButton} from "@/app/component/Button";
import {InputField, SelectField, TextAreaField} from "@/app/component/FormField";
import Image from "next/image"
import { useRouter } from 'next/navigation'


const Page =()=>{
    const [selectedImg, setSelectedImg]= useState<any>([])
    
    const router = useRouter()
    
    return (
        <section className="flex flex-col">
            <div className="w-full bg-gray-100">
                <RegistrationHeader/>
                <p className="lg:px-14 px-7  text-[#F25E26] underline cursor-pointer" >Back</p>
            </div>
            <span className="w-full bg-gray-100">
                <h1 className="text-2xl text-center py-2">Regular Product Upload</h1>
            </span>

            <form className="sm:flex-col md:flex-row flex-col lg:flex-row flex mx-8 gap-4 py-8 justify-center items-center container ">

                <div className="">
            <div className="grid grid-rows-3 grid-flow-col gap-4 relative">
            {/* One column on smaller screens, three on medium+ */}
                {selectedImg &&
                selectedImg.map((val: string, key: number) => (
                    <div
                    key={key}
                    className={`col-span-1 ${
                        key === selectedImg.length - 1 && "row-span-3 col-span-3"
                    }`}
                    >
                    {/* Always col-span-1, md:col-span-2 for last image */}
                    <Image src={val} alt="preview" width={80} height={80} className="" />
                    {/* <span
                        className="absolute top-0 right-0 bg-rose-400 text-white rounded-full text-xs p-2 cursor-pointer"
                        onClick={() => RemoveImg(val)}
                    >
                        X
                    </span> */}
                    </div>
                ))}
          </div>
                </div>

                {/* <div className="flex gap-2">
                    <InputField label="Product name" type="text" name="product name" />
                    <SelectField label="Sub categories" name="sub categories" />
                    <TextAreaField label="description" name="textarea" />
                    <div className="flex gap-2 py-8 flex-col lg:flex-row md:flex-row ">
                        <InputField
                        name="selling_price"
                        label="Selling Price"
                        type="text"
                        placeholder="₦1234"
                        // register={register}
                        // errors={errors}
                        classname="px-5 h-12 focus:text-black border rounded "
                        />
                        <InputField
                        name="discount"
                        label="Discount"
                        type="text"
                        placeholder="₦100"
                        // register={register}
                        // errors={errors}
                        classname="px-5 h-12 focus:text-black border rounded"
                        />
                    </div>
                </div> */}
                
            </form>

            <DefaultButton text={"Upload"} type={"submit"} handleClick={() => null} className="bg-[#FCDFD4] p-4 text-sm w-[20em]"/>
           
        </section>
    )
}

export default Page