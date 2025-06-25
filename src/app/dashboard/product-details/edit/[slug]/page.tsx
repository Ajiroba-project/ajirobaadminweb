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
import { FiUpload } from "react-icons/fi";
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

  const params = useParams();
  const productId = params.slug;

  const [selectedImg, setSelectedImg] = useState<string[]>([]);


  const [userToken, setUserToken] = useState(Cookies.get("token"));

  let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/admin_products/`;

  const { data: productInfo, isLoading: productLoading } = useGetDatanew(
    url,
    "get_product_details",
    userToken || " "
  );


  const productDetails = Array.isArray(productInfo?.data)
    ? productInfo.data.find((product: any) => product.id === productId)
    : null;


  useEffect(() => {
    if (productDetails?.images) {
      const images = productDetails.images.map(
        (img: any) => `https://staging.ajiroba.ng/media/${img.image}`
      );
      setSelectedImg(images);
      setMainImage(images[0]);
    }
  }, [productDetails]);


  const router = useRouter();

  const [mainImage, setMainImage] = useState<string>(selectedImg[0]);

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
  });


  const RemoveImg = (val: string) => {
    setSelectedImg(selectedImg.filter((e: string) => e !== val));
    URL.revokeObjectURL(val);
  };

  const [previews, setPreviews] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

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
    } else if (data.status === 400 || data.status === 409 || data.status === 405) {
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

    };



    mutate({
      url: "/api/editproduct",
      payload: {
        ...Payload,
        id: productId,
      },

    });

  };


  if (productLoading) return <p>Loading product details...</p>;

  return (
    <section className="flex-col flex justify-center">
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

      <form id="product-upload-form" onSubmit={handleSubmit(sumbitForm)}
        className="flex justify-around gap-20 items-center lg:flex-row flex-col-reverse"
        style={{
          margin: "0 auto",
          width: "90%",
          maxWidth: "100%",
        }}
      >
        <div className="flex-1 mt-12 ">
          <div className="w-12/12 flex flex-col md:flex-row gap-6 p-6 ">
            <div className="flex md:flex-col gap-2 flex-wrap  ">
              {selectedImg.map((val: string, key: number) => (
                <div
                  key={key}
                  className="w-20 md:w-24 h-20 md:h-24 object-cover "
                  onClick={() => setMainImage(val)}
                >
                  <Image
                    src={val}
                    alt="Product Thumbnail"
                    width={100}
                    height={100}
                    className="w-20 md:w-24 h-20 md:h-24 object-cover "
                  />
                </div>
              ))}

              <div className="w-20 md:w-24 h-20 md:h-24 flex items-center justify-center border border-gray-300 bg-gray-200">
                <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                  ▶
                </button>
              </div>
            </div>

            <div className="flex-1">
              <Image
                src={mainImage}
                alt="main preview"
                width={240}
                height={340}
                className="w-full h-auto bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div className=" flex flex-col mt-5  ">
          <div className="flex gap-2 flex-col">
            <InputField
              label="Product name"
              type="text"
              name="product_name"
              register={register}
              errors={errors}
              classname={"w-full px-5 h-12 focus:text-black border rounded "}
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
              classname={"w-full px-5 h-12 focus:text-black border rounded "}
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
              classname={"w-full px-5 h-12 focus:text-black border rounded "}
            />
            <TextAreaField
              label="description"
              name="description"
              register={register}
              errors={errors}
              placeholder={""}
              classname={"w-full px-5 h-24 focus:text-black border rounded "}
            />

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

              <div className="flex gap-12 mb-4 flex-col lg:flex-row md:flex-row ">
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

              <div className="flex gap-2  flex-col lg:flex-row md:flex-row ">
                <InputField
                  name="quantity"
                  label="Quantity"
                  type="number"
                  register={register}
                  errors={errors}
                  classname={`text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                />
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
              <div className="flex gap-2 py-8 flex-col lg:flex-row md:flex-row ">
                <InputField
                  name="selling_price"
                  label="Selling Price"
                  type="text"
                  placeholder="₦1234"
                  register={register}
                  errors={errors}
                  classname={`text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                />
                <InputField
                  name="discount"
                  label="Discount"
                  type="text"
                  placeholder="₦100"
                  register={register}
                  errors={errors}
                  classname={`text-sm w-auto px-5 h-12  border border-gray-300 rounded-lg font-Inter font-normal focus:outline-none`}
                />
              </div>
            </div>
          </div>
        </div>

      </form>


      <div className="flex justify-center items-center mt-12  mb-10">
        <DefaultButton
          handleClick={() => null}
          className="text-sm  px-20  justify-center flex font-normal font-Poppins rounded-lg bg-[#FCDFD4]  py-2 transition delay-300 duration-300 ease-in-out hover:bg-[#E84526] hover:text-white hover:transition-all"
          type="submit"
          form="product-upload-form"
          text={status === "pending" ? "loading..." : "Update"}
        />
      </div>


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

    </section>
  );
}
