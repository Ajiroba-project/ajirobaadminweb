'use client';
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link"
import { MdArrowRight, MdOutlineEdit } from "react-icons/md";
import { Pagination } from "@/app/components/Pagination";
import { div } from "framer-motion/m";
import { useRouter } from "next/navigation";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "900"] });
type cardProps = {
  title?: string;
  object?: Array<any>;
};

interface Product {
  id: string;
  name: string;
  category_name: string;
  subcategory_name: string;
  cost_price: string;
  price: string;
  discount: string;
  quantity: number;
  weight: string;
  featured: boolean;
  top_deal: boolean;
  description: string;
  slug: string;
  date_created: string;
  images: Array<{
    id: string;
    product: string;
    image: string;
  }>;
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
            <h2 className="leading-2 text-[#353131] text-lg font-Poppins font-bold">
              {val.name.includes("USER") ? (
                <>
                  {val.count} <span className="font-normal text-sm">Users</span>
                </>
              ) : (
                val.count
              )}
            </h2>
          </div>
        ))}
      </div>
    </section>
  );
};



export const ProductListCard = ({ object }: cardProps) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [paginatedData, setPaginatedData] = useState<Product[]>([]);
  const [itemsPerPage] = useState<number>(5);

  const router = useRouter();


  // Use useEffect instead of useMemo for side effects
  useEffect(() => {
    if (object && object.length > 0) {
      const startIndex = currentPage * itemsPerPage;
      const endIndex = (currentPage + 1) * itemsPerPage;
      const paginatedProducts = object.slice(startIndex, endIndex);

      setPaginatedData(paginatedProducts);
    } else {
      setPaginatedData([]);
    }
  }, [currentPage, itemsPerPage, object]);

  // Reset to first page when object changes (e.g., after filtering)
  useEffect(() => {
    setCurrentPage(0);
  }, [object]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const pageCount = Math.ceil((object?.length || 0) / itemsPerPage);

  // Show message when no products are found
  if (!object || object.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 text-lg">No products found for the selected criteria.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or date filters.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Show total count and filtering status */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {/*  Showing {object.length} product{object.length !== 1 ? 's' : ''}
          {object.length > itemsPerPage && (
            <span className="ml-2 text-gray-500">
              (Page {currentPage + 1} of {pageCount})
            </span>
          )} */}
        </div>
        {/*  {object.length > 0 && (
          <div className="text-xs text-gray-500">
            {object[0]?.date_created && (
              <span>Latest: {new Date(object[0].date_created).toLocaleDateString()}</span>
            )}
          </div>
        )} */}
      </div>

      <section className="py-4 grid lg:grid-cols-3 gap-4 w-full">
        {paginatedData?.map((val: Product, index: number) => (
          <Fragment key={val.id || index}>
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-lg">{val.name}</p>
                {val.images && val.images.length > 0 && (
                  <Image
                    onClick={() => router.push(`/dashboard/productdetails-product/${val.id}`)}
                    src={`${process.env.NEXT_PUBLIC_BASE_URL_IMG}/media/${val.images[0]?.image}`}
                    alt={val.category_name}
                    height={50}
                    width={50}
                    className="rounded-full cursor-pointer"
                  />
                )}
              </div>

              <div className="py-2 mt-5 grid-cols-2 grid gap-y-2 gap-x-3">
                <h4 className="text-[#A09F9F] text-base font-Poppins">Category:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">
                  {val.category_name.length > 100
                    ? val.category_name.slice(0, 50) + "..."
                    : val.category_name}
                </p>

                <h4 className="text-[#A09F9F] text-base font-Poppins">Sub category:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.subcategory_name}</p>

                <h4 className="text-[#A09F9F] text-base font-Poppins">Selling Price:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">
                  {val.price !== null && val.price !== undefined
                    ? `₦${Number(val.price).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`
                    : 'N/A'
                  }
                </p>

                <h4 className="text-[#A09F9F] text-base font-Poppins">Discount Price:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">
                  {val.discount !== null && val.discount !== undefined
                    ? `₦${Number(val.discount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`
                    : 'N/A'
                  }
                </p>

                <h4 className="text-[#A09F9F] text-base font-Poppins">Product Description:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">
                  {val.description.length > 100
                    ? val.description.slice(0, 50) + "..."
                    : val.description}
                </p>

                <h4 className="text-[#A09F9F] text-base font-Poppins">Date Created:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">
                  {new Date(val.date_created).toLocaleDateString()}
                </p>

                <div className="pt-4 flex justify-between col-span-2">
                  <div>
                    <Link
                      href={`/dashboard/product-details/edit/${val.id}`}
                      className="bg-[#FCDFD4] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg p-2 font-Poppins text-sm items-center"
                    >
                      <MdOutlineEdit className="text-sm" />
                      Edit product
                    </Link>
                  </div>

                  <div>
                    <Link
                      href={`/dashboard/productdetails-product/${val.id}`}
                      className="bg-[#FCDFD4] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg p-2 font-Poppins text-sm items-center"
                    >
                      See More
                      <MdArrowRight className="text-sm" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      </section>

      {/* Only show pagination if there are more items than can fit on one page */}
      {pageCount > 1 && (
        <div className="my-6 flex items-center justify-center gap-4">
          {/* Replace with your actual Pagination component */}
          {/* <Pagination
            pageCount={pageCount}
            onPageChange={({ selected }) => handlePageChange(selected)}
            className='my-6 flex items-center justify-center gap-4'
          /> */}

          {/* Simple pagination buttons for demo */}
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              {currentPage + 1} of {pageCount}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(pageCount - 1, currentPage + 1))}
              disabled={currentPage === pageCount - 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};




export const AuctionListCard = ({ object }: cardProps) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [itemsPerPage] = useState<number>(7);

  const router = useRouter()


  // console.log(object, 'objjj');

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
                <Image onClick={() => router.push(`/dashboard/productdetails-auction/${val.id}`)}
                  src={`${process.env.NEXT_PUBLIC_BASE_URL_IMG}/media/${val?.images[0]?.image}`}
                  alt={val.category_name}
                  height={50}
                  width={50}
                  className="rounded-full "
                />
              </div>

              <div className="py-2 mt-5 grid-cols-2 grid gap-y-2">
                <h4 className="text-[#A09F9F] text-base font-Poppins">Category:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.category_name}</p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">Sub category:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.subcategory_name}</p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">Date of auction:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.start_date || 'N/A'}</p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">Time:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.start_date || 'N/A'}</p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">Duration:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.duration}</p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">Total number of bidders:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.total_bidders !== null && val.total_bidders !== undefined ? val.total_bidders : 'N/A'}</p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">No of ticket sold:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.total_tickets !== null && val.total_tickets !== undefined ? val.total_tickets : 'N/A'}</p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">Ticket Amount:</h4>
                <p className="text-rose-500 text-sm font-Poppins font-bold">
                  {val.ticket_price !== null && val.ticket_price !== undefined
                    ? `₦${Number(val.ticket_price).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`
                    : 'N/A'
                  }
                </p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">Total Amount:</h4>
                <p className="text-rose-500 text-sm font-Poppins font-bold">
                  {val.total_amount !== null && val.total_amount !== undefined
                    ? `₦${Number(val.total_amount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`
                    : 'N/A'
                  }
                </p>

                <div className="pt-4 flex justify-between col-span-2">
                  <div>
                    <Link
                      href={`/dashboard/product-details-auction/edit/${val.id}`}
                      className=" bg-[#FCDFD4] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg  p-2 font-Poppins text-sm items-center "
                    >
                      <MdOutlineEdit className="text-sm" />
                      Edit product
                    </Link>
                  </div>


                  <div>
                    <Link
                      href={`/dashboard/productdetails-auction/${val.id}`}
                      className="bg-[#FCDFD4] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg  p-2 font-Poppins text-sm items-center "
                    >

                      See More
                      <MdArrowRight className="text-sm" />
                    </Link>
                  </div>
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



