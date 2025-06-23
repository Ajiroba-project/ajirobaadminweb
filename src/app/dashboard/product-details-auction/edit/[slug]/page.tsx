"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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
import { useMutateData } from "@/hooks/useMutateData";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setLocalStoreData } from "@/hooks/useLocalStorage";
import { useQueryData } from "@/hooks/useQueryDataCat";
import { FiUpload } from "react-icons/fi";
import { useGetDatanew } from "@/hooks/useGetData";
import Cookies from "js-cookie";
import { Modal } from "@/app/dashboard/components/Modal";
import successIcon from '@/app/asset/signout.svg'
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

export default function Page() {

  const router = useRouter();

  const params = useParams();
  const productId = params.slug;


  const [selectedImg, setSelectedImg] = useState<string[]>([]);




  const [userToken, setUserToken] = useState(Cookies.get("token"));

  // Construct URL with dynamic filters
  let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/admin_auctions/`;

  const { data: productInfo, isLoading: productLoading } = useGetDatanew(
    url,
    "get_product_details",
    userToken || " "
  );



  // Find the product that matches the productId
  const productDetails = Array.isArray(productInfo?.data)
    ? productInfo.data.find((product: any) => product.id === productId)
    : null;


  useEffect(() => {
    if (productDetails?.images) {
      const images = productDetails.images.map(
        (img: any) => `https://staging.ajiroba.ng/v1/media/${img.image}`
      );
      setSelectedImg(images);
      setMainImage(images[0]);
    }
  }, [productDetails]);


  const [mainImage, setMainImage] = useState<string>(selectedImg[0]);

  const [previews, setPreviews] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

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
    defaultValues: {
      product_name: "",
      sub_category: "",
      description: "",
      ticket_price: "",
      cost_price: "",
      auction_category: "",
      regular_media: [],
      auction_starttime: "",
      auction_endtime: "",
      auction_date: "",
    },
  });

  const RemoveImg = (val: string) => {
    setSelectedImg(selectedImg.filter((e: string) => e !== val));
    URL.revokeObjectURL(val);
  };

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
        const previousFiles = (watch("regular_media") as string[]) ?? [];
        setValue("regular_media", [...previousFiles, ...base64Files]);
        trigger("regular_media");
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

  const handleSuccess = (data: any) => {
    if (data.status === 200 || data.status === 201) {
      /* router.push("/dashboard/userdetails"); */
      setShowModal(true);
      setLocalStoreData(data);
      setPreviews([]);
      reset();
    } else if (
      data.status === 400 ||
      data.status === 409 ||
      data.status === 405
    ) {
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
    setPreviews([]);
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

  const sumbitForm = (data: any) => {
    const regularMedia = watch("regular_media") as string[];

    const formData = new FormData();
    formData.append("product_name", data.product_name);
    formData.append("product_category", data.product_category);
    formData.append("sub_category", data.sub_category);
    formData.append("quantity", data.quantity);
    formData.append("weight", data.weight);
    formData.append("selling_price", data.selling_price);
    formData.append("discount", data.discount);
    formData.append("description", data.description);
    formData.append("topdeals", data.topdeals);
    formData.append("featured", data.featured);

    regularMedia.forEach((file, index) => {
      formData.append(`regular_media[${index}]`, file);
    });

    const Payload = {
      name: data.product_name,
      category: data.auction_category,
      subcategory: data.sub_category,
      cost_price: data.cost_price,
      ticket_price: data.ticket_price,
      start_date: data.auction_date,
      start_time: data.auction_starttime,
      end_time: data.auction_endtime,
      description: data.description,
      auction_images: regularMedia,
    };


    // console.log(Payload);



    mutate({
      url: "/api/editauction",
      payload: {
        ...Payload,
        id: productId,
      },

    });

    /*   setLocalStoreData({
      name: "regularProduct",
      obj: { ...data, regularMedia },
    });
  */
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
            Auction Product Upload
          </h1>
        </span>
      </div>



      <div
        style={{
          margin: "0 auto",
          width: "80%",
          maxWidth: "100%",
        }}
        className="flex flex-1 justify-around gap-12 items-center lg:flex-row-reverse flex-col-reverse"
      >
        <div>
          <form id="auction-upload-form" onSubmit={handleSubmit(sumbitForm)}>
            <div className=" flex flex-col mt-5  ">
              <div className="flex gap-2 flex-col">
                <InputField
                  label="Product name"
                  type="text"
                  name="product_name"
                  register={register}
                  errors={errors}
                  classname="px-5 h-12 focus:text-black border rounded "
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
                  classname={" px-5 h-12  focus:text-black border rounded"}
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
                  classname={" px-5 h-12  focus:text-black border rounded"}
                />

                <TextAreaField
                  name="description"
                  label="Product Description"
                  register={register}
                  errors={errors}
                  placeholder={"Describe your product here..."}
                  classname={" px-5 h-24  focus:text-black border rounded"}
                />

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
                      className="pt-6 hidden"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                  <div className="text-xs text-rose-500 pt-1">
                    {errors?.regular_media?.message}
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

                <div className="grid grid-cols-2 gap-4">




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
                          className="px-5 h-12 focus:text-black border rounded w-full"
                        />
                      )}
                    />
                    <p className="text-xs text-rose-500 pt-1" >{errors?.auction_endtime?.message}</p>
                  </div>


                </div>

                <div className="grid grid-cols-2 gap-4">
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
                          className="px-5 h-12 focus:text-black border rounded w-full"
                        />
                      )}
                    />
                    <p className="text-xs text-rose-500 pt-1" >{errors?.auction_starttime?.message}</p>
                  </div>


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
                            className="px-5 h-12 focus:text-black border rounded w-full"
                          />
                        )}
                      />
                      <p className="text-xs text-rose-500 pt-1" >{errors?.auction_date?.message}</p>
                    </div>
                  </div>

                </div>



                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    name="cost_price"
                    label="Cost Price"
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
                    placeholder="₦1234"
                    register={register}
                    errors={errors}
                    classname="px-5 h-12 focus:text-black border rounded "
                  />
                </div>
              </div>
            </div>
          </form>

          <div className="flex justify-center items-center mt-12  mb-10">
            <DefaultButton
              handleClick={() => null}
              className="text-sm  px-20  justify-center flex font-normal font-Poppins rounded-lg bg-[#FCDFD4]  py-2 transition delay-300 duration-300 ease-in-out hover:bg-[#E84526] hover:text-white hover:transition-all"
              type="submit"
              form="auction-upload-form"
              text={status === "pending" ? "loading..." : "Update"}
            />
          </div>
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
                    alt={'auction image'}
                    width={300}
                    height={300}
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div >

      {showModal && (
        <div className="flex absolute top-0 z-50 left-0">
          <Modal
            title="Product Updated Successfull!"
            subtitle="Your product has been successfully uploaded"
            buttoncount={1}
            buttontext="Continue"
            buttonclass="bg-[#FCDFD4] p-5 rounded-lg text-sm hover:bg-[#F25E26] hover:text-white hover:shadow w-full px-14"
            buttontype="button"
            handleEvent={() => setShowModal(!showModal)}
            icon={successIcon}
          />
        </div>
      )
      }
    </section >
  );
}
