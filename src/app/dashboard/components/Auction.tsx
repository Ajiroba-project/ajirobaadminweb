import {
  CheckboxField,
  InputField,
  SelectField,
  TextAreaField,
} from "@/app/components/FormField";
import { SetStateAction, useEffect, useState } from "react";
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
import { div } from "framer-motion/m";
import { tr } from "framer-motion/client";
import { useQueryData } from "@/hooks/useQueryDataCat";
import { setLocalStoreData } from "@/hooks/useLocalStorage";


interface Subcategory {
  toLowerCase: any;
  id: string;
  subcategory: any;
  name?: string;
  category?: string;
  data?: any;
}

interface CategoryResponse {
  data: Category[];
}

interface Category {
  [x: string]: any;
  category: string;
  subcategories: Subcategory[];
  data?: any;
}

interface CategoryResponse {
  data: Category[];
}


export const Auction = () => {
  const router = useRouter();
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  const [selectedImg, setSelectedImg] = useState<any>([]);
  const [selectedImgName, setSelectedImgName] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);

  const setproduct = useNewProductStore((state) => state.setproduct);


    const { data: catInfo, isLoading: catnLoading } =
    useQueryData<CategoryResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/commerce/categories_and_subcategories/`,
      ["get categories_and_subcategories"],
      true,
    );

  const catnew = catInfo?.data.map((cat) => ({
    label: cat.category,
    value: cat.id,
    id: cat.id,
    subcategories: cat.subcategories,
  }));


  const isDisabled = true;


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
     context: { isdisabled: isDisabled }
  });

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleFileChange = (e: FileChangeEvent): void => {
    const files: File[] = Array.from(e.target.files);

    const base64Promises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    });

    Promise.all(base64Promises)
      .then((base64Files) => {
        const previousFiles = (watch("auction_media") as string[]) ?? [];
        setValue("auction_media", [...previousFiles, ...base64Files]);
        trigger("auction_media");
      })
      .catch((error) =>
        console.error("Error converting files to base64:", error),
      );

    const imagePreviews = files.map((file) =>
      URL.createObjectURL(file as Blob),
    );
    setPreviews((prev: string[]) => [...prev, ...imagePreviews]);
  };

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const RemoveImg = (val: string) => {
    setSelectedImg(selectedImg.filter((e: string) => e !== val));
    URL.revokeObjectURL(val);
  };

  const handleSuccess = (data: any) => {
    if (data.status === 200 || data.status === 201) {
      /* router.push("/dashboard/userdetails"); */
      setShowModal(true);
      setLocalStoreData(data);
      setPreviews([]);
      reset();
    } else if (data.status === 400 || data.status === 409) {
            setPreviews([]);
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
            setPreviews([]);
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
    handleError,
  );

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");  // Formats as DD/MM/YYYY
};

const sumbitForm = (data: any) => {
    // Prepare FormData to handle file uploads
    const formData = new FormData();

    // Append simple fields
    formData.append("auction_name", data.auction_name);
    formData.append("auction_category", data.auction_category);
    formData.append("sub_category", data.sub_category);
    formData.append("cost_price", data.cost_price);
    formData.append("ticket_price", data.ticket_price);
    formData.append("start_date", formatDate(data.auction_date));  // Formatted date
    formData.append("start_time", data.auction_starttime);
    formData.append("end_time", data.auction_endtime);
    formData.append("description", data.description);

    // Append files if they exist
    const auctionMedia = data.auction_media as File[];
    auctionMedia.forEach((file, index) => {
        formData.append(`auction_media[${index}]`, file);
    });

    // Create a clean payload for the request
    const Payload = {
        name: data.auction_name,
        category: data.auction_category,
        subcategory: data.sub_category,
        const_price: data.cost_price,
        ticket_price: data.ticket_price,
        start_date: formatDate(data.auction_date),
        start_time: data.auction_starttime,
        end_time: data.auction_endtime,
        description: data.description,
        auction_images: auctionMedia  // Use file names for payload
    };

    // console.log(Payload, "Payload");

     mutate({
         url: "/api/uploadauction",
         payload: Payload,
     });

     localStorage.setItem("auction-details", JSON.stringify(Payload));

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
                    onChange={handleFileChange}
                  />
                </label>
                <div className="text-xs text-rose-500 pt-1">
                  {errors?.auction_media?.message}
                </div>
              </div>


         <div className="flex gap-2 mt-4 flex-wrap">
                {previews.map((src, index) => (
                  <Image
                    key={index}
                    src={src}
                    alt={`preview-${index}`}
                    className="w-20 h-20 object-cover rounded-md shadow"
                    width={80}
                    height={80}
                    priority
                  />
                ))}
              </div>



              <div className="flex gap-12 mb-4 flex-col lg:flex-row md:flex-row ">
                {/* <CheckboxField
                  label=""
                  name="topdeals"
                  register={register}
                  errors={errors}
                  options={["Top Deals"]}
                  onChange={(e: { target: { checked: boolean } }) =>
                    setValue("topdeals", e.target.checked)
                  }
                  classname="mt-4"
                />


                <CheckboxField
                  label=""
                  name="featured"
                  register={register}
                  errors={errors}
                  options={["Featured"]}
                  onChange={(e: { target: { checked: boolean } }) =>
                    setValue("featured", e.target.checked)
                  }
                  classname="mt-4"
                />  */}
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
                  name="auction_name"
                  label="Product Name"
                  type="text"
                  placeholder="Rice"
                  register={register}
                  errors={errors}
                  classname={`text-sm w-auto xl:w-[350px] 2xl:w-[300px] md:w-[300px] xlw-[300px] lg:w-[300px] h-12 p-2.5 border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                />
                 <SelectField
                  name="auction_category"
                  label="Category"
                  register={register}
                  errors={errors}
                  options={catnew?.map((cat) => ({
                    label: cat.label,
                    value: cat.value,
                  }))}
                  classname={`text-sm  xl:w-[298px] 2xl:w-[298px] md:w-[300px] xlw-[300px] lg:w-[300px] h-12 p-2.5 border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                />
                <SelectField
                  name="sub_category"
                  label="Sub Category"
                  register={register}
                  errors={errors}
                  options={
                    catnew
                      ?.find((cat) => cat.id === watch("auction_category"))
                      ?.subcategories?.map((sub) => ({
                        label: sub.subcategory,
                        value: sub.id,
                      })) || []
                  }
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

           {/*    <div className="flex items-center space-x-8 mb-8">

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
                  selectedOption === "Upload Now"
                    ? "border-[#D55842]"
                    : "border-gray-400"
                }`}
              >
                {selectedOption === "Upload Now" && (
                  <div className="w-3 h-3 rounded-full bg-[#D55842]"></div>
                )}
              </div>
              <span
                className={`text-sm ${
                  selectedOption === "Upload Now"
                    ? "text-black"
                    : "text-gray-400"
                }`}
              >
                Upload Now
              </span>
            </label>

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
                  selectedOption === "Schedule Upload"
                    ? "border-[#D55842]"
                    : "border-gray-400"
                }`}
              >
                {selectedOption === "Schedule Upload" && (
                  <div className="w-3 h-3 rounded-full bg-[#D55842]"></div>
                )}
              </div>
              <span
                className={`text-sm ${
                  selectedOption === "Schedule Upload"
                    ? "text-black"
                    : "text-gray-400"
                }`}
              >
                Schedule Upload
              </span>
            </label>
          </div>

      {selectedOption === "Upload Now" ? (
            <div>
              <h1 className=" text-sm font-Poppins text-gray-400 mb-4">
                Date & Time
              </h1>
              <div className="flex gap-4  flex-col lg:flex-row md:flex-row border border-gray-300 rounded-lg px-4 py-4 ">
                <InputField
                  name="auction_date"
                  label="Date"
                  type="date"
                  placeholder="Start Date"
                  isdisabled={true}
                  register={register}
                  errors={errors}
                  classname="text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none"
                />
                <InputField
                  name="auction_starttime"
                  label="Start Time"
                  type="time"
                  isdisabled={true}
                  placeholder="End Date"
                  register={register}
                  errors={errors}
                  classname="text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none"
                />
                <InputField
                  name="auction_endtime"
                  label="End Time"
                  type="time"
                  placeholder="End Date"
                  register={register}
                  errors={errors}
                  classname="text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none"
                />
              </div>
              <h1 className=" py-4 flex  justify-center items-center text-sm font-Poppins text-gray-400 mb-4">
                Duration: 2hr: 00 mins
              </h1>
            </div>
          ) : (
            <div>
              <div className="flex gap-4  flex-col lg:flex-row md:flex-row border border-gray-300 rounded-lg px-4 py-4 ">
                <InputField
                  name="auction_date"
                  label="Date"
                  type="date"
                  placeholder="Start Date"
                  isdisabled={false}
                  register={register}
                  errors={errors}
                  classname="text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none"
                />
                <InputField
                  name="auction_starttime"
                  label="Start Time"
                  type="time"
                  isdisabled={false}
                  placeholder="End Date"
                  register={register}
                  errors={errors}
                  classname="text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none"
                />
                <InputField
                  name="auction_endtime"
                  label="End Time"
                  type="time"
                  placeholder="End Date"
                  register={register}
                  errors={errors}
                  classname="text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none"
                />
              </div>
              <h1 className=" py-4 flex  justify-center items-center text-sm font-Poppins text-gray-400 mb-4">
                Duration: 2hr: 00 mins
              </h1>
            </div>
          )} */}


             <div>
              <div className="flex gap-4  flex-col lg:flex-row md:flex-row border border-gray-300 rounded-lg px-4 py-4 ">
                <InputField
                  name="auction_date"
                  label="Date"
                  type="date"
                  placeholder="Start Date"
                  isdisabled={false}
                  register={register}
                  errors={errors}
                  classname="text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none"
                />
                <InputField
                  name="auction_starttime"
                  label="Start Time"
                  type="text"
                  isdisabled={false}
                  placeholder="12AM or 12PM"
                  register={register}
                  errors={errors}
                pattern="^(0?[1-9]|1[0-2])(AM|PM)$"
                  classname="text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none"
                />
                <InputField
                  name="auction_endtime"
                  label="End Time"
                  type="text"
                placeholder="12AM or 12PM"
                  register={register}
                  errors={errors}
                pattern="^(0?[1-9]|1[0-2])(AM|PM)$"
                  classname="text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none"
                />
              </div>
             {/*  <h1 className=" py-4 flex  justify-center items-center text-sm font-Poppins text-gray-400 mb-4">
                Duration: 2hr: 00 mins
              </h1> */}
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
