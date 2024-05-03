import React, { useState } from "react";
import { useStore } from "@/store/nav-store";
import { categories } from "@/app/data";
import { Modal } from "./Modal";
import { useRouter } from "next/navigation";
import { CreateCategory } from "./CreateCategory";
import { CategoryEdit } from "./CategoryEdit";
import successIcon from "@/app/asset/verify.svg";

export const Categories = () => {
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  const [modal, setModal] = useState<boolean>(false);
  const [categoryswitch, setCategorySwitch] = useState("list");
  const router = useRouter();

  const handleCreateCategory = () => {
    setModal(!modal);
  };

  const modalEvent = () => {
    setModal(!modal);
  };
  const handleEditCategory = () => {
    setModal(!modal);
  };

  return (
    <>
      <section
        className={` ${
          !isNavbarOpen
            ? "lg:mt-[15%] xl:mt-[15%] md:mt-[15%] lg:ml-[20%] xl:ml-[20%] mr-[3%] md:ml-[20] mt-[38%]"
            : "mt-[30%] md:mt-[25%] mx-[5%] lg:mt-[15%] justify-center xs:mt-[35%]"
        }`}
      >
        {categoryswitch === "list" ? (
          <>
            <div className="flex justify-between md:mt-3 lg:mt-1 mt-5">
              <p className="font-semimbold"> Category List</p>
              <button
                className="bg-[#FCDFD4] p-2 px-5 rounded"
                onClick={() => setCategorySwitch("create")}
              >
                Create
              </button>
            </div>

            {/* table */}

            <div className="container mx-auto w-full mt-5">
              <table className="table-auto w-full text-center">
                <thead className="bg-[#FCDFD4] py-5">
                  <tr>
                    <th className="px-4 py-5 border-r-2 border-black sm:text-sm md:text-md lg:text-md ">
                      S/N
                    </th>
                    <th className="px-4 py-5 sm:text-sm md:text-md lg:text-md">
                      CATEGORIES
                    </th>
                    <th className="px-4 py-5 sm:text-sm md:text-md lg:text-md">
                      SUBCATEGORIES
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-50 my-1">
                  {categories.map((val, index) => (
                    <tr key={index}>
                      <td className="text-center align-middle justify-center px-4 py-4">
                        {index}
                      </td>
                      <td className="text-center align-middle justify-center px-4 py-4">
                        {val}
                      </td>
                      <td className="text-center align-middle justify-center px-4 py-4 ">
                        <label htmlFor="check">
                          <input
                            type="radio"
                            name="check"
                            id=""
                            className="outline-[#F25E26]"
                          />
                          &nbsp; &nbsp; Subcategory
                        </label>
                        <div className="flex gap-2  w-full items-end  place-content-end">
                          <p
                            className="text-[#F25E26] cursor-pointer"
                            onClick={() => setCategorySwitch("edit")}
                          >
                            edit
                          </p>
                          <p
                            className="text-[#F25E26] cursor-pointer"
                            onClick={() => setModal(!modal)}
                          >
                            delete
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : categoryswitch === "create" ? (
          <>
            {" "}
            <p
              className="lg:px-14 px-7  text-[#F25E26] underline cursor-pointer "
              onClick={() => setCategorySwitch("list")}
            >
              Back
            </p>
            <CreateCategory func={handleCreateCategory} />
          </>
        ) : (
          <>
            <p
              className="lg:px-14 px-7  text-[#F25E26] underline cursor-pointer "
              onClick={() => setCategorySwitch("list")}
            >
              Back
            </p>

            <CategoryEdit func={handleEditCategory} />
          </>
        )}
      </section>

      {modal && (
        <div className="flex absolute top-0">
          <Modal
            title={
              categoryswitch === "create"
                ? "Data created Successfully"
                : categoryswitch === "edit"
                ? "Data Updated Successfully"
                : "Are you sure you want to delete Category"
            }
            subtitle=""
            buttoncount={
              categoryswitch === "create" || categoryswitch === "edit" ? 1 : 2
            }
            buttontext={
              categoryswitch === "create" || categoryswitch === "edit"
                ? "continue"
                : "yes"
            }
            button2text="No"
            buttonclass="bg-[#FCDFD4] p-5 rounded-lg text-sm hover:shadow w-full px-14"
            button2class="p-4 rounded-lg border-2 border-[#F25E26] px-14"
            buttontype="button"
            button2type="button"
            handleEvent={modalEvent}
            handleEvent2={() => setModal(false)}
            icon={
              categoryswitch === "create" || categoryswitch === "edit"
                ? successIcon
                : null
            }
          />
        </div>
      )}
    </>
  );
};
