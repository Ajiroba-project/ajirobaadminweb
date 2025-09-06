"use client";

import React, { useState } from "react";
import { useCategoryButtonClickStore, useStore } from "@/store/nav-store";
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
import Cookies from "js-cookie";

export const CraeteCategory = ({func}:any) => {
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  const router = useRouter();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

      const userToken = (Cookies.get("token") as string) || "";


  const setCategoryOpen = useStore((state) => state.setCategoryOpen);

  const {
    reset,
    register,
     setValue,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(CategoriesSchema),
    defaultValues: {
      description: "",
      category: "",
  },
  });

const handleSuccess = (data?: any) => {
  if (data?.status === 200 || data?.data?.status === 'success' || data?.status === 201) {
    console.log(data, "data");
    toast.success(`${data?.data?.message || "Success!"}`);
   /*  setSubCategoryOpen(false); */
  }
  refetch?.();
};

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
   /*    setCategoryOpen(false); */
  };

  const { data, error, isError, isSuccess, mutate, status, refetch } = useMutateData(
    "create-category",
    handleSuccess,
    handleError
  );
  const handleEdit = () => {
    // func();
    console.log(data, "data");
  };




  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreviews([base64String]);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

   const handleFormSubmit = (data: any) => {

    const payload = {
      ...data,
      category_image: imagePreviews,
    } as any;


    // console.log(payload, "payload");

      mutate({
      url: "/api/createcategory",
      payload: { payload: payload, tkn: userToken },
    });
  };

  return (
    <section className="flex flex-col ">
      <h2 className="text-center font-bold ">Create Categories</h2>
      <form className="flex flex-col mt-[1em] items-center " onSubmit={handleSubmit(handleFormSubmit)}>

        <div className="relative flex items-center justify-center mt-6">
          <div className="relative">
           <div className="flex justify-center items-center gap-4" >

             <div className="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center">
              {imagePreviews ? (
                <Image src={imagePreviews[0]} alt="Preview" width={96} height={96} className="w-full h-full object-cover rounded-full" />
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

          <InputField
         label="Category"
          name="category"
          register={register}
          errors={errors}
          type="text"
        />
        <InputField
          label="Description"
          name="description"
          register={register}
          errors={errors}
          type="text"
        />

        <div className="py-5">
          <DefaultButton
             text={status === 'pending' ? 'loading...' : "Create"}
            type="submit"
            handleClick={handleEdit}
            className=" bg-[#FCDFD4] p-4 text-sm w-[25em] hover:bg-[#F25E26] hover:text-white rounded-lg"
          />
        </div>
      </form>
    </section>
  );
};

