import {
  CheckboxField,
  InputField,
  SelectField,
  TextAreaField,
} from "@/app/components/FormField";
import { SetStateAction, useState } from "react";
import { useMutateData } from "@/hooks/useMutateData";
import { DefaultButton } from "@/app/components/Button";
import { categories, subcategories } from "@/app/data";
import { useRouter } from "next/navigation";
import { FiUpload } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { ActionUploadSchema } from "@/helper/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import { useStore, useNewProductStore } from "@/store/nav-store";
import { Modal } from "./Modal";
import successIcon from "@/app/asset/signout.svg";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

export const Auction = () => {
  const router = useRouter();
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  const [selectedImg, setSelectedImg] = useState<any>([]);
  const [selectedImgName, setSelectedImgName] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);

  const setproduct = useNewProductStore((state) => state.setproduct);

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
    resolver: yupResolver(ActionUploadSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];
    const ImgArray = selectedFiles.map((file) => {
      return URL.createObjectURL(file);
    });

    console.log(ImgArray);
    setSelectedImg((prevImg: string[]) => prevImg.concat(ImgArray));
  };

  const RemoveImg = (val: string) => {
    setSelectedImg(selectedImg.filter((e: string) => e !== val));
    URL.revokeObjectURL(val);
  };

  const handleSuccess = (data: any) => {
    if (data.status === 201) {
      router.push("/dashboard");
      setShowModal(true);
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

  const { data, error, mutate, status } = useMutateData(
    "upload",
    handleSuccess,
    handleError
  );

  const sumbitForm = (data: any) => {
    mutate({
      url: "/api/upload",
      payload: data,
    });

    localStorage.setItem("product-details", JSON.stringify(data));
    // router.push("/dashboard/product-details")
  };


 const [selectedOption, setSelectedOption] = useState("Upload Now");

  const handleSelection = (value: SetStateAction<string>) => {
    setSelectedOption(value);
  };

  return (
    <>
      <ToastContainer closeOnClick />
      <section
        className={`my-10 px-20 ${
          isNavbarOpen ? "justify-center items-center " : ""
        } flex-col flex`}
      >
        <h1
          className={`xl:text-2xl 2xl:text-2xl md:text-2xl text-base font-normal pb-4 leading-tight tracking-tight underline p-3`}
        >
          Auction Details
        </h1>
        <hr className="w-full h-1 border-[#D2D2D2] rounded"></hr>


        <form
          onSubmit={handleSubmit(sumbitForm)}
          encType={"multipart/form-data"}
        >
          <div
            className={`flex gap-8 my-4 lg:flex-row  flex-col-reverse items-center `}
          >
            <div className="">
              <div className="flex flex-col">
                <label htmlFor="upload-files">
                  <p className="py-2">Product Upload:</p>
                  <span className="bg-gray-50 relative rounded-md shadow hover:bg-[#FCDFD4] h-[20rem] w-auto flex justify-center items-center cursor-pointer flex-col">
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
                    {...register("auction_media", { required: true })}
                  />
                </label>
                <div className="text-xs text-rose-500 pt-1">
                  {errors?.auction_media?.message}
                </div>
              </div>


  <div className="flex gap-12 mb-4 flex-col lg:flex-row md:flex-row ">
              <CheckboxField
        label=""
        name="topdeals"
        register={register}
        errors={errors}
        options={["Top Deals"]}
        classname="mt-4"
      />
                 <CheckboxField
        label=""
        name="featured"
        register={register}
        errors={errors}
        options={["Featured"]}
        classname="mt-4"
      />
              </div>

              <div className="flex gap-2  flex-col lg:flex-row md:flex-row ">
                <InputField
                  name="cost_price"
                  label="Cost Price"
                  type="text"
                   placeholder="₦1234"
                  register={register}
                  errors={errors}

            classname={`text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                />
                 <InputField
                  name="ticket_price"
                  label="Ticket Price"
                  type="text"
                  placeholder="₦1234"
                  register={register}
                  errors={errors}
                 classname={`text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                />
              </div>
              <div className="flex gap-2 py-2 flex-col lg:flex-row md:flex-row ">
                <InputField
                  name="weight"
                  label="Weight"
                  type="text"
                  placeholder="50kg"
                  register={register}
                  errors={errors}
                 classname={`text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                />

              </div>



            </div>

            <div className="flex items-center">
              <div className="flex-col flex gap-3">
                <InputField
                  name="product_name"
                  label="Product Name"
                  type="text"
                  placeholder="Rice"
                  register={register}
                  errors={errors}
                  classname={`text-sm w-auto xl:w-[350px] 2xl:w-[300px] md:w-[300px] xlw-[300px] lg:w-[300px] h-12 p-2.5 border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                />
                <SelectField
                  name="product_category"
                  label="Category"
                  register={register}
                  errors={errors}
                  options={categories}

                 classname={`text-sm  xl:w-[298px] 2xl:w-[298px] md:w-[300px] xlw-[300px] lg:w-[300px] h-12 p-2.5 border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                />
                <SelectField
                  name="sub_category"
                  label="Sub Category"
                  register={register}
                  errors={errors}
                  options={subcategories}
                 classname={`text-sm  xl:w-[298px] 2xl:w-[298px] md:w-[300px] xlw-[300px] lg:w-[300px] h-12 p-2.5 border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}


                />
                <TextAreaField
                  name="description"
                  label="Product Description"
                  register={register}
                  errors={errors}
                  placeholder={"Describe your product here..."}
                     classname={`resize-none px-5 h-24 focus:text-black border rounded w-auto xl:w-[350px] 2xl:w-[300px] md:w-[300px] xlw-[300px] lg:w-[300px] p-4`}
                />
              </div>
            </div>
          </div>

          <hr className="w-full h-2 border-[#D2D2D2] rounded"></hr>





      <div className="flex items-center space-x-8 mb-8">
      {/* Upload Now Option */}
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="uploadOption"
          value="Upload Now"
          className="hidden"
          checked={selectedOption === "Upload Now"}
          onChange={() => setSelectedOption("Upload Now")}
        />
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedOption === "Upload Now" ? "border-[#D55842]" : "border-gray-400"
          }`}
        >
          {selectedOption === "Upload Now" && (
            <div className="w-3 h-3 rounded-full bg-[#D55842]"></div>
          )}
        </div>
        <span
          className={`text-sm ${
            selectedOption === "Upload Now" ? "text-black" : "text-gray-400"
          }`}
        >
          Upload Now
        </span>
      </label>

      {/* Schedule Upload Option */}
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="uploadOption"
          value="Schedule Upload"
          className="hidden"
          checked={selectedOption === "Schedule Upload"}
          onChange={() => setSelectedOption("Schedule Upload")}
        />
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedOption === "Schedule Upload" ? "border-[#D55842]" : "border-gray-400"
          }`}
        >
          {selectedOption === "Schedule Upload" && (
            <div className="w-3 h-3 rounded-full bg-[#D55842]"></div>
          )}
        </div>
        <span
          className={`text-sm ${
            selectedOption === "Schedule Upload" ? "text-black" : "text-gray-400"
          }`}
        >
          Schedule Upload
        </span>
      </label>
    </div>









          <div className={`py-4`}>
            <DefaultButton
              text={status === "pending" ? "loading..." : "Upload"}
              type="submit"
              handleClick={() => null}
              className=" bg-[#FCDFD4] p-4 text-sm w-[10em] hover:bg-[#F25E26] hover:text-white rounded-lg"
            />
          </div>
        </form>
      </section>
      {showModal && (
        <div className="flex absolute top-0 z-50 left-0">
          <Modal
            title="Product Upload Successfull!"
            subtitle="Your product has been successfully uploaded"
            buttoncount={1}
            buttontext="Continue"
            buttonclass="bg-[#FCDFD4] p-5 rounded-lg text-sm hover:bg-[#F25E26] hover:text-white hover:shadow w-full px-14"
            buttontype="button"
            handleEvent={() => setShowModal(!showModal)}
            icon={successIcon}
          />
        </div>
      )}
    </>
  );
};
