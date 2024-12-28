
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Fragment } from "react";
import Link from "next/link"
import { MdOutlineEdit } from "react-icons/md";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "900"] });
type cardProps = {
  title?: string;
  object?: Array<any>;
};

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

  return (
    <section className="py-4 grid lg:grid-cols-3 gap-4 w-full">
      {object?.map((val, index) => (
        <Fragment key={index}>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg">{val.name}</p>
              <Image
                src={""}
                alt="new"
                height={30}
                width={30}
                className="rounded-full "
              />
            </div>

            <div className="py-2 mt-5 grid-cols-2 grid gap-y-2">
              <h4 className="text-[#A09F9F]">Category:</h4>
              <p>{val.category}</p>
              <h4 className="text-[#A09F9F]">Sub category:</h4>
              <p>{val.subcategory}</p>
              <h4 className="text-[#A09F9F]">Selling Price:</h4>
              <p>{val.price}</p>
              <h4 className="text-[#A09F9F]">Discount Price:</h4>
              <p>{val.discount}</p>
              <h4 className="text-[#A09F9F]">Product Description:</h4>
              <p>{val.description}</p>

              <div className="pt-4 ">
                <Link
                  href={`dashboard/product-details/edit/${val.name}`}
                  className="bg-[#FCDFD4] flex gap-2 rounded-lg  p-2 items-center "
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
  );
};

export const AuctionListCard = ({ object }: cardProps) => {
  return (
    <section className="py-4 grid lg:grid-cols-3 gap-4 w-full">
      {object?.map((val, index) => (
        <Fragment key={index}>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg">{val.name}</p>
              <Image
                src={""}
                alt="new"
                height={30}
                width={30}
                className="rounded-full"
              />
            </div>

            <div className="py-2 mt-5 grid-cols-2 grid gap-y-2">
              <h4 className="text-[#A09F9F]">Category:</h4>
              <p>{val.category}</p>
              <h4 className="text-[#A09F9F]">Sub category:</h4>
              <p>{val.subcategory}</p>
              <h4 className="text-[#A09F9F]">Date of auction:</h4>
              <p>{val.price}</p>
              <h4 className="text-[#A09F9F]">Time:</h4>
              <p>{val.discount}</p>
              <h4 className="text-[#A09F9F]">Duration:</h4>
              <p>{val.duration}</p>
              <h4 className="text-[#A09F9F]">Total number of bidders:</h4>
              <p>{val.TNB}</p>
              <h4 className="text-[#A09F9F]">No of ticket sold:</h4>
              <p>{val.NTS}</p>
              <h4 className="text-[#A09F9F]">Ticket Amount:</h4>
              <p>{val.ticket_amount}</p>
              <h4 className="text-[#A09F9F] ">Total Amount:</h4>
              <p className="text-rose-500 font-bold">{val.total_amount}</p>

              <div className="pt-4 ">
                <Link
                  href={`dashboard/product-details/auction-edit/${val.name}`}
                  className="bg-[#FCDFD4] flex gap-2 rounded-lg  p-2 items-center  md:text-sm sm:text-sm"
                >
                  <MdOutlineEdit className="text-lg md:text-md" />
                  Edit product
                </Link>
              </div>
            </div>
          </div>
        </Fragment>
      ))}
    </section>
  );
};
