import {
  CheckboxField,
  InputField,
  SelectField,
  TextAreaField,
} from "@/app/components/FormField";
import { useEffect, useState } from "react";
import { useMutateData } from "@/hooks/useMutateData";
import { DefaultButton } from "@/app/components/Button";
import { categories, subcategories } from "@/app/data";
import { useRouter } from "next/navigation";
import { FiUpload } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { ProductUploadSchema } from "@/helper/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import { useStore, useNewProductStore } from "@/store/nav-store";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "./Modal";
import successIcon from "@/app/asset/signout.svg";
import { setLocalStoreData } from "@/hooks/useLocalStorage";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { useQueryData } from "@/hooks/useQueryDataCat";

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

export const Regular = () => {
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
    resolver: yupResolver(ProductUploadSchema),
  });

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleFileChange = (e: FileChangeEvent): void => {
    const selected: File[] = Array.from(e.target.files);
    const previous = (watch("regular_media") as string[]) ?? [];
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
        setValue("regular_media", [...previous, ...base64Files]);
        trigger("regular_media");
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
    const currentMedia = (watch("regular_media") as string[]) ?? [];
    const nextMedia = currentMedia.filter((_, i) => i !== index);
    setValue("regular_media", nextMedia);
    trigger("regular_media");
  };

  const handleSuccess = (data: any) => {
    if (data.status === 200) {
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
      // Attempt to map server validation to fields without clearing form
      const msg: string = data?.data?.message || '';
      if (msg.toLowerCase().includes('price')) {
        if (msg.includes('selling') || msg.includes('price')) {
          setError('selling_price' as any, { type: 'server', message: 'Please enter a valid amount' } as any);
        }
        if (msg.includes('cost')) {
          setError('cost_price' as any, { type: 'server', message: 'Please enter a valid amount' } as any);
        }
        if (msg.includes('discount')) {
          setError('discount' as any, { type: 'server', message: 'Please enter a valid amount' } as any);
        }
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
    // Do not reset on error; keep user inputs intact
  };

  const { data, error, mutate, status } = useMutateData(
    "upload",
    handleSuccess,
    handleError,
  );

  const parseAmount = (value: unknown): number => {
    if (value === null || value === undefined) return NaN;
    const numeric = String(value).replace(/[^0-9.]/g, "");
    return numeric ? Number(numeric) : NaN;
  };

  const sumbitForm = (data: any) => {
    const regularMedia = watch("regular_media") as string[];

    const selling = parseAmount(data.selling_price);
    const cost = parseAmount(data.cost_price);
    const discount = parseAmount(data.discount);

    if (!isNaN(discount) && !isNaN(selling) && discount > selling) {
      setError("discount" as any, {
        type: "manual",
        message: "Discount price cannot exceed selling price",
      } as any);
      toast.error("Discount price cannot exceed selling price", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }

    if (!isNaN(discount) && !isNaN(cost) && discount < cost) {
      setError("discount" as any, {
        type: "manual",
        message: "Discount price cannot be less than cost price",
      } as any);
      toast.error("Discount price cannot be less than cost price", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }

    const formData = new FormData();
    formData.append("product_name", data.product_name);
    formData.append("product_category", data.product_category);
    formData.append("sub_category", data.sub_category);
    formData.append("quantity", data.quantity);
    formData.append("weight", data.weight);
    formData.append("selling_price", data.selling_price);
    formData.append("cost_price", data.cost_price);
    formData.append("discount", data.discount);
    formData.append("description", data.description);
    formData.append("topdeals", data.topdeals);
    formData.append("featured", data.featured);

    regularMedia.forEach((file, index) => {
      formData.append(`regular_media[${index}]`, file);
    });

    const Payload = {
      name: data.product_name,
      category: data.product_category,
      subcategory: data.sub_category,
      price: data.selling_price,
      cost_price: data.cost_price,
      discount: data.discount,
      quantity: data.quantity,
      weight: `${data.weight}KG`,
      featured: data.featured,
      top_deals: data.topdeals,
      description: data.description,
      product_images: regularMedia,
    };

    mutate({
      url: "/api/upload",
      payload: Payload,
    });

    setLocalStoreData({
      name: "regularProduct",
      obj: { ...data, regularMedia },
    });
  };

  return (
    <>
      <ToastContainer closeOnClick />
      <section
        className={`my-10 px-4 md:px-10 lg:px-20 ${
          isNavbarOpen ? "justify-center items-center " : ""
        } flex-col flex`}
      >
        <h1
          className="xl:text-2xl 2xl:text-2xl md:text-2xl text-base font-Poppins font-semibold pb-6 leading-tight tracking-tight underline underline-offset-4"
        >
          Product Details
        </h1>

        <form
          onSubmit={handleSubmit(sumbitForm)}
          encType={"multipart/form-data"}
        >
          <div className="flex gap-8 md:gap-12 my-8 md:flex-row flex-col-reverse">
            {/* Left Column - Product Upload */}
            <div className="flex-1">
              <div className="flex flex-col">
                <label htmlFor="upload-files">
                  <p className="py-2 font-Poppins font-medium text-gray-700">Product Upload:</p>
                  <div className="bg-gray-50 relative rounded-lg border-2 border-dashed border-gray-300 hover:border-[#FCDFD4] hover:bg-gray-100 h-48 md:h-[280px] w-full flex justify-center items-center cursor-pointer flex-col transition-all duration-200">
                    <FiUpload className="text-5xl text-gray-400 mb-4" />
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="mb-2 text-base md:text-lg font-Poppins font-medium text-gray-600">
                        Select files to upload
                      </p>
                      <p className="text-xs md:text-sm font-Poppins text-gray-500">
                        You may upload up to 4 images 
                      </p>
                    </div>
                  </div>

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
                <div className="text-xs text-rose-500 pt-1 font-Poppins">
                  {errors?.regular_media?.message}
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

              {/* Product Attributes */}
              <div className="mt-8">
                <div className="flex gap-8 mb-6">
                  <CheckboxField
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
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <InputField
                    name="quantity"
                    label="Quantity"
                    type="number"
                    min={1}
                    max={999999}
                    register={register}
                    errors={errors}
                    classname="text-sm w-full px-4 h-12 border border-gray-300 rounded-lg font-Poppins font-normal focus:outline-none focus:border-[#FCDFD4] focus:ring-1 focus:ring-[#FCDFD4]"
                  />
                  <InputField
                    name="weight"
                    label="Weight"
                    type="text"
                    placeholder="50kg"
                    register={register}
                    errors={errors}
                    classname="text-sm w-full px-4 h-12 border border-gray-300 rounded-lg font-Poppins font-normal focus:outline-none focus:border-[#FCDFD4] focus:ring-1 focus:ring-[#FCDFD4]"
                    maxLength={10}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <InputField
                    name="selling_price"
                    label="Selling Price"
                    type="text"
                    placeholder="N 6,000"
                    register={register}
                    errors={errors}
                    classname="text-sm w-full px-4 h-12 border border-gray-300 rounded-lg font-Poppins font-normal focus:outline-none focus:border-[#FCDFD4] focus:ring-1 focus:ring-[#FCDFD4]"
                    isAmount
                    maxLength={20}
                  />
                  <InputField
                    name="cost_price"
                    label="Cost Price"
                    type="text"
                    placeholder="N 4,800"
                    register={register}
                    errors={errors}
                    classname="text-sm w-full px-4 h-12 border border-gray-300 rounded-lg font-Poppins font-normal focus:outline-none focus:border-[#FCDFD4] focus:ring-1 focus:ring-[#FCDFD4]"
                    isAmount
                    maxLength={20}
                  />
                </div>

                <div className="mb-6">
                  <InputField
                    name="discount"
                    label="Discount Price"
                    type="text"
                    placeholder="N 5,500"
                    register={register}
                    errors={errors}
                    classname="text-sm w-full px-4 h-12 border border-gray-300 rounded-lg font-Poppins font-normal focus:outline-none focus:border-[#FCDFD4] focus:ring-1 focus:ring-[#FCDFD4]"
                    isAmount
                    maxLength={20}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Product Information */}
            <div className="flex-1">
              <div className="flex flex-col gap-6">
                <InputField
                  name="product_name"
                  label="Product Name:"
                  type="text"
                  placeholder="Rice"
                  register={register}
                  errors={errors}
                  classname="text-sm w-full h-12 px-4 border border-gray-300 rounded-lg font-Poppins font-normal focus:outline-none focus:border-[#FCDFD4] focus:ring-1 focus:ring-[#FCDFD4]"
                />
                
                <SelectField
                  name="product_category"
                  label="Category"
                  register={register}
                  errors={errors}
                  options={catnew?.map((cat) => ({
                    label: cat.label,
                    value: cat.value,
                  }))}
                  classname="text-sm w-full h-12 px-4 border border-gray-300 rounded-lg font-Poppins font-normal focus:outline-none focus:border-[#FCDFD4] focus:ring-1 focus:ring-[#FCDFD4]"
                />
                
                <SelectField
                  name="sub_category"
                  label="Sub Category"
                  register={register}
                  errors={errors}
                  options={
                    catnew
                      ?.find((cat) => cat.id === watch("product_category"))
                      ?.subcategories?.map((sub) => ({
                        label: sub.subcategory,
                        value: sub.id,
                      })) || []
                  }
                  classname="text-sm w-full h-12 px-4 border border-gray-300 rounded-lg font-Poppins font-normal focus:outline-none focus:border-[#FCDFD4] focus:ring-1 focus:ring-[#FCDFD4]"
                />
                
                <TextAreaField
                  name="description"
                  label="Product Description:"
                  register={register}
                  errors={errors}
                  placeholder="Lorem ipsum dolor sit amet consectetur. ultricies..."
                  classname="resize-none px-4 py-3 h-28 md:h-32 focus:text-black border border-gray-300 rounded-lg font-Poppins font-normal focus:outline-none focus:border-[#FCDFD4] focus:ring-1 focus:ring-[#FCDFD4] w-full"
                  maxLength={500}
                />
              </div>
            </div>
          </div>

          <div className="py-8 flex justify-center">
            <DefaultButton
              text={status === "pending" ? "Loading..." : "Upload"}
              type="submit"
              handleClick={() => null}
              className="bg-[#FCDFD4] p-4 text-sm w-full md:w-[12em] hover:bg-[#F25E26] hover:text-white rounded-lg font-Poppins font-medium transition-all duration-200"
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
