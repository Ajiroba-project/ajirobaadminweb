"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RegistrationHeader } from "@/app/components/Header";
import { DefaultButton } from "@/app/components/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AuctionEditUploadSchema,
  ProductUploadSchema,
} from "@/helper/validation";
import { categories, subcategories } from "@/app/data";
import {
  InputField,
  SelectField,
  TextAreaField,
} from "@/app/components/FormField";

export default function Page() {
  const [selectedImg, setSelectedImg] = useState<any>([
    "https://www.shutterstock.com/image-illustration/vintage-apple-leaf-isolated-on-600nw-2293343413.jpg",
    "https://media.istockphoto.com/id/184276818/photo/red-apple.jpg?s=612x612&w=0&k=20&c=NvO-bLsG0DJ_7Ii8SSVoKLurzjmV0Qi4eGfn6nW3l5w=",
    "https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg",
    "https://i0.wp.com/blossomkitty.com/wp-content/uploads/2021/02/e0fe1c0ebd2f75d5f682b058142618fd.jpg?fit=648%2C677&ssl=1",
    "https://www.shutterstock.com/image-photo/unhealthy-blue-apple-isolated-260nw-782117749.jpg",
    "https://i0.wp.com/blossomkitty.com/wp-content/uploads/2021/02/e0fe1c0ebd2f75d5f682b058142618fd.jpg?fit=648%2C677&ssl=1",
  ]);
  const router = useRouter();

  const [mainImage, setMainImage] = useState<string>(selectedImg[0]);

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
    resolver: yupResolver(AuctionEditUploadSchema),
  });
  const RemoveImg = (val: string) => {
    setSelectedImg(selectedImg.filter((e: string) => e !== val));
    URL.revokeObjectURL(val);
  };

  return (
    <section className="flex-col flex justify-center ">
      <div className="w-full bg-gray-100">
        <RegistrationHeader />
        <p
          className="lg:px-14 px-7  text-[#F25E26] underline cursor-pointer"
          onClick={() => router.back()}
        >
          Back
        </p>
        <span className="w-full bg-gray-100">
          <h1 className="text-2xl text-center py-2 mb-6">
            Regular Product Upload
          </h1>
        </span>
      </div>

  {/*     <form
        className="flex justify-around gap-8  lg:gap-20 2xl:gap-20 md:gap-12 items-center lg:flex-row flex-col-reverse  "
        style={{
          margin: "0 auto",
          width: "90%",
          maxWidth: "100%",
        }}
      >
        <div   style={{
          margin: "0 auto",
          width: "90%",
          maxWidth: "100%",
        }} className="flex-1 mt-12 ">
          <div className="flex-1">
            <Image
              src={mainImage}
              alt="main preview"
              width={240}
              height={340}
              className="w-full h-auto bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
            {selectedImg.map((image: any, index: number) => (
              <div key={index} className="">
                <div className="  ">
                  <Image
                    src={image}
                    alt={image}
                    width={300}
                    height={300}
                    className="object-cover"
                  />
                </div>
              </div>
            ))}

          </div>


        </div>

        <div className=" flex flex-col mt-5  ">
          <div className="flex gap-2 flex-col">
            <InputField
              label="Product name"
              type="text"
              name="product name"
              register={register}
              classname="px-5 h-12 focus:text-black border rounded "
            />
            <SelectField
              label="Sub categories"
              name="sub categories"
              register={register}
              errors={errors}
              options={categories}
              classname={" px-5 h-12  focus:text-black border rounded"}
            />
            <TextAreaField
              label="description"
              name="textarea"
              register={register}
              errors={errors}
              placeholder={""}
              classname={" px-5 h-24  focus:text-black border rounded"}
            />

          <div className="w-full">
               <div className="flex gap-2 py-8 flex-col lg:flex-row md:flex-row " >
                 <InputField
                name="last_price"
                label="Last Price"
                type="text"
                placeholder="₦1234"
                register={register}
                errors={errors}

              />

              <InputField
                name="ticket_price"
                label="Ticket Price"
                type="text"
                placeholder="₦100"
                register={register}
                errors={errors}
              />
             </div>
          </div>


            <div className="flex gap-2  flex-col lg:flex-row md:flex-row ">
              <InputField
                name="start time"
                label="Start time:"
                type="time"
                placeholder="₦1234"
                register={register}
                errors={errors}

              />
              <InputField
                name="end time"
                label="End time:"
                type="time"
                placeholder="₦1234"
                register={register}
                errors={errors}
              />
            </div>
            <div className="flex gap-2 py-8 flex-col lg:flex-row md:flex-row ">
              <InputField
                name="selling_price"
                label="Selling Price"
                type="text"
                placeholder="₦1234"
                register={register}
                errors={errors}
              />
              <InputField
                name="discount"
                label="Discount"
                type="text"
                placeholder="₦100"
                register={register}
                errors={errors}
              />
            </div>
          </div>
        </div>
      </form>

 */}

<div  style={{
          margin: "0 auto",
          width: "80%",
          maxWidth: "100%",
        }} className="flex flex-1 justify-around gap-12 items-center lg:flex-row-reverse flex-col-reverse" >
  <div>
    <form>
      <div className=" flex flex-col mt-5  ">
        <div className="flex gap-2 flex-col">
          <InputField
            label="Product name"
            type="text"
            name="product name"
            register={register}
            classname="px-5 h-12 focus:text-black border rounded "
          />
          <SelectField
            label="Sub categories"
            name="sub categories"
            register={register}
            errors={errors}
            options={categories}
            classname={" px-5 h-12  focus:text-black border rounded"}
          />
          <TextAreaField
            label="description"
            name="textarea"
            register={register}
            errors={errors}
            placeholder={""}
            classname={" px-5 h-24  focus:text-black border rounded"}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="last_price"
              label="Last Price"
              type="text"
              placeholder="₦1234"
              register={register}
              errors={errors}
              classname="px-5 h-12 focus:text-black border rounded "
            />

            <InputField
              name="ticket_price"
              label="Ticket Price"
              type="text"
              placeholder="₦100"
              register={register}
              errors={errors}
              classname="px-5 h-12 focus:text-black border rounded "
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="start time"
              label="Start time:"
              type="time"
              placeholder="₦1234"
              register={register}
              errors={errors}
              classname="px-5 h-12 focus:text-black border rounded "
            />
            <InputField
              name="end time"
              label="End time:"
              type="time"
              placeholder="₦1234"
              register={register}
              errors={errors}
              classname="px-5 h-12 focus:text-black border rounded "
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
              classname="px-5 h-12 focus:text-black border rounded "
            />
          </div>
        </div>
      </div>
    </form>
  </div>

  <div className="w-3/6">
    <div className="flex justify-center items-center">
      <Image
        src={mainImage}
        alt="main preview"
        width={240}
        height={340}
        className="w-full h-auto bg-gray-100"
        /*    className="w-full h-auto bg-gray-100" */
      />
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
      {selectedImg.map((image: any, index: number) => (
        <div key={index} className="">
          <div className="  ">
            <Image
              src={image}
              alt={image}
              width={300}
              height={300}
              className="object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


      <div className="flex justify-center items-center mt-12  mb-10">
        <DefaultButton
          type="submit"
          className="text-sm  px-20  justify-center flex font-normal font-Poppins rounded-lg bg-[#FCDFD4]  py-2 transition delay-300 duration-300 ease-in-out hover:bg-[#E84526] hover:text-white hover:transition-all"
          handleClick={() => null}
          text={!true ? "loading..." : " Update"}
        />
      </div>
    </section>
  );
}
