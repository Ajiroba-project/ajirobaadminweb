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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Page = () => {
  const [selectedImg, setSelectedImg] = useState<any>([]);

  const [formData, setFormData] = useState({
    productName: "",
    subCategory: "",
    description: "",
    lastPrice: "",
    ticketPrice: "",
    startTime: "",
    endTime: "",
    date: "",
    duration: "",
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    /*   console.log("Form Data Submitted:", formData); */

    // Add logic to send data to the backend
    alert("Product Updated Successfully!");
  };


  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4 lg:p-8">
      <button
        className="text-red-500 mb-4 text-sm hover:underline"
        onClick={() => router.back()}
      >
        Back
      </button>
      <h1 className="text-2xl font-bold text-center mb-6">Auction Product Upload</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section - Image Gallery */}
        <div>
          <div className="mb-4">
            <Image
              src="https://via.placeholder.com/400"
              alt="Product"
              className="w-full rounded-lg"
              width={400}
              height={400}
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, index) => (
              <Image
                key={index}
                width={100}
                height={100}
                src="https://via.placeholder.com/100"
                alt={`Thumbnail ${index}`}
                className="w-full h-20 rounded-lg object-cover"
              />
            ))}
          </div>
        </div>

        {/* Right Section - Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <div>
            <label htmlFor="productName" className="block text-sm font-semibold">
              Product Name:
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label htmlFor="subCategory" className="block text-sm font-semibold">
              Sub Category:
            </label>
            <Select value={formData.subCategory} onValueChange={(val) => setFormData(prev => ({ ...prev, subCategory: val }))}>
              <SelectTrigger className="w-full h-10 rounded border px-3 selector mt-1">
                <SelectValue placeholder="Select a sub-category" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: '#ffffff', color: '#2A2A2A' }}>
                <SelectItem value="Ralph Lauren Men T-shirt" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Ralph Lauren Men T-shirt</SelectItem>
                {/* Add more options as needed */}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold">
              Description:
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 mt-1"
              rows={3}
              placeholder="Enter product description"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lastPrice" className="block text-sm font-semibold">
                Last Price:
              </label>
              <input
                type="text"
                name="lastPrice"
                value={formData.lastPrice}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="Enter last price"
                required
              />
            </div>
            <div>
              <label htmlFor="ticketPrice" className="block text-sm font-semibold">
                Ticket Price:
              </label>
              <input
                type="text"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="Enter ticket price"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-semibold">
                Start Time:
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-semibold">
                End Time:
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-semibold">
                Date:
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-semibold">
                Duration:
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="e.g., 2 hrs : 00 mins"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#F6CDC7] text-white font-semibold py-2 rounded-lg hover:bg-[#E4BDB9]"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
