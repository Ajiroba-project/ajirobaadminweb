"use client";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/nav-store";

import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import { useEffect, useState } from "react";
import { section } from "framer-motion/client";
import PageLayout from "@/app/components/Layout/PageLayout";

import Image from "next/image";

import Brand from "../../asset/logo.svg";
import Link from "next/link";
import {  WinnersTable } from "../components/WinnersTable";
import {RedeemedTable} from "../components/RedeemedTable"
import ModalComponent from "@/app/components/ModalComponent";

const AjirobaLogo = ({
  className = "h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8",
  textClassName = "text-base sm:text-lg md:text-xl",
}) => (
  <div className="flex items-center bg-white  py-1 px-2 md:px-3 rounded-md shadow-md">
    <Link href={"/"} className={``}>
      <Image src={Brand} alt="brand-logo" />
    </Link>
  </div>
);

interface Column {
  key: string;
  label: string;
  render?: (row: any, index: number) => React.ReactNode;
  cellClassName?: string;
  headerClassName?: string;
}

interface Winner {
  id?: string;
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  ticket: string;
  productId: string;
  product: string;
  status?: string;
}

interface WinnersTableProps {
  filteredWinners: Winner[];
  handleConfirm: (index: number) => void;
}

const mockWinners = [
  {
    firstName: "Tania",
    surname: "Joe",
    email: "Taniajoe@gmail.com",
    phone: "08190784320",
    address: "1, Adeniyi Jones, Ikeja Lagos State",
    ticket: "43529565",
    productId: "5648T53",
    product: "T-shirt",
    status: "Pending",
  },
  {
    firstName: "Femi",
    surname: "Tosin",
    email: "Taniajoe@gmail.com",
    phone: "08190784320",
    address: "1, Adeniyi Jones, Ikeja Lagos State",
    ticket: "43529565",
    productId: "5648T53",
    product: "T-shirt",
    status: "Confirmed",
  },
  {
    firstName: "Tania",
    surname: "Joe",
    email: "Taniajoe@gmail.com",
    phone: "08190784320",
    address: "1, Adeniyi Jones, Ikeja Lagos State",
    ticket: "43529565",
    productId: "5648T53",
    product: "T-shirt",
    status: "Pending",
  },
  {
    firstName: "Tania",
    surname: "Joe",
    email: "Taniajoe@gmail.com",
    phone: "08190784320",
    address: "1, Adeniyi Jones, Ikeja Lagos State",
    ticket: "43529565",
    productId: "5648T53",
    product: "T-shirt",
    status: "Pending",
  },
];

const mockWinnersA = [
  {
    firstName: "Tania",
    surname: "Joe",
    email: "Taniajoe@gmail.com",
    phone: "08190784320",
    address: "1, Adeniyi Jones, Ikeja Lagos State",
    ticket: "43529565",
    productId: "5648T53",
    product: "T-shirt",
    status: "Delivered",
  },
  {
    firstName: "Femi",
    surname: "Tosin",
    email: "Taniajoe@gmail.com",
    phone: "08190784320",
    address: "1, Adeniyi Jones, Ikeja Lagos State",
    ticket: "43529565",
    productId: "5648T53",
    product: "T-shirt",
    status: "Delivered",
  },
  {
    firstName: "Tania",
    surname: "Joe",
    email: "Taniajoe@gmail.com",
    phone: "08190784320",
    address: "1, Adeniyi Jones, Ikeja Lagos State",
    ticket: "43529565",
    productId: "5648T53",
    product: "T-shirt",
    status: "Delivered",
  },
  {
    firstName: "Tania",
    surname: "Joe",
    email: "Taniajoe@gmail.com",
    phone: "08190784320",
    address: "1, Adeniyi Jones, Ikeja Lagos State",
    ticket: "43529565",
    productId: "5648T53",
    product: "T-shirt",
    status: "Delivered",
  },
];

