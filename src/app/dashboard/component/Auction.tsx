import {InputField, SelectField, TextAreaField} from "@/app/component/FormField"
import  { useState } from 'react';
import { useMutateData } from "@/hooks/useMutateData";
import {DefaultButton} from "@/app/component/Button"
import { categories, subcategories } from "@/app/data";
import { useRouter } from "next/navigation";
import { FiUpload } from "react-icons/fi";
import { useForm } from "react-hook-form";
import {UploadSchema} from "@/helper/validation"
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import {useStore, useNewProductStore } from '@/store/nav-store';
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image"

export const Auction = () => {
  const router = useRouter();
  const isNavbarOpen = useStore(state=> state.isNavbarOpen)
  const [selectedImg, setSelectedImg]= useState<any>([])
  const [selectedImgName, setSelectedImgName]= useState<any>([])

    const setproduct = useNewProductStore(state => state.setproduct)
        
     const { reset, register, control, handleSubmit, formState: { errors }, trigger, watch, setValue,
    } = useForm({
        mode: "all",
        resolver: yupResolver(UploadSchema),
    });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];
    const ImgArray = selectedFiles.map((file) => {
      return URL.createObjectURL(file);
    });

    console.log(ImgArray)
    setSelectedImg((prevImg: string[]) => prevImg.concat(ImgArray));
  };

  const RemoveImg = (val: string) => {
    setSelectedImg(selectedImg.filter((e: string) => e !== val));
    URL.revokeObjectURL(val);
  };

  const handleSuccess = (data: any) => {
        if (data.status === 201 || 200) {
          toast.success(`${data?.data?.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            onClose: () => router.push("/dashboard"),
          });
          reset();
        } else if (data.status === 400 || data.status === 409) {
          toast.error(`${data?.data?.message}`, {
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
        } else {
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
        }
    };
     const handleError = (error: any) => {
        toast.error(`${'An Error Occured'}`, {
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
        "upload",
        handleSuccess,
        handleError,
    );

  const sumbitForm = (data: any) => {
        mutate({
            url: "/api/upload",
            payload: data
        });

        localStorage.setItem('product-details', JSON.stringify(data));
        // router.push("/dashboard/product-details")
    };
    

  return (
    <section
      className={`my-10 container ${
        isNavbarOpen ? "justify-center items-center flex-col flex" : ""
      }`}
    >
      <ToastContainer closeOnClick />
      <h1
        className={`xl:text-2xl 2xl:text-2xl md:text-2xl text-base font-normal pb-4 leading-tight tracking-tight underline p-3`}
      >
        Auction Details
      </h1>
      <hr className="w-full h-1 border-[#D2D2D2] rounded"></hr>

      <form onSubmit={handleSubmit(sumbitForm)}>
      <div
        className={`flex gap-8 my-4 lg:flex-row  flex-col-reverse items-center `}
        
      >
        

        <div className="">
          <div className="flex flex-col">
            <label htmlFor="upload-files">
              <p className="py-2">Auction Product Upload:</p>
              <span className="bg-gray-50 relative rounded-md shadow hover:bg-gray-100 h-[20rem] w-auto flex justify-center items-center cursor-pointer flex-col">
                <FiUpload className="text-4xl" />
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-xl text-gray-500 ">
                    SelectFile to upload
                  </p>
                  <p className="mb-2 text-xs text-gray-500 ">
                    you may upload up to 4 images & video
                  </p>
                </div>
              </span>
              <input
                id="upload-files"
                type="file"
                accept="image/*, video/*"
                max="5"
                className="pt-6 hidden "
                multiple
                {...register("regular_media", { required: true })}
              />
            </label>
            <div className="text-xs text-rose-500 pt-1">
              {errors?.regular_media?.message}
            </div>
          </div>
          <div className="flex gap-2 py-8 flex-col lg:flex-row md:flex-row ">
            <InputField
              name="auction_price"
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
              classname="px-5 h-12 focus:text-black border rounded"
            />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="flex gap-3 flex-col">
            <InputField
              name="auction_name"
              label="Product Name"
              type="text"
              placeholder="Rice"
              register={register}
              errors={errors}
            />
            <SelectField
              name="auction_category"
              label="Product Category"
              register={register}
              errors={errors}
              options={categories}
            />
            <TextAreaField
              name="description"
              label="Auction Description"
              register={register}
              errors={errors}
              placeholder={"Describe your product here..."}
            />
            <div className="grid grid-cols-2 gap-3">
             <InputField
              name="auction_starttime"
              label="Start Time"
              type="time"
              placeholder="2:00pm"
              register={register}
              errors={errors}
              classname="px-2 h-12 focus:text-black border rounded"
            />
            <InputField
              name="endtime"
              label="End Time"
              type="time"
              placeholder="6:00pm"
              register={register}
              errors={errors}
              classname="px-2 h-12 focus:text-black border rounded"
            />
            <InputField
              name="auction_starttime"
              label="Date"
              type="date"
              placeholder="2:00pm"
              register={register}
              errors={errors}
              classname="px-2 h-12 focus:text-black border rounded"
            />
            <InputField
              name="endtime"
              label="Duration"
              type="text"
              placeholder="6:00pm"
              register={register}
              errors={errors}
              classname="px-2 h-12 focus:text-black border rounded"
            />
            </div>
            
          </div>
        </div>
       
      </div>
      

       <hr className="w-full h-2 border-[#D2D2D2] rounded"></hr>
            <div className={`py-4`}>
              <DefaultButton
                text="Upload"
                type="submit"
                handleClick={() => null}
                className=" bg-[#FCDFD4] p-4 text-sm w-[20em]   "
              />
            </div>
        </form>

      
    </section>
  );
}

