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
import { AiOutlineClose } from "react-icons/ai";
import { div } from "framer-motion/m";
import { tr } from "framer-motion/client";
import { useQueryData } from "@/hooks/useQueryDataCat";
import { setLocalStoreData } from "@/hooks/useLocalStorage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";


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
    setError,
  } = useForm({
    mode: "all",
    resolver: yupResolver(ActionUploadSchema),
    context: { isdisabled: isDisabled }
  });

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleFileChange = (e: FileChangeEvent): void => {
    const selected: File[] = Array.from(e.target.files);
    const previous = (watch("auction_media") as string[]) ?? [];
    const remaining = 4 - previous.length;

    if (remaining <= 0) {
      toast.warn("You can upload up to 4 files");
      return;
    }

    const allowedFiles = selected.slice(0, remaining);

    const base64Promises = allowedFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    });

    Promise.all(base64Promises)
      .then((base64Files) => {
        setValue("auction_media", [...previous, ...base64Files]);
        trigger("auction_media");
      })
      .catch((error) =>
        console.error("Error converting files to base64:", error),
      );

    const imagePreviews = allowedFiles.map((file) =>
      URL.createObjectURL(file as Blob),
    );
    setPreviews((prev: string[]) => [...prev, ...imagePreviews]);
  };

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const removePreviewAtIndex = (index: number) => {
    const currentPreviews = [...previews];
    const url = currentPreviews[index];
    if (url) URL.revokeObjectURL(url);
    const nextPreviews = currentPreviews.filter((_, i) => i !== index);
    setPreviews(nextPreviews);
    const currentMedia = (watch("auction_media") as string[]) ?? [];
    const nextMedia = currentMedia.filter((_, i) => i !== index);
    setValue("auction_media", nextMedia);
    trigger("auction_media");
  };

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
      // Map server error hints to specific fields
      const msg: string = data?.data?.message || '';
      if (msg.toLowerCase().includes('cost') || msg.toLowerCase().includes('price')) {
        setError('cost_price' as any, { type: 'server', message: 'Please enter a valid amount' } as any);
      }
      if (msg.toLowerCase().includes('ticket')) {
        setError('ticket_price' as any, { type: 'server', message: 'Please enter a valid amount' } as any);
      }
    } else {
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
    // Keep inputs on error; no reset
  };
  const { data, error, mutate, status } = useMutateData(
    "upload",
    handleSuccess,
    handleError,
  );

  const formatTime = (timeString: string) => {
    if (!timeString) {
      return '';
    }

    // If the time string already contains AM or PM, return it as-is
    if (typeof timeString === 'string' && (timeString.includes('AM') || timeString.includes('PM'))) {
      return timeString;
    }

    if (!timeString.includes(':')) {
      return '';
    }

    const [hours, minutes] = timeString.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // Handle midnight (0) as 12
    const hStr = h < 10 ? '0' + h : String(h);
    return `${hStr}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };


  function convertTo24Hour(time12h: string) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    return `${hours.padStart(2, '0')}:${minutes}`;
  }

  const sumbitForm = (data: any) => {
    // Prepare FormData to handle file uploads
    const formData = new FormData();

    // Append simple fields
    formData.append("auction_name", data.auction_name);
    formData.append("auction_category", data.auction_category);
    formData.append("sub_category", data.sub_category);
    formData.append("cost_price", data.cost_price);
    formData.append("quantity", data.quantity);
    formData.append("ticket_price", data.ticket_price);
    formData.append("start_date", formatDate(data.auction_date));  // Formatted date
    formData.append("start_time", formatTime(data.auction_starttime));
    formData.append("end_time", formatTime(data.auction_endtime));
    formData.append("description", data.description);
    formData.append("weight", data.weight);

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
      cost_price: data.cost_price,
      quantity: data.quantity,
      weight: `${data.weight}KG`,
      ticket_price: data.ticket_price,
      start_date: formatDate(data.auction_date),
      start_time: formatTime(data.auction_starttime),
      end_time: formatTime(data.auction_endtime),
      description: data.description,
      auction_images: auctionMedia  // Use file names for payload
    };

 /*     console.log(Payload, "Payload") */;

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
        className={`my-10 px-4 md:px-10 lg:px-20 ${isNavbarOpen ? "justify-center items-center " : ""
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
            className={`flex gap-6 md:gap-8 my-4 md:flex-row flex-col-reverse items-center md:items-start `}
          >
            <div className="">
              <div className="flex flex-col">
                <label htmlFor="upload-files">
                  <p className="py-2">Product Upload:</p>
                  <span className="bg-gray-50 relative rounded-md shadow hover:bg-[#FCDFD4] h-56 md:h-[20rem] w-full md:w-auto flex justify-center items-center cursor-pointer flex-col">
                    <FiUpload className="text-4xl" />
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-lg md:text-xl text-gray-500 ">
                        SelectFile to upload
                      </p>
                      <p className="mb-2 text-xs text-gray-500 ">
                        you may upload up to 4 images 
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
                  <div key={index} className="relative">
                    <Image
                      src={src}
                      alt={`preview-${index}`}
                      className="w-20 h-20 object-cover rounded-md shadow"
                      width={80}
                      height={80}
                      priority
                    />
                    <button
                      type="button"
                      aria-label="Remove image"
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow text-gray-600 hover:text-gray-800"
                      onClick={() => removePreviewAtIndex(index)}
                    >
                      <AiOutlineClose className="text-sm" />
                    </button>
                  </div>
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
                  classname={`text-sm w-full md:w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                  isAmount
                  maxLength={20}
                />
                <InputField
                  name="ticket_price"
                  label="Ticket Price"
                  type="text"
                  placeholder="₦1234"
                  register={register}
                  errors={errors}
                  classname={`text-sm w-full md:w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                  isAmount
                  maxLength={20}
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
                  classname={`text-sm w-full md:w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                  maxLength={10}
                />
                <InputField
                  name="quantity"
                  label="Quantity"
                  type="number"
                  min={1}
                  placeholder="100"
                  register={register}
                  errors={errors}
                  classname={`text-sm w-full md:w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                  max={999999}
                />
              </div>
              
            </div>

            <div className="flex items-stretch md:items-center w-full md:w-auto">
              <div className="flex-col flex gap-3">
                <InputField
                  name="auction_name"
                  label="Product Name"
                  type="text"
                  placeholder="Rice"
                  register={register}
                  errors={errors}
                  classname={`text-sm w-full md:w-[300px] xl:w-[350px] 2xl:w-[300px] lg:w-[300px] h-12 p-2.5 border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
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
                  classname={`text-sm w-full md:w-[300px] xl:w-[298px] 2xl:w-[298px] lg:w-[300px] h-12 p-2.5 border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
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
                  classname={`text-sm w-full md:w-[300px] xl:w-[298px] 2xl:w-[298px] lg:w-[300px] h-12 p-2.5 border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                />
                <TextAreaField
                  name="description"
                  label="Product Description"
                  register={register}
                  errors={errors}
                  placeholder={"Describe your product here..."}
                  classname={`resize-none px-5 h-24 focus:text-black border rounded w-full md:w-[300px] xl:w-[350px] 2xl:w-[300px] lg:w-[300px] p-4`}
                  maxLength={500}
                />
              </div>
            </div>
          </div>

          <hr className="w-full h-2 border-[#D2D2D2] rounded"></hr>



          <div>
            <div className="flex gap-4  flex-col lg:flex-row md:flex-row border border-gray-300 rounded-lg px-4 py-4 ">

              <div className="">
                <div className="">
                  <label htmlFor="auction_date" className="text-sm font-medium text-gray-700">Start Date</label>
                  <div>
                    <Controller
                      control={control}
                      name="auction_date"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={date => {
                            if (date) {
                              const day = date.getDate();
                              const month = date.toLocaleString('default', { month: 'long' });
                              const year = date.getFullYear();
                              const formatted = `${day} ${month}, ${year}`;
                              field.onChange(formatted);
                            } else {
                              field.onChange("");
                            }
                          }}
                          dateFormat="d MMMM, yyyy"
                          placeholderText="22 June, 2025"
                          className="w-full min-w-[220px] px-3 h-12 focus:text-black border rounded"
                          withPortal
                          popperClassName="z-50"
                        />
                      )}
                    />
                    <p className="text-xs text-rose-500 pt-1" >{errors?.auction_date?.message}</p>
                  </div>
                </div>
              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Start Time</label>
                  <Controller
                    control={control}
                    name="auction_starttime"

                    render={({ field }) => (
                      <DatePicker
                        selected={
                          field.value && /^\d{2}:\d{2} (AM|PM)$/.test(field.value)
                            ? new Date(`1970-01-01T${convertTo24Hour(field.value)}`)
                            : null
                        }
                        onChange={date => {
                          const formatted = date
                            ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
                            : "";
                          field.onChange(formatted);
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="hh:mm aa"
                        placeholderText="HH:MM AM/PM"
                        className="w-full min-w-[220px] px-3 h-12 focus:text-black border rounded"
                        withPortal
                        popperClassName="z-50"
                      />
                    )}
                  />
                  <p className="text-xs text-rose-500 pt-1" >{errors?.auction_starttime?.message}</p>
                </div>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="text-sm font-medium text-gray-700">End Time</label>
                  <Controller
                    control={control}
                    name="auction_endtime"

                    render={({ field }) => (
                      <DatePicker
                        selected={
                          field.value && /^\d{2}:\d{2} (AM|PM)$/.test(field.value)
                            ? new Date(`1970-01-01T${convertTo24Hour(field.value)}`)
                            : null
                        }
                        onChange={date => {
                          const formatted = date
                            ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
                            : "";
                          field.onChange(formatted);
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="hh:mm aa"
                        placeholderText="HH:MM AM/PM"
                        className="w-full min-w-[220px] px-3 h-12 focus:text-black border rounded"
                        withPortal
                        popperClassName="z-50"
                      />
                    )}
                  />
                  <p className="text-xs text-rose-500 pt-1" >{errors?.auction_endtime?.message}</p>
                </div>
              </div>

            </div>


            <div className={`py-4 w-full`}>
              <DefaultButton
                text={status === "pending" ? "loading..." : "Upload"}
                type="submit"
                handleClick={() => null}
                className=" bg-[#FCDFD4] p-4 text-sm w-full md:w-[10em] hover:bg-[#F25E26] hover:text-white rounded-lg"
              />
            </div>
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
