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
import { FiX } from "react-icons/fi";


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
  const productId = Array.isArray((params as any)?.slug)
    ? (params as any).slug[0]
    : String((params as any)?.slug ?? "");


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
    ? productInfo.data.find((product: any) => String(product?.id) === String(productId))
    : null;


  useEffect(() => {
    if (productDetails?.images) {
      const images = productDetails.images.map(
        (img: any) => `https://staging.ajiroba.ng/media/${img.image}`
      );
      setSelectedImg(images);
      setMainImage(images[0]);
    }

    // console.log(productDetails?.images, 'productDetails.images')
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

  // --- Media State ---
  interface MediaFile {
    id: string;
    url: string;
    type: 'image' | 'video';
    isExisting: boolean;
    base64?: string;
  }

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [mainMedia, setMainMedia] = useState<string>('');

  // Load existing product images
  useEffect(() => {
    if (productDetails?.images && Array.isArray(productDetails.images)) {
      const existingMedia: MediaFile[] = productDetails.images.map((img: any, index: number) => ({
        id: `existing-${index}`,
        url: `https://staging.ajiroba.ng/media/${img.image}`,
        type: 'image' as const,
        isExisting: true
      }));
      setMediaFiles(existingMedia);
      if (existingMedia.length > 0) {
        setMainMedia(existingMedia[0].url);
      }
    }
  }, [productDetails]);

  // Helper: is video
  const isVideo = (file: string | File): boolean => {
    if (typeof file === 'string') {
      return file.includes('.mp4') || file.includes('.webm') || file.includes('.ogg') ||
        file.includes('video/') || file.toLowerCase().match(/\.(mp4|webm|ogg|mov|avi)$/) !== null;
    }
    return Boolean(file && file.type && file.type.startsWith('video/'));
  };

  // Remove media file
  const removeMedia = (mediaId: string) => {
    setMediaFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => file.id !== mediaId);
      const fileToRemove = prevFiles.find(file => file.id === mediaId);
      if (fileToRemove && fileToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      if (fileToRemove && mainMedia === fileToRemove.url) {
        setMainMedia(updatedFiles.length > 0 ? updatedFiles[0].url : '');
      }
      const newMediaBase64 = updatedFiles.filter(file => !file.isExisting && file.base64).map(file => file.base64!);
      setValue('regular_media', newMediaBase64);
      return updatedFiles;
    });
  };

  // File upload handler
  const handleFileChange = (e: FileChangeEvent): void => {
    const files: File[] = Array.from(e.target.files);
    const currentNewFiles = mediaFiles.filter(file => !file.isExisting);
    if (currentNewFiles.length + files.length > 5) {
      toast.error('You can only upload up to 5 new files');
      return;
    }
    const base64Promises = files.map((file, index) => {
      return new Promise<MediaFile>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64 = reader.result as string;
          const blobUrl = URL.createObjectURL(file);
          resolve({
            id: `new-${Date.now()}-${index}`,
            url: blobUrl,
            type: isVideo(file) ? 'video' : 'image',
            isExisting: false,
            base64: base64
          });
        };
        reader.onerror = (error) => reject(error);
      });
    });
    Promise.all(base64Promises)
      .then((newMediaFiles) => {
        setMediaFiles(prev => [...prev, ...newMediaFiles]);
        const allBase64 = [
          ...mediaFiles.filter(file => !file.isExisting && file.base64).map(file => file.base64!),
          ...newMediaFiles.map(file => file.base64!)
        ];
        setValue('regular_media', allBase64);
        trigger('regular_media');
        if (!mainMedia && newMediaFiles.length > 0) {
          setMainMedia(newMediaFiles[0].url);
        }
      })
      .catch((error) => {
        console.error('Error converting files to base64:', error);
        toast.error('Error processing files');
      });
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      mediaFiles.forEach(file => {
        if (file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [mediaFiles]);

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

  // Prefill form when both product and categories are available
  useEffect(() => {
    if (!productDetails || !catInfo?.data) return;

    const to12h = (val: string) => {
      if (!val) return "";
      const twelveHrPattern = /^\d{2}:\d{2} (AM|PM)$/i;
      if (twelveHrPattern.test(val)) return val.toUpperCase();
      const parts = val.split(":");
      if (parts.length >= 2) {
        let hour = parseInt(parts[0], 10);
        const minute = parts[1] ?? "00";
        if (isNaN(hour)) return "";
        const suffix = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        const hh = String(hour).padStart(2, "0");
        const mm = String(parseInt(minute, 10) || 0).padStart(2, "0");
        return `${hh}:${mm} ${suffix}`;
      }
      return "";
    };

    const cats = catInfo.data;
    let resolvedCategoryId = "";
    let resolvedSubId = "";

    // Find category by name or ID
    const foundCatById = cats.find((c: any) => String(c.id) === String(productDetails.category));
    const foundCatByName = cats.find((c: any) => String(c.category).toLowerCase() === String(productDetails.category_name || productDetails.category).toLowerCase());
    if (foundCatById) resolvedCategoryId = foundCatById.id;
    else if (foundCatByName) resolvedCategoryId = foundCatByName.id;

    // Find subcategory within the resolved category
    const parent = cats.find((c: any) => String(c.id) === String(resolvedCategoryId)) || foundCatByName || foundCatById;
    if (parent && Array.isArray(parent.subcategories)) {
      const foundSubById = parent.subcategories.find((s: any) => String(s.id) === String(productDetails.subcategory));
      const foundSubByName = parent.subcategories.find((s: any) => String(s.subcategory).toLowerCase() === String(productDetails.subcategory_name || productDetails.subcategory).toLowerCase());
      resolvedSubId = (foundSubById?.id ?? foundSubByName?.id) ?? "";
    }

    // Reset form with all values at once
    reset({
      product_name: productDetails.name || "",
      auction_category: resolvedCategoryId,
      sub_category: resolvedSubId,
      description: productDetails.description || "",
      ticket_price: productDetails.ticket_price || "",
      cost_price: productDetails.cost_price || "",
      auction_starttime: to12h(productDetails.start_time || ""),
      auction_endtime: to12h(productDetails.end_time || ""),
      auction_date: productDetails.start_date || "",
      regular_media: []
    });
  }, [productDetails, catInfo, reset]);

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

  // --- Layout ---
  return (
    <section className="min-h-screen bg-[#FAFAFA] w-full flex flex-col items-center font-poppins">
      {/* Header */}
      <div className="w-full bg-[#F6F6F6] border-b border-[#F3F3F3] flex flex-col pb-2">
        <div className="flex flex-col w-full max-w-6xl mx-auto">
          <span onClick={() => router.back()} className="text-[#F25E26] underline cursor-pointer text-sm font-medium mt-6 mb-2 text-left">Back</span>
          <h1 className="text-2xl font-semibold text-center mb-4">Auction Product Upload</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl px-4 py-10">
        {/* Left: Main Preview + Thumbnails */}
        <div className="flex flex-col items-center flex-1">
          {/* Main Preview */}
          <div className="w-[340px] h-[420px] rounded-xl shadow bg-gray-100 flex items-center justify-center mb-6">
            {mainMedia ? (
              mediaFiles.find(file => file.url === mainMedia)?.type === 'video' ? (
                <video
                  src={mainMedia}
                  controls
                  className="rounded-xl object-cover w-full h-full"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              ) : (
                <Image
                  src={mainMedia}
                  alt="main preview"
                  width={340}
                  height={420}
                  className="rounded-xl object-cover w-full h-full"
                />
              )
            ) : (
              <span className="text-gray-400">No media selected</span>
            )}
          </div>
          {/* Thumbnails */}
          <div className="flex flex-row gap-3 items-center justify-center flex-wrap">
            {mediaFiles.map((file) => (
              <div key={file.id} className="relative group">
                <button
                  type="button"
                  className={`w-20 h-20 rounded-lg border-2 ${mainMedia === file.url ? 'border-[#F25E26]' : 'border-gray-200'} overflow-hidden focus:outline-none hover:border-[#F25E26] transition-colors relative flex items-center justify-center bg-white`}
                  onClick={() => setMainMedia(file.url)}
                  tabIndex={0}
                >
                  {file.type === 'video' ? (
                    <>
                      <video
                        src={file.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-black text-xs">
                          ▶
                        </span>
                      </div>
                    </>
                  ) : (
                    <Image
                      src={file.url}
                      alt="Product Thumbnail"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMedia(file.id);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>
          {/* File Upload */}
          <label htmlFor="upload-files" className="bg-gray-50 rounded-md shadow hover:bg-[#FCDFD4] h-40 w-full max-w-xs flex justify-center items-center cursor-pointer flex-col border border-dashed border-gray-300 mt-6 transition-colors">
            <FiUpload className="text-4xl mb-2 text-[#F25E26]" />
            <span className="text-gray-500 text-base">Select file to upload</span>
            <span className="text-xs text-gray-400">You may upload up to 5 images</span>
            <input
              id="upload-files"
              type="file"
              accept="image/*, video/*"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
          </label>
          <div className="text-xs text-rose-500 pt-1">{errors?.regular_media?.message}</div>
        </div>

        {/* Right: Form Fields */}
        <form id="auction-upload-form" onSubmit={handleSubmit(sumbitForm)} className="flex-1 flex flex-col gap-6 max-w-lg w-full">
          <InputField
            label="Product Name:"
            type="text"
            name="product_name"
            register={register}
            errors={errors}
            classname="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
          />
          <SelectField
            name="auction_category"
            label="Category:"
            register={register}
            errors={errors}
            options={catnew?.map((cat) => ({ label: cat.label, value: cat.value })) || []}
            classname="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
          />
          <SelectField
            name="sub_category"
            label="Sub Category:"
            register={register}
            errors={errors}
            options={catnew?.find((cat) => cat.id === watch("auction_category"))?.subcategories?.map((sub) => ({ label: sub.subcategory, value: sub.id })) || []}

            classname="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
          />
          <TextAreaField
            name="description"
            label="Description:"
            register={register}
            errors={errors}
            placeholder={"Describe your product here..."}
            classname="w-full px-5 h-24 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
          />
          {/* Weight & Quantity */}
          <div className="flex flex-row gap-4">
            <InputField
              name="weight"
              label="Weight (kg):"
              type="text"
              placeholder="20kg"
              register={register}
              errors={errors}
              classname="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
            />
            <InputField
              name="quantity"
              label="Quantity:"
              type="number"
              min={1}
              register={register}
              errors={errors}
              classname="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
            />
          </div>
          {/* Last Price & Ticket Price */}
          <div className="flex flex-row gap-4">
            <InputField
              name="cost_price"
              label="Last Price:"
              type="text"
              placeholder="₦5,000"
              register={register}
              errors={errors}
              classname="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
            />
            <InputField
              name="ticket_price"
              label="Ticket Price:"
              type="text"
              placeholder="₦200"
              register={register}
              errors={errors}
              classname="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
            />
          </div>
          {/* Start/End Time */}
          <div className="flex flex-row gap-4">
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">Start time:</label>
              <Controller
                control={control}
                name="auction_starttime"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value && /^\d{2}:\d{2} (AM|PM)$/.test(field.value)
                      ? new Date(`1970-01-01T${convertTo24Hour(field.value)}`)
                      : null}
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
                    placeholderText="3:00 PM"
                    className="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
                  />
                )}
              />
              <p className="text-xs text-rose-500 pt-1">{errors?.auction_starttime?.message}</p>
            </div>
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">End Time:</label>
              <Controller
                control={control}
                name="auction_endtime"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value && /^\d{2}:\d{2} (AM|PM)$/.test(field.value)
                      ? new Date(`1970-01-01T${convertTo24Hour(field.value)}`)
                      : null}
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
                    placeholderText="6:00 PM"
                    className="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
                  />
                )}
              />
              <p className="text-xs text-rose-500 pt-1">{errors?.auction_endtime?.message}</p>
            </div>
          </div>
          {/* Date & Duration */}
          <div className="flex flex-row gap-4">
            <div className="w-full">
              <label htmlFor="auction_date" className="text-sm font-medium text-gray-700">Date:</label>
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
                    placeholderText="4 March, 2024"
                    className="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
                  />
                )}
              />
              <p className="text-xs text-rose-500 pt-1">{errors?.auction_date?.message}</p>
            </div>
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">Duration:</label>
              <input
                type="text"
                className="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
                value={productDetails?.duration || '2 hr : 00 mins'}
                disabled
              />
            </div>
          </div>
          {/* Update Button */}
          <div className="flex justify-center items-center mt-8 mb-10 w-full">
            <DefaultButton
              handleClick={() => null}
              className="w-full max-w-md text-base font-medium px-20 py-3 rounded-lg bg-[#FCDFD4] text-[#222] transition duration-300 ease-in-out hover:bg-[#E84526] hover:text-white shadow"
              type="submit"
              form="auction-upload-form"
              text={status === "pending" ? "loading..." : "Update"}
            />
          </div>
        </form>
      </div>
      {/* Success Modal */}
      {showModal && (
        <div className="flex absolute top-0 z-50 left-0 w-full h-full bg-black bg-opacity-30 items-center justify-center">
          <Modal
            title="Product Upload Successful!"
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
      <ToastContainer />
    </section>
  );
}
