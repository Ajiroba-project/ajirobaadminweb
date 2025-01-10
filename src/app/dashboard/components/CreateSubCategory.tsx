"use client";

import React, { useState } from "react";
import { useCategoryButtonClickStore, useStore } from "@/store/nav-store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { categories } from "@/app/data";
import { Header } from "@/app/components/Header";
import { CategoriesSchema, SubCategoriesSchema } from "@/helper/validation";
import { useMutateData } from "@/hooks/useMutateData";
import { DefaultButton } from "@/app/components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import { InputField, SelectField } from "@/app/components/FormField";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera } from "react-icons/fa6";
import Image from "next/image";
import Cookies from "js-cookie";

export const CraeteSubCategory = ({func}:any) => {
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

      const userToken = (Cookies.get("token") as string) || "";

 /*      const setCreateCategory = useCategoryButtonClickStore((state) => state.); */
        const setCreateCategory = useCategoryButtonClickStore((state) => state.subcategoryopen);
          const subcategoryOpen = useStore((state) => state.subcategoryOpen);
              const setSubCategoryOpen = useStore((state) => state.setCratesubcategor);

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
    resolver: yupResolver(SubCategoriesSchema),
    defaultValues: {
    /*   category_image: "", */ // Default value for image field
      description: "",
      subcategory: "",
  },
  });

 const handleSuccess = (data?: any) => {
  /*   setComment("");
    setCommentImage(""); */

    // console.log(data)
    if (data.status === 200 || data.status === 201) {
      toast.success(`${data?.data?.message || data?.data?.detail}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: () => router.push("/profile"),
      });
      // refetch();
        setSubCategoryOpen(false);
    } else if (
      data.status === 403 ||
      data.status === 404 ||
      data.status === 401 ||
      data.status === 500 || data.status === 409
    ) {
    /*   setComment("");
      setCommentImage(""); */
      toast.error(`${data?.data?.message || data?.data?.detail}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // refetch();
    setSubCategoryOpen(false);
    } else {
     /*  setComment("");
      setCommentImage(""); */
      toast.error(`${data?.data?.detail}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // refetch();
       setSubCategoryOpen(false);
    }
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
   setSubCategoryOpen(false);
  };

  const { data, error, isError, isSuccess, mutate, status } = useMutateData(
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
     /*    setSelectedImage(base64String); */
        setImagePreview(base64String);
       /*  setValue("category_image", base64String, { shouldValidate: true }); */
        setImageFile(file);
      /*   setValue("category_image", base64String, { shouldValidate: true }), base64String; */
      };
      reader.readAsDataURL(file);
    }
  };

   const handleFormSubmit = (data: any) => {
    console.log("Form Data:", data, imageFile); // Log form data

  /*   if (!imageFile) {
      setError("category_image", { type: "manual", message: "Image is required" });
      return;
    }

    if (imageFile.size > 2 * 1024 * 1024) {
      setError("category_image", { type: "manual", message: "Image size exceeds 2MB" });
      return;
    }
 */


    const payload = {
      ...data,
      // category_image: imagePreview,
    } as any;

    console.log("Form Data:", payload);
      /*    clearErrors("category_image"); */
   /*   mutate({
      url: "/api/categories/create", // Adjust API endpoint if needed
      payload: { ...data, image: imagePreview },
    });  */

     mutate({
      url: "/api/createcategory",
      payload: { payload: payload, tkn: userToken },
    });
  };

  return (
    <section className="flex flex-col ">
      <h2 className="text-center font-bold ">Create SubCategories</h2>
      <form className="flex flex-col mt-[1em] items-center " onSubmit={handleSubmit(handleFormSubmit)}>


  {/* Image Upload Section */}
       {/*  <div className="relative flex items-center justify-center mt-6">
          <div className="relative">
           <div className="flex justify-center items-center gap-4" >

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
 */}


        {/*   {errors.category_image && (
            <p className="text-red-500 text-sm mt-2">{errors.category_image.message}</p>
          )}
 */}

         <SelectField
          label="Category"
          name="category"
          register={register}
          errors={errors}
          options={categories}
        />
         {/*  <InputField
         label="Category"
          name="category"
          register={register}
          errors={errors}
          type="text"
        /> */}
        <InputField
          label="Sub Category"
          name="subcategory"
          register={register}
          errors={errors}
          type="text"
        />




        <div className="py-5">
          <DefaultButton
           /*  text="Create" */
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