export const AuctionListCardCompleted = ({ object }: cardProps) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [itemsPerPage] = useState<number>(7);

  const router = useRouter()


  // console.log(object, 'objjj');

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
                <Image onClick={() => router.push(`/dashboard/productdetails-auction-completed/${val.id}`)}
                  src={`${process.env.NEXT_PUBLIC_BASE_URL_IMG}/media/${val?.images[0]?.image}`}
                  alt={val.category_name}
                  height={50}
                  width={50}
                  className="rounded-full "
                />
              </div>

              <div className="py-2 mt-5 grid-cols-2 grid gap-y-2">
                <h4 className="text-[#A09F9F] text-base font-Poppins">Category:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.category_name}</p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">Sub category:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.subcategory_name}</p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">Date of auction:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.start_date || 'N/A'}</p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">Time:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.start_date || 'N/A'}</p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">Duration:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.duration}</p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">Total number of bidders:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.total_bidders !== null && val.total_bidders !== undefined ? val.total_bidders : 'N/A'}</p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">No of ticket sold:</h4>
                <p className="text-sm font-Poppins text-[#2A2A2A]">{val.total_tickets !== null && val.total_tickets !== undefined ? val.total_tickets : 'N/A'}</p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">Ticket Amount:</h4>
                <p className="text-rose-500 text-sm font-Poppins font-bold">
                  {val.ticket_price !== null && val.ticket_price !== undefined
                    ? `₦${Number(val.ticket_price).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`
                    : 'N/A'
                  }
                </p>
                <h4 className="text-[#A09F9F] text-base font-Poppins">Total Amount:</h4>
                <p className="text-rose-500 text-sm font-Poppins font-bold">
                  {val.total_amount !== null && val.total_amount !== undefined
                    ? `₦${Number(val.total_amount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`
                    : 'N/A'
                  }
                </p>

                {/*    <div className="pt-4 flex justify-between col-span-2">
                  <div>
                    <Link
                      href={`/dashboard/product-details-auction/edit/${val.id}`}
                      className=" bg-[#FCDFD4] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg  p-2 font-Poppins text-sm items-center "
                    >
                      <MdOutlineEdit className="text-sm" />
                      Edit product
                    </Link>
                  </div>


                  <div>
                    <Link
                      href={`/dashboard/productdetails-auction-completed/${val.id}`}
                      className="bg-[#FCDFD4] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg  p-2 font-Poppins text-sm items-center "
                    >

                      See More
                      <MdArrowRight className="text-sm" />
                    </Link>
                  </div>
                </div> */}
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
