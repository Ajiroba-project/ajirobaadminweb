"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RegistrationHeader } from "@/app/components/Header";
import { DefaultButton } from "@/app/components/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ProductEditUploadSchema,
  ProductUploadSchema,
} from "@/helper/validation";
import { categories, subcategories } from "@/app/data";
import {
  CheckboxField,
  InputField,
  SelectField,
  TextAreaField,
} from "@/app/components/FormField";
import { FiUpload, FiX } from "react-icons/fi";
import { useMutateData } from "@/hooks/useMutateData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setLocalStoreData } from "@/hooks/useLocalStorage";
import { Modal } from "@/app/dashboard/components/Modal";
import successIcon from "@/app/asset/signout.svg";
import { useQueryData } from "@/hooks/useQueryDataCat";
import { useSearchParams, useParams } from 'next/navigation'
import { useGetDatanew } from "@/hooks/useGetData";
import Cookies from "js-cookie";

interface Subcategory {
  id: string;
  subcategory: string;
  name?: string;
  category?: string;
  data?: any;
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

interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video';
  isExisting: boolean;
  base64?: string;
}

export default function Page() {
  const params = useParams();
  const productId = Array.isArray((params as any)?.slug)
    ? (params as any).slug[0]
    : String((params as any)?.slug ?? "");

  // Single state for all media files
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [mainImage, setMainImage] = useState<string>('');
  const [userToken] = useState(Cookies.get("token"));

  let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/admin_products/`;

  const { data: productInfo, isLoading: productLoading } = useGetDatanew(
    url,
    "get_product_details",
    userToken || " "
  );

  const productDetails = Array.isArray(productInfo?.data)
    ? productInfo.data.find((product: any) => String(product.id) === String(productId))
    : null;

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
        setMainImage(existingMedia[0].url);
      }
    }
  }, [productDetails]);

  const router = useRouter();

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
    resolver: yupResolver(ProductEditUploadSchema),
    defaultValues: {
      product_name: productDetails?.name || "",
      product_category: productDetails?.category || "",
      sub_category: productDetails?.subcategory || "",
      quantity: productDetails?.quantity || "",
      weight: productDetails?.weight?.replace('KG', '') || "",
      selling_price: productDetails?.price || "",
      discount: productDetails?.discount || "",
      description: productDetails?.description || "",
      topdeals: productDetails?.top_deals || false,
      featured: productDetails?.featured || false,
      regular_media: []
    }
  });


  const [showModal, setShowModal] = useState(false);

  // Helper function to check if a file is a video
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

      // Find the file being removed to clean up blob URL
      const fileToRemove = prevFiles.find(file => file.id === mediaId);
      if (fileToRemove && fileToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.url);
      }

      // Update main image if it was the removed file
      if (fileToRemove && mainImage === fileToRemove.url) {
        setMainImage(updatedFiles.length > 0 ? updatedFiles[0].url : '');
      }

      // Update form data
      const newMediaBase64 = updatedFiles
        .filter(file => !file.isExisting && file.base64)
        .map(file => file.base64!);
      setValue("regular_media", newMediaBase64);

      return updatedFiles;
    });
  };

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleFileChange = (e: FileChangeEvent): void => {
    const files: File[] = Array.from(e.target.files);
    const currentNewFiles = mediaFiles.filter(file => !file.isExisting);

    if (currentNewFiles.length + files.length > 5) {
      toast.error('You can only upload up to 5 new files');
      return;
    }

    // Convert files to base64 and create media objects
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

        // Update form data with base64 strings
        const allBase64 = [
          ...mediaFiles.filter(file => !file.isExisting && file.base64).map(file => file.base64!),
          ...newMediaFiles.map(file => file.base64!)
        ];
        setValue("regular_media", allBase64);
        trigger("regular_media");

        // Set first uploaded file as main image if none selected
        if (!mainImage && newMediaFiles.length > 0) {
          setMainImage(newMediaFiles[0].url);
        }
      })
      .catch((error) => {
        console.error("Error converting files to base64:", error);
        toast.error("Error processing files");
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

  // Prefill form when both product and categories are available
  useEffect(() => {
    if (!productDetails || !catInfo?.data) return;

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
      product_category: resolvedCategoryId,
      sub_category: resolvedSubId,
      quantity: productDetails.quantity || "",
      weight: productDetails.weight?.replace('KG', '') || "",
      selling_price: productDetails.price || "",
      discount: productDetails.discount || "",
      description: productDetails.description || "",
      topdeals: productDetails.top_deals || false,
      featured: productDetails.featured || false,
      regular_media: []
    });
  }, [productDetails, catInfo, reset]);

  const handleSuccess = (data: any) => {
    if (data.status === 200 || data.status === 201) {
      setShowModal(true);
      setLocalStoreData(data);
      // Clean up blob URLs
      mediaFiles.forEach(file => {
        if (file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
      setMediaFiles([]);
      reset();
    } else if (data.status === 400 || data.status === 409 || data.status === 405) {
      toast.error(`${data?.data?.message || 'An error occurred'}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error(`${data?.data?.message || 'An error occurred'}`, {
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
    toast.error("An Error Occurred", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const { data, error, mutate, status } = useMutateData(
    "upload",
    handleSuccess,
    handleError,
  );

  const submitForm = (data: any) => {
    const regularMedia = watch("regular_media") as string[];

    const payload = {
      name: data.product_name,
      category: data.product_category,
      subcategory: data.sub_category,
      price: data.selling_price,
      discount: data.discount,
      quantity: data.quantity,
      weight: `${data.weight}KG`,
      featured: data.featured,
      top_deals: data.topdeals,
      description: data.description,
      product_images: regularMedia,
      id: productId,
    };

    mutate({
      url: "/api/editproduct",
      payload,
    });
  };

  if (productLoading) return <p>Loading product details...</p>;

  return (
    <section className="min-h-screen bg-[#FAFAFA] w-full flex flex-col items-center font-poppins">
      {/* Header */}
      <div className="w-full bg-[#F6F6F6] border-b border-[#F3F3F3] flex flex-col">
        <nav className="flex items-center justify-between px-6 pt-8 pb-2">
          <div className="">
            <RegistrationHeader />
            <div className="container pl-14 mt-2 md:block flex justify-center">
              <span onClick={() => router.back()} className="text-[#F25E26] underline cursor-pointer text-sm font-medium">Back</span>
            </div>
          </div>
          <div className="w-24" />
        </nav>
        <h1 className="text-xl md:text-2xl font-semibold text-center mb-2">Regular Product Upload</h1>
      </div>

      {/* Main Content */}
      <form id="product-upload-form" onSubmit={handleSubmit(submitForm)}
        className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl px-4 py-10"
        style={{ margin: "0 auto" }}
      >
        {/* Left: Image Gallery */}
        <div className="flex flex-col lg:flex-row flex-1 gap-8 items-center justify-center">
          <div className="flex flex-row lg:flex-col gap-3 items-center lg:items-start">
            {/* Media thumbnails */}
            {mediaFiles.map((file) => (
              <div key={file.id} className="relative group">
                <button
                  type="button"
                  className={`w-20 h-20 rounded-lg border-2 ${mainImage === file.url ? 'border-[#F25E26]' : 'border-gray-200'} overflow-hidden focus:outline-none hover:border-[#F25E26] transition-colors relative`}
                  onClick={() => setMainImage(file.url)}
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

          {/* Main Preview */}
          <div className="flex-1 flex items-center justify-center">
            {mainImage ? (
              <>
                {mediaFiles.find(file => file.url === mainImage)?.type === 'video' ? (
                  <video
                    src={mainImage}
                    controls
                    className="rounded-xl shadow bg-gray-100 object-cover w-[320px] h-[400px]"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                ) : (
                  <Image
                    src={mainImage}
                    alt="main preview"
                    width={320}
                    height={400}
                    className="rounded-xl shadow bg-gray-100 object-cover w-[320px] h-[400px]"
                  />
                )}
              </>
            ) : (
              <div className="w-[320px] h-[400px] rounded-xl shadow bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No media selected</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Form Fields */}
        <div className="flex-1 flex flex-col gap-6 max-w-lg w-full">
          <InputField
            label="Product Name:"
            type="text"
            name="product_name"
            register={register}
            errors={errors}
            classname="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
          />
          <SelectField
            name="product_category"
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
            options={catnew?.find((cat) => cat.id === watch("product_category"))?.subcategories?.map((sub) => ({ label: sub.subcategory, value: sub.id })) || []}
            classname="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
          />
          <TextAreaField
            label="Description:"
            name="description"
            register={register}
            errors={errors}
            placeholder={""}
            classname="w-full px-5 h-24 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
          />

          {/* File Upload */}
          <div className="flex flex-col gap-2">
            <label htmlFor="upload-files" className="text-base font-medium text-[#353131]">Product Upload:</label>
            <label htmlFor="upload-files" className="bg-gray-50 rounded-md shadow hover:bg-[#FCDFD4] h-40 flex justify-center items-center cursor-pointer flex-col border border-dashed border-gray-300 transition-colors">
              <FiUpload className="text-4xl mb-2 text-[#F25E26]" />
              <span className="text-gray-500 text-base">Select file to upload</span>
              <span className="text-xs text-gray-400">You may upload up to 5 images</span>
            </label>
            <input
              id="upload-files"
              type="file"
              accept="image/*, video/*"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
            <div className="text-xs text-rose-500 pt-1">{errors?.regular_media?.message}</div>
          </div>

          <div className="flex flex-row gap-4">
            <CheckboxField
              label=""
              name="topdeals"
              register={register}
              errors={errors}
              options={["Top Deals"]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue("topdeals", e.target.checked)}
              classname="mt-2"
            />
            <CheckboxField
              label=""
              name="featured"
              register={register}
              errors={errors}
              options={["Featured"]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue("featured", e.target.checked)}
              classname="mt-2"
            />
          </div>
          <div className="flex flex-row gap-4">
            <InputField
              name="quantity"
              label="Quantity:"
              type="number"
              min={1}
              register={register}
              errors={errors}
              classname="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
            />
            <InputField
              name="weight"
              label="Weight:"
              type="text"
              placeholder="20"
              register={register}
              errors={errors}
              classname="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
            />
          </div>
          <div className="flex flex-row gap-4">
            <InputField
              name="selling_price"
              label="₦"
              type="text"
              placeholder="N 5,000"
              register={register}
              errors={errors}
              classname="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
            />
            <InputField
              name="discount"
              label="Discount Price:"
              type="text"
              placeholder="N 5,000"
              register={register}
              errors={errors}
              classname="w-full px-5 h-12 border border-gray-300 rounded-lg text-base font-normal focus:text-black focus:border-[#F25E26]"
            />
          </div>
        </div>
      </form>

      {/* Update Button */}
      <div className="flex justify-center items-center mt-8 mb-10 w-full">
        <DefaultButton
          handleClick={() => null}
          className="w-full max-w-md text-base font-medium px-20 py-3 rounded-lg bg-[#FCDFD4] text-[#222] transition duration-300 ease-in-out hover:bg-[#E84526] hover:text-white shadow"
          type="submit"
          form="product-upload-form"
          text={status === "pending" ? "loading..." : "Update"}
        />
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