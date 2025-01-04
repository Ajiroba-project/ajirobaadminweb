"use client";
import { useState } from "react";
import { RegistrationHeader } from "@/app/components/Header";
import { DefaultButton } from "@/app/components/Button";
import {
  InputField,
  SelectField,
  TextAreaField,
} from "@/app/components/FormField";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const [selectedImg, setSelectedImg] = useState<any>([]);

  const router = useRouter();

  return (
    <section className="flex flex-col">
      <div className="w-full bg-gray-100">
        <RegistrationHeader />
        <p className="lg:px-14 px-7  text-[#F25E26] underline cursor-pointer">
          Back
        </p>
      </div>
      <span className="w-full bg-gray-100">
        <h1 className="text-2xl text-center py-2">Regular Product Upload</h1>
      </span>

      <form className="sm:flex-col md:flex-row flex-col lg:flex-row flex mx-8 gap-4 py-8 justify-center items-center container ">
        <div className="">
          <div className="grid grid-rows-3 grid-flow-col gap-4 relative">

            {selectedImg &&
              selectedImg.map((val: string, key: number) => (
                <div
                  key={key}
                  className={`col-span-1 ${
                    key === selectedImg.length - 1 && "row-span-3 col-span-3"
                  }`}
                >

                  <Image
                    src={val}
                    alt="preview"
                    width={80}
                    height={80}
                    className=""
                  />

                </div>
              ))}
          </div>
        </div>


      </form>

      <DefaultButton
        text={"Upload"}
        type={"submit"}
        handleClick={() => null}
        className="bg-[#FCDFD4] p-4 text-sm w-[20em]"
      />
    </section>
  );
};

export default Page;
