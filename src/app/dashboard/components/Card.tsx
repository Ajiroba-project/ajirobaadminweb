
'use client';
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Fragment, useMemo, useState } from "react";
import Link from "next/link"
import { MdOutlineEdit } from "react-icons/md";
import { Pagination } from "@/app/components/Pagination";
import { div } from "framer-motion/m";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "900"] });
type cardProps = {
  title?: string;
  object?: Array<any>;
};

   interface Product {
        name: string;
        category_name: string;
        subcategory_name: string;
        price: number;
        discount: number;
        description: string;
        images: { image: string }[];
        id?: string
      }


export const Card = ({ title, object }: cardProps) => {

  return (
    <section
      className={`${poppins.className} border-2 border-gray-100 rounded-lg p-4 shadow `}
    >
      <h1 className="text-xl pb-2">{title}</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 justify-center items-center gap-4 ">
        {object?.map((val, index) => (
          <div
            className={`${index === 0
                ? "bg-[#FCDFD44D]"
                : index === 1
                  ? "bg-[#D1DEF64D]"
                  : index === 2
                    ? "bg-[#D7F8EE4D]"
                    : "bg-[#F9F2CC99]"
              } p-6 h-[10em] w-auto rounded-lg hover:shadow-md cursor-pointer flex flex-col gap-3 items-center justify-center text-center`}
            key={index}
          >
            <div className="flex items-center justify-center">
              <Image src={val.icon} alt={val.name} />
            </div>
            <div className="">{val.name}</div>
            <h2 className="leading-2 font-bold">{val.count}</h2>
          </div>
        ))}
      </div>
    </section>
  );
};



export const ProductListCard = ({ object }: cardProps) => {

    const [currentPage, setCurrentPage] = useState<number>(0);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [itemsPerPage] = useState<number>(5);

   useMemo(() => {
    if (object) {
      const filteredProducts = object.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      );
      setFilteredData(filteredProducts);
    }
  }, [currentPage, itemsPerPage, object]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const pageCount = Math.ceil((object?.length || 0) / itemsPerPage);

  return (

    <div>

 <section className="py-4 grid lg:grid-cols-3 gap-4 w-full">

      {filteredData?.map((val: Product, index: number) => (
        <Fragment key={index}>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg">{val.name}</p>
              <Image
                src={`https://ajiroba.onrender.com/media/${val?.images[0]?.image}`}
                alt={val.category_name}
                height={50}
                width={50}
                className="rounded-full "
              />
            </div>

            <div className="py-2 mt-5 grid-cols-2 grid gap-y-2 gap-x-3">
              <h4 className="text-[#A09F9F] text-base font-Poppins">Category:</h4>
              <p className="text-sm font-Poppins text-[#2A2A2A] ">
                {val.category_name.length > 100
                  ? val.category_name.slice(0, 50) + "..."
                  : val.category_name}
              </p>
              <h4 className="text-[#A09F9F] text-base font-Poppins">Sub category:</h4>
              <p className="text-sm font-Poppins text-[#2A2A2A] ">{val.subcategory_name}</p>
              <h4 className="text-[#A09F9F] text-base font-Poppins">Selling Price:</h4>
              <p className="text-sm font-Poppins text-[#2A2A2A] ">{val.price}</p>
              <h4 className="text-[#A09F9F] text-base font-Poppins">Discount Price:</h4>
              <p className="text-sm font-Poppins text-[#2A2A2A] ">{val.discount}</p>
              <h4 className="text-[#A09F9F] text-base font-Poppins">Product Description:</h4>
              <p className="text-sm font-Poppins text-[#2A2A2A] ">
                {val.description.length > 100
                  ? val.description.slice(0, 50) + "..."
                  : val.description}
              </p>

              <div className="pt-4 ">
                <Link
                  href={`/dashboard/product-details/edit/${val.id}`}
                  className="bg-[#FCDFD4] flex gap-2 rounded-lg  p-2 font-Poppins text-sm items-center "
                >
                  <MdOutlineEdit className="text-lg" />
                  Edit product
                </Link>
              </div>
            </div>
          </div>
        </Fragment>
      ))}
    </section>

       <Pagination
            pageCount={pageCount}
            onPageChange={({ selected }) => handlePageChange(selected)}
            className='my-6 flex items-center justify-center gap-4 '
          />
    </div>


  );
};






export const AuctionListCard = ({ object }: cardProps) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [itemsPerPage] = useState<number>(7);

    //  console.log(object, 'objjj');

  useMemo(() => {
    if (object) {
      const filteredProducts = object.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      );
      setFilteredData(filteredProducts);
    }
  }, [currentPage, itemsPerPage, object]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const pageCount = Math.ceil((object?.length || 0) / itemsPerPage);

  return (

    <div>
 <section className="py-4 grid lg:grid-cols-3 gap-4 w-full">
      {filteredData?.map((val: any, index: number) => (
        <Fragment key={index}>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg">{val.name}</p>
               <Image
              src={`https://ajiroba.onrender.com/media/${val?.images[0]?.image}`}
                alt={val.category_name}
                height={50}
                width={50}
                className="rounded-full "
              />
            </div>

            <div className="py-2 mt-5 grid-cols-2 grid gap-y-2">
              <h4 className="text-[#A09F9F] text-base font-Poppins">Category:</h4>
              <p>{val.category_name}</p>
              <h4 className="text-[#A09F9F] text-base font-Poppins">Sub category:</h4>
              <p>{val.subcategory_name}</p>
              <h4 className="text-[#A09F9F] text-base font-Poppins">Date of auction:</h4>
              <p>{val.start_date || 'N/A'}</p>
              <h4 className="text-[#A09F9F] text-base font-Poppins">Time:</h4>
              <p>{val.start_date || 'N/A'}</p>
              <h4 className="text-[#A09F9F] text-base font-Poppins">Duration:</h4>
              <p>{val.duration}</p>
              <h4 className="text-[#A09F9F] text-base font-Poppins">Total number of bidders:</h4>
              <p>{val.toatl_number_of_bidders || 'N/A'}</p>
              <h4 className="text-[#A09F9F] text-base font-Poppins">No of ticket sold:</h4>
              <p>{val.tickets_sold || 'N/A'}</p>
              <h4 className="text-[#A09F9F] text-base font-Poppins">Ticket Amount:</h4>
              <p>{val.ticket_price || 'N//A'}</p>
             <h4 className="text-[#A09F9F] text-base font-Poppins">Total Amount:</h4>
              <p className="text-rose-500 font-bold">{val.total_amount || 'N/A'}</p>

               <div className="pt-4 ">
                <Link
                  href={`/dashboard/product-details-auction/edit/${val.id}`}
                  className="bg-[#FCDFD4] flex gap-2 rounded-lg  p-2 font-Poppins text-sm items-center "
                >
                  <MdOutlineEdit className="text-lg" />
                  Edit product
                </Link>
              </div>
            </div>
          </div>
        </Fragment>
      ))}


    </section>

       <Pagination
            pageCount={pageCount}
            onPageChange={({ selected }) => handlePageChange(selected)}
            className='my-6 flex items-center justify-center gap-4 '
          />
    </div>


  );
};
