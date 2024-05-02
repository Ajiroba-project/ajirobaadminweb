"use client";
import React, {useState} from "react";
import Image from"next/image"
import { useRouter } from "next/navigation";
import { RegistrationHeader } from "@/app/components/Header";
import { DefaultButton } from "@/app/components/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProductUploadSchema } from "@/helper/validation";
import { categories, subcategories } from "@/app/data";
import {
  InputField,
  SelectField,
  TextAreaField,
} from "@/app/components/FormField";

export default function Page() {
  const [selectedImg, setSelectedImg] = useState<any>([1, 2, 3, 4]);
  const router = useRouter();

  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(ProductUploadSchema),
  });
   const RemoveImg = (val: string) => {
     setSelectedImg(selectedImg.filter((e: string) => e !== val));
     URL.revokeObjectURL(val);
   };

  return (
    <section className="flex-col flex justify-center">
      <div className="w-full bg-gray-100">
        <RegistrationHeader />
        <p
          className="lg:px-14 px-7  text-[#F25E26] underline cursor-pointer"
          onClick={() => router.back()}
        >
          Back
        </p>
        <span className="w-full bg-gray-100">
          <h1 className="text-2xl text-center py-2">Regular Product Upload</h1>
        </span>
      </div>
      <form className="flex justify-around gap-4 items-center lg:flex-row flex-col-reverse">
        {/* image display */}
        <div className="flex-1">
          <div className="grid lg:grid-rows-3  grid-flow-col gap-4 relative m-8">
            {/* One column on smaller screens, three on medium+ */}
            {selectedImg &&
              selectedImg.map((val: string, key: number) => (
                <div
                  key={key}
                  className={`lg:col-span-1 ${
                    key === selectedImg.length - 1 && "lg:row-span-3 lg:col-span-3"
                  }`}
                >
                  {/* Always col-span-1, md:col-span-2 for last image */}
                  <Image
                    src={val}
                    alt="preview"
                    width={80}
                    height={80}
                    className="w-full h-auto bg-gray-100"
                  />
                  <span
                    className="absolute top-0 right-0 bg-rose-400 text-white rounded-full text-xs p-2 cursor-pointer"
                    onClick={() => RemoveImg(val)}
                  >
                    X
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* form display */}
        <div className=" flex flex-col mt-5">
          <div className="flex gap-2 flex-col">
            <InputField
              label="Product name"
              type="text"
              name="product name"
              register={register}
            />
            <SelectField
              label="Sub categories"
              name="sub categories"
              register={register}
              errors={errors}
              options={categories}
            />
            <TextAreaField
              label="description"
              name="textarea"
              register={register}
              errors={errors}
              placeholder={""}
            />
            <div className="flex gap-2 py-8 flex-col lg:flex-row md:flex-row ">
              <InputField
                name="selling_price"
                label="Selling Price"
                type="text"
                placeholder="₦1234"
                register={register}
                errors={errors}
                classname="px-5 h-12 focus:text-black border rounded "
              />
              <InputField
                name="discount"
                label="Discount"
                type="text"
                placeholder="₦100"
                register={register}
                errors={errors}
                classname="px-5 h-12 focus:text-black border rounded"
              />
            </div>
          </div>
        </div>
      </form>

      <div className="flex justify-center items-center mt-12  mb-10">
        <DefaultButton
          type="submit"
          className=" px-20  bg-[#FCDFD4] py-4 text-sm justify-center flex"
          handleClick={() => null}
          text={!true ? "loading..." : " Upload"}
        />
      </div>
    </section>
  );
}