const Page = () => {
  const router = useRouter();
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);

  useAuthMiddleware(router);

  const setNavbarOpen = useStore((state) => state.setNavbarOpen);

  const [active, setActive] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Winner | null>(null);

  const [searchrd, setSearchrd] = useState("");
  const [sortrd, setSortrd] = useState("");
  const [modalOpenrd, setModalOpenrd] = useState(false);
  const [selectedRowrd, setSelectedRowrd] = useState<Winner | null>(null);

  const columnsB: Column[] = [
    {
      key: "index",
      label: "S/N",
      render: (row: Winner, idx: number) => idx + 1,
    },
    { key: "firstName", label: "FIRST NAME" },
    { key: "surname", label: "SURNAME NAME" },
    { key: "email", label: "EMAIL ADDRESS" },
    { key: "phone", label: "PHONE NUMBER" },
    { key: "address", label: "DELIVERY ADDRESS" },
    { key: "ticket", label: "TICKET NUMBER" },
    {
      key: "productId",
      label: "PRODUCT ID",
      cellClassName: "text-[#F25E26] underline cursor-pointer",
      render: (row: Winner) => (
        <Link
          href={`/dashboard/productdetails-product/${row.productId}`}
          className="bg-[#FFFFFF] text-[#F25E26] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg p-2 font-Poppins text-sm items-center"
        >
          {row.productId}
        </Link>
      ),
    },
    { key: "product", label: "PRODUCT" },
    {
      key: "status",
      label: "REDEMPTION STATUS",
      cellClassName: "min-w-[120px]",
      render: (row: Winner, idx: number) => (
        <div className="flex items-center gap-2">
          <span
            className={
              row.status === "Pending"
                ? "bg-[#FFF7D6] text-[#B89B0F]"
                : row.status === "Confirmed"
                ? "bg-[#D4FCD4] text-[#0FB84B]"
                : "bg-gray-200 text-gray-600" +
                  " px-3 py-1 rounded text-xs font-medium whitespace-nowrap"
            }
          >
            {row.status}
          </span>
          {row.status === "Pending" && (
            <button
              className="text-[#F25E26] text-xs font-medium hover:underline focus:outline-none whitespace-nowrap"
              onClick={() => {
                setSelectedRow(row);
                setModalOpen(true);
              }}
            >
              Confirm
            </button>
          )}
        </div>
      ),
    },
  ];

  const columnsA: Column[] = [
    {
      key: "index",
      label: "S/N",
      render: (row: Winner, idx: number) => idx + 1,
    },
    { key: "firstName", label: "FIRST NAME" },
    { key: "surname", label: "SURNAME NAME" },
    { key: "email", label: "EMAIL ADDRESS" },
    { key: "phone", label: "PHONE NUMBER" },
    { key: "address", label: "DELIVERY ADDRESS" },
    { key: "ticket", label: "TICKET NUMBER" },
    {
      key: "productId",
      label: "PRODUCT ID",
      cellClassName: "text-[#F25E26] underline cursor-pointer",
      render: (row: Winner) => (
        <Link
          href={`/dashboard/productdetails-auction-completed/${row.productId}`}
          className="bg-[#FFFFFF] text-[#F25E26] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg p-2 font-Poppins text-sm items-center"
        >
          {row.productId}
        </Link>
      ),
    },
    { key: "product", label: "PRODUCT" },
    {
      key: "status",
      label: "REDEMPTION STATUS",
      cellClassName: "min-w-[120px]",
      render: (row: Winner, idx: number) => (
        <div className="flex items-center gap-2">
          <span
            className={
              row.status === "Pending"
                ? "bg-[#FFF7D6] text-[#B89B0F]"
                : row.status === "Delivered"
                ? "bg-[#D4FCD4] text-[#0FB84B]"
                : "bg-gray-200 text-gray-600" +
                  " px-3 py-1 rounded text-xs font-medium whitespace-nowrap"
            }
          >
            {row.status}
          </span>
          {/* {row.status === "Pending" && (
            <button
              className="text-[#F25E26] text-xs font-medium hover:underline focus:outline-none whitespace-nowrap"
              onClick={() => {
                setSelectedRow(row);
                setModalOpen(true);
              }}
            >
              Confirm
            </button>
          )} */}
        </div>
      ),
    },
  ];

  const filteredWinners = mockWinners.filter(
    (w) =>
      w.firstName.toLowerCase().includes(search.toLowerCase()) ||
      w.surname.toLowerCase().includes(search.toLowerCase()) ||
      w.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredWinnersA = mockWinnersA.filter(
    (w) =>
      w.firstName.toLowerCase().includes(search.toLowerCase()) ||
      w.surname.toLowerCase().includes(search.toLowerCase()) ||
      w.email.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setNavbarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setNavbarOpen]);

  const handleConfirm = (idx: any) => {
    setSelectedRow(idx);
    setModalOpen(true);
  };

  const handleModalOk = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  return (
    <section>
      <PageLayout>
        <div>
          <section
            className={` ${
              isNavbarOpen ? "justify-center items-center " : ""
            } flex-col flex`}
          >
            <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-32 flex justify-center items-center sticky top-0 ">
              <h1 className="text-center xl:text-2xl 2xl:text-2xl md:text-2xl text-base  leading-tight tracking-tight font-Poppins">
                Delivery Product Redemption
              </h1>
            </div>

            <div className=" my-10 px-20">
              <div className="flex">
                <>
                  <div
                    onClick={() => setActive(0)}
                    className={`${
                      active == 0 ? "bg-[#FCDFD4]" : ""
                    } border-2 border-gray-100 p-4 text-sm rounded-lg cursor-pointer w-[14em] `}
                  >
                    Winners Information
                  </div>

                  <div
                    onClick={() => setActive(1)}
                    className={`${
                      active == 1 ? "bg-[#FCDFD4]" : ""
                    } border-2 border-[#D2D2D2]] p-4 text-sm rounded-lg cursor-pointer w-[14em] `}
                  >
                    Redeemed Product
                  </div>
                </>
              </div>

              {active === 0 ? (
                <div className=" py-4 border-b text-[#353131] text-sm font-normal font-Poppins">
                  Below are the customer information of winners that have made
                  request to redeem their auction wins by delivery. Kindly
                  ensure that the product has been successfully delivered before
                  you click on &quot;send&quot; button
                </div>
              ) : (
                <div className=" py-4 border-b text-[#353131] text-sm font-normal font-Poppins">
                  Below are the customer information of winners that have
                  redeemed their auction wins and have been physically by
                  delivery.
                </div>
              )}

              {active === 0 ? (
                <div className="w-full  flex flex-row items-center justify-between mt-6 mb-2 ">
                  <div className="relative w-72">
                    <input
                      type="text"
                      placeholder="Search here..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-md border border-[#E9E9E9] bg-[#F6F6F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="#A09F9F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.5 21c5.247 0 9.5-4.253 9.5-9.5S16.747 2 11.5 2 2 6.253 2 11.5 6.253 21 11.5 21Z"
                        />
                        <path
                          stroke="#A09F9F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m22 22-2-2"
                        />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#E9E9E9] rounded-md bg-white text-[#353131] text-sm font-Poppins">
                      Sort by
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="#A09F9F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full  flex flex-row items-center justify-between mt-6 mb-2 ">
                  <div className="relative w-72">
                    <input
                      type="text"
                      placeholder="Search Redeemed here..."
                      value={searchrd}
                      onChange={(e) => setSearchrd(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-md border border-[#E9E9E9] bg-[#F6F6F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="#A09F9F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.5 21c5.247 0 9.5-4.253 9.5-9.5S16.747 2 11.5 2 2 6.253 2 11.5 6.253 21 11.5 21Z"
                        />
                        <path
                          stroke="#A09F9F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m22 22-2-2"
                        />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#E9E9E9] rounded-md bg-white text-[#353131] text-sm font-Poppins">
                      Sort by
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="#A09F9F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

            
              {active === 0 ? (
                <div className="w-full  bg-white rounded-lg shadow border mt-6 mb-12 overflow-x-auto">
                  <div className="flex flex-row items-center gap-4 px-8 pt-8 pb-2">
                    <AjirobaLogo />
                  </div>
                  <div className="bg-[#F25E26] text-white font-Poppins font-medium px-8 py-2 flex items-center text-sm rounded-t">
                    WINNERS INFORMATION{" "}
                    <span className="ml-4 text-xs font-normal">
                      (5, May, 2025 ; 4:30PM)
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <WinnersTable data={filteredWinners} columns={columnsB} />
                  </div>
                </div>
              ) : (
                <div className="w-full  bg-white rounded-lg shadow border mt-6 mb-12 overflow-x-auto">
                  <div className="flex flex-row items-center gap-4 px-8 pt-8 pb-2">
                    <AjirobaLogo />
                  </div>
                  <div className="bg-[#F25E26] text-white font-Poppins font-medium px-8 py-2 flex items-center text-sm rounded-t">
                    WINNERS INFORMATION{" "}
                    <span className="ml-4 text-xs font-normal">
                      (5, May, 2025 ; 4:30PM)
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <RedeemedTable data={filteredWinnersA} columns={columnsA} />
                  </div>
                </div>
              )}
            </div>
          </section>

          <ModalComponent
            isModalOpen={modalOpen}
            handleOk={handleModalOk}
            handleCancel={() => setModalOpen(false)}
            content={
              <div className="flex flex-col items-center justify-center p-6">
                <p className="text-center text-lg font-Poppins font-medium mb-8 mt-2">
                  Before you proceed, please confirm if the product has been
                  physically delivered
                </p>
                <div className="flex flex-col gap-4 w-full items-center">
                  <button
                    className="w-full bg-[#FDE6DF] text-[#222] font-Poppins font-medium rounded-lg py-3 mb-2 border-none focus:outline-none hover:bg-[#fcd2c2] transition"
                    onClick={() => setModalOpen(false)}
                  >
                    Yes
                  </button>
                  <button
                    className="w-full bg-white text-[#222] font-Poppins font-medium rounded-lg py-3 border border-[#F25E26] focus:outline-none hover:bg-[#f9e3db] transition"
                    onClick={() => setModalOpen(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            }
          />
        </div>
      </PageLayout>
    </section>
  );
};

export default Page;
