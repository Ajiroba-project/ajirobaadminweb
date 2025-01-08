"use client";

import React, { useState } from "react";
import { useStore } from "@/store/nav-store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { categories } from "@/app/data";
import { Header } from "@/app/components/Header";
import { CategoriesSchema } from "@/helper/validation";
import { useMutateData } from "@/hooks/useMutateData";
import { DefaultButton } from "@/app/components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import { InputField, SelectField } from "@/app/components/FormField";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera } from "react-icons/fa6";
import Image from "next/image";

export const CraeteCategory = ({func}:any) => {
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(CategoriesSchema),
  });

  const handleSuccess = () => {};
  const handleError = (error: any) => {
    toast.error(`${"An Error Occured"}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    reset();
  };

  const { data, error, isError, isSuccess, mutate, status } = useMutateData(
    "create-category",
    handleSuccess,
    handleError
  );
  const handleEdit = () => {
    // func();
    console.log(data, 'data')
  };


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="flex flex-col ">
      <h2 className="text-center font-bold ">Edit Sub-categories</h2>
      <form className="flex flex-col mt-[1em] items-center ">


  {/* Image Upload Section */}
        <div className="relative flex items-center justify-center mt-6">
          <div className="relative">
           <div className="flex justify-center items-center gap-4" >
          {/*   <div>
                <h1>Upload Image</h1>
            </div> */}
             <div className="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center">
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" width={96} height={96} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="text-gray-500">
                  <FaCamera size={24} />
                </div>
              )}
            </div>
           </div>
            <input
              type="file"
              accept="image/*"
              className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
            <div onClick={()=> handleImageChange} className=" cursor-pointer absolute bottom-2 right-0 bg-[#F25E26] p-1 rounded-full text-white">
              <FaCamera size={12} />
            </div>
          </div>
        </div>



        <SelectField
          label="Category"
          name="category"
          register={register}
          errors={errors}
          options={categories}
        />
        <InputField
          label="Subcategory"
          name="subcategory"
          register={register}
          errors={errors}
          type="text"
        />




        <div className="py-5">
          <DefaultButton
            text="Create"
            type="submit"
            handleClick={handleEdit}
            className=" bg-[#FCDFD4] p-4 text-sm w-[25em] hover:bg-[#F25E26] hover:text-white rounded-lg"
          />
        </div>
      </form>
    </section>
  );
};
