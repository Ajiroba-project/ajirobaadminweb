"use client";

import React from "react";
import { useStore } from "@/store/nav-store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { categories } from "@/app/data";
import {Header} from "@/app/components/Header"
import { CategoriesSchema } from "@/helper/validation";
import { useMutateData } from "@/hooks/useMutateData";
import { DefaultButton } from "@/app/components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import { InputField, SelectField } from "@/app/components/FormField";
import "react-toastify/dist/ReactToastify.css";

export const UpdateSubCategory = ({func}:any) => {
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  const router = useRouter();
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

  const handleCreate=()=>{
    func()
  }

  return (
    <section className="flex flex-col ">
      <h2 className="text-center font-bold ">Create Sub-categories</h2>
      <form className="flex flex-col mt-[1em] items-center ">
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
            type="button"
            handleClick={handleCreate}
            className=" bg-[#FCDFD4] p-4 text-sm w-[25em] hover:bg-[#F25E26] hover:text-white rounded-lg"
          />
        </div>
      </form>
    </section>
  );
};


