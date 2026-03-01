"use client";

import React, { useState } from "react";
import { useCategoryButtonClickStore, useStore } from "@/store/nav-store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { SubCategoriesSchema } from "@/helper/validation";
import { useMutateData } from "@/hooks/useMutateData";
import { DefaultButton } from "@/app/components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { InputField, SelectField } from "@/app/components/FormField";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useQueryData } from "@/hooks/useQueryData";
import { useGetDatanew } from "@/hooks/useGetData";

interface Subcategory {
  id: string;
  subcategory: string;
  name?: string;
  category?: string;
}

interface Category {
  [x: string]: any;
  category: string;
  subcategories: Subcategory[];
}

interface CategoryResponse {
  data: Category[];
}

export const CraeteSubCategory = ({ func }: any) => {
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const userToken = (Cookies.get("token") as string) || "";

  let urlsub = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/categories_and_subcategories/`;

  const {
    data: catandsubInfo,
    isLoading: catLoading,
    error: catError,
  } = useGetDatanew(urlsub, "get_catandsubcat_details", userToken || " ");

  const catnew = catandsubInfo?.data?.map(
    (cat: { category: any; id: any; subcategories: any }) => ({
      label: cat.category,
      value: cat.id,
      id: cat.id,
      subcategories: cat.subcategories,
    }),
  );

  const setSubCategoryOpen = useStore((state) => state.subcategoryOpen);

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
      subcategory: "",
      category: "",
    },
  });

 /*  const handleSuccess = (data?: any) => {
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
        onClose: () => router.push("/dashboard/category"),
      });
      setSubCategoryOpen(false);
      setSubCategoryOpen(false);
    } else if (
      data.status === 403 ||
      data.status === 404 ||
      data.status === 401 ||
      data.status === 500 ||
      data.status === 409
    ) {
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
      setSubCategoryOpen(false);
    } else {
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
      setSubCategoryOpen(false);
    }
  }; */


const handleSuccess = (data?: any) => {
  if (data?.status === 200 || data?.status === 201) {
    toast.success(`${data?.data?.message || "Success!"}`);
   /*  setSubCategoryOpen(false); */
  }
};


  const handleError = (error: any) => {

      /*   setSubCategoryOpen(false); */
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
   /*  setSubCategoryOpen(false); */
  };

  const { data, error, isError, isSuccess, mutate, status } = useMutateData(
    "create-subcategory",
    handleSuccess,
    handleError,
  );

  const handleFormSubmit = (data: any) => {
    const payload = {
      ...data,
    } as any;
    mutate({
      url: "/api/createsubcategory",
      payload: { payload: payload },
    });
  };

  return (
    <section className="flex flex-col ">
      <h2 className="text-center font-bold ">Create SubCategories</h2>
      <form
        className="flex flex-col mt-[1em] items-center "
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <SelectField
          label="Category"
          name="category"
          register={register}
          errors={errors}
          options={catnew?.map((cat: { label: any; value: any }) => ({
            label: cat.label,
            value: cat.value,
          }))}
        />

        <InputField
          label="Sub Category"
          name="subcategory"
          register={register}
          errors={errors}
          type="text"
          maxLength={100}
        />

        <div className="py-5">
          <DefaultButton
            text={status === "pending" ? "loading..." : "Create"}
            type="submit"
            handleClick={() => {}}
            className=" bg-[#FCDFD4] p-4 text-sm w-[25em] hover:bg-[#F25E26] hover:text-white rounded-lg"
          />
        </div>
      </form>
    </section>
  );
};
