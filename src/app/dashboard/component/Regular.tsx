import {InputField, SelectField, TextAreaField, FileUpload} from "@/app/component/FormField"
import  { useState } from 'react';
import {DefaultButton} from "@/app/component/Button"
import {Categories} from "@/app/data"
import Image from "react"
import { useForm } from "react-hook-form";
import {UploadSchema} from "@/helper/validation"
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import { useMutateData } from "@/hooks/useMutateData";
import "react-toastify/dist/ReactToastify.css";

export const Regular = () => {

     const { reset, register, control, handleSubmit, formState: { errors }, trigger, watch, setValue,
    } = useForm({
        mode: "all",
        resolver: yupResolver(UploadSchema),
    });
const options=["Foodstuff", "Fashion"]

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     
    };




  return (
    <section className="my-10">
        {/* <ToastContainer closeOnClick /> */}
        <h1 className={`xl:text-2xl 2xl:text-2xl md:text-2xl text-base font-normal pb-4 leading-tight tracking-tight underline `}>Product Details</h1>
        <hr />

        <form className="flex  gap-8 my-4 lg:flex-row flex-col-reverse">
            <div className=" ">
                <div className="flex flex-col">
                    <FileUpload name="upload" register={register} errors={errors}  />
                </div>
                {/* preview */}
                <div></div>

                <div className="flex gap-2 py-8 flex-col lg:flex-row md:flex-row">
                    <InputField name="selling_price" label="Selling Price" type="text" placeholder="₦1234" register={register} errors={errors} classname="px-5 h-12 focus:text-black border rounded"/>
                    <InputField name="discount" label="Discount" type="text" placeholder="₦100" register={register} errors={errors} classname="px-5 h-12 focus:text-black border rounded"/>

                </div>
            </div>

            <div>
                <div className="flex-col flex gap-3 ">
                    <InputField name="product_name" label="Product Name" type="text" placeholder="Rice" register={register} errors={errors} />
                    <SelectField name="product_category" label="Product Category" register={register} errors={errors} options={options}/>
                    <SelectField name="sub_category" label="Sub Category" register={register} errors={errors} options={options}/>
                    <TextAreaField name="description" label="Product Description" register={register} errors={errors} placeholder={"Describe your product here..."}/>
                </div>
           </div> 
        </form>

   <hr />
        <div className="py-4">
            <DefaultButton text="Upload" type="submit" handleClick={()=>null} className=" bg-[#FCDFD4] p-4 text-sm w-1/5 hover:shadow"/>
        </div>
    </section>
  )
}

