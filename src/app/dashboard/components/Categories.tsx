import React, { useState } from "react";
import { useStore } from "@/store/nav-store";
import { categories } from "@/app/data";
import { Modal } from "./Modal";
import { useRouter } from "next/navigation";
import { CreateCategory } from "./CreateCategory";
import {CraeteCategory} from "./CraeteCategory";
import { CategoryEdit } from "./CategoryEdit";
import ModalComponent from "@/app/components/ModalComponent";
import { DefaultButton } from "@/app/component/Button";
import { UpdateSubCategory } from "./UpdateSubCategory";
import {useCategoryButtonClickStore} from "@/store/nav-store"
import { CraeteSubCategory } from "./CreateSubCategory";

export const Categories = () => {
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  const categoryopen = useCategoryButtonClickStore((state) => state.categoryopen);
  // const subcategoryopen = useSubCategoryButtonClickStore((state) => state.subcategoryopen);
  const [modal, setModal] = useState<boolean>(false);
  const [editmodal, setEditModal] = useState<boolean>(false);
  const [updateCategory, setUpdateCategory] = useState<boolean>(false);
  const [categoryswitch, setCategorySwitch] = useState("list");
  const router = useRouter();



  const handleCreateCategory = () => {
    setModal(!modal);
  };

  const modalEvent = () => {
    setModal(!modal);
  };

  const modalEdit = () => {
    setEditModal(!editmodal);
  };

  const handleEditCategory = () => {
    setModal(!modal);
  };

   const handleUpdateSubCategory = () => {
     setUpdateCategory(!updateCategory);
   };


    const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number): void => setCurrentPage(pageNumber);

const setCreateCategory = useCategoryButtonClickStore((state) => state.setCategoryopen);
// const setCreatesubcategory = useSubCategoryButtonClickStore((state) => state.setCreatesubcategory);

// const {  subcategoryopen,setCreatesubcategory}  = useSubCategoryButtonClickStore((state) => state);

//  const toggleSubcategory = useSubCategoryButtonClickStore((state) => state.subcategoryopen);
   const issubcategoryopen = useStore(state=> state.subcategoryopen)
     const toggleSubcategory = useStore((state) => state.toggleSubcategory);
       const subcategoryOpen = useStore((state) => state.subcategoryOpen);

     const togglecategory = useStore((state) => state.togglecategory);
       const categoryOpen = useStore((state) => state.categoryOpen);
  return (


    <>
      <section
        className={`my-10 px-20 ${
          isNavbarOpen ? "justify-center items-center " : ""
        } flex-col flex`}
      >
        {categoryswitch === "list" ? (
          <>
            <div className="flex justify-between md:mt-3 lg:mt-1 mt-5">
              <p className="font-semimbold"> Category List</p>
            <div className="flex gap-2" >
              <div>
                  <button
                className="bg-[#FCDFD4] p-2 px-5 rounded"
          /*     onClick={() => setCreateCategory(!categoryopen)} */
            onClick={togglecategory}
              >
                Create Category
              </button>
              </div>

              <div>
                  <button
                className="bg-[#ffffff] text-[#2A2A2A] font-Poppins border border-[#E84526] p-2 px-5 rounded"

              // onClick={() => setCreatesubcategory(!subcategoryopen)}
            /*     onClick={() => setCreatesubcategory(!subcategoryopen)} */
                   onClick={toggleSubcategory}

              >
                Create Subcategories
              </button>
              </div>
            </div>
            </div>

            <div className="container mx-auto w-full mt-5">
              <table className="table-auto w-full text-center">
                <thead className="bg-[#FCDFD4] py-5">
                  <tr>
                    <th className="px-4 py-5 border-r-1 border-[#6E6E6E] sm:text-sm md:text-md lg:text-md ">
                      S/N
                    </th>
                    <th className="px-4 py-5 sm:text-sm md:text-md border-r-1 border-[#6E6E6E]  lg:text-md">
                      CATEGORIES
                    </th>
                    <th className="px-4 py-5 sm:text-sm md:text-md lg:text-md">
                      SUBCATEGORIES
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-gray-50 my-1">
                  {currentItems.map((val, index) => (
                    <tr key={index + indexOfFirstItem} className="border border-b-[#bebdbd] bg-[#F6F6F6]">
                      <td className="text-center align-middle justify-center px-4 py-4">
                        {index + indexOfFirstItem + 1}
                      </td>
                      <td className="text-center align-middle justify-center px-4 py-4">
                        {val}
                      </td>
                      <td className="text-center align-middle justify-center px-4 py-4">
                        <div className="flex flex-col gap-2">
                          {['Fruit', 'Vegetable', 'Foods', 'Drinks'].map((label, i) => (
                            <div key={i} className="flex items-center">
                              <input
                                type="checkbox"
                                name={`check${index}-${i}`}
                                id={`check${index}-${i}`}
                                className="outline-[#F25E26] mr-2"
                              />
                              <label htmlFor={`check${index}-${i}`}>{label}</label>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 w-full items-end place-content-end mt-2">
                          <p
                            className="text-[#F25E26] cursor-pointer"
                             onClick={() => setEditModal(!editmodal)}
                          >
                            Edit
                          </p>
                          <p
                            className="text-[#F25E26] cursor-pointer"
                            onClick={() => setModal(!modal)}
                          >
                            Delete
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-center mt-4">
                {Array.from(
                  { length: Math.ceil(categories.length / itemsPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      className={`mx-2 px-3 py-1 border ${
                        currentPage === i + 1 ? "bg-[#F25E26] text-white" : ""
                      }`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          </>
        ) : categoryswitch === "create" ? (
          <>
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


         <ModalComponent
        content={
          <div className="flex flex-col justify-center">
            <div className="flex justify-center items-center flex-col">

            </div>

               <CraeteCategory func={handleEditCategory} />


          </div>
        }
           isModalOpen={categoryOpen}
         showModal={togglecategory}
      handleOk={() => {}}
      handleCancel={togglecategory}
      />





         <ModalComponent
        content={
          <div className="flex flex-col justify-center">
            <div className="flex justify-center items-center flex-col">

            </div>

               <CraeteSubCategory func={handleEditCategory} />


          </div>
        }
           isModalOpen={subcategoryOpen}
      showModal={toggleSubcategory}
      handleOk={() => {}}
      handleCancel={toggleSubcategory}
      />


         <ModalComponent
        content={
          <div className="flex flex-col justify-center">
            <div className="flex justify-center items-center flex-col">

            </div>

            <UpdateSubCategory func={handleUpdateSubCategory} />


          </div>
        }
        isModalOpen={updateCategory}
        showModal={handleUpdateSubCategory}
        handleOk={() => {}}
        handleCancel={() => setUpdateCategory(false)}
      />

          <ModalComponent
        content={
          <div className="flex flex-col justify-center">
            <div className="flex justify-center items-center flex-col">
              <p className="text-[#2A2A2A] font-bold text-xl font-Poppins">
               Are you sure you want to delete this category?
              </p>


            </div>

              <div className="flex flex-col items-center gap-8 py-4 mt-10">


                <DefaultButton
                 text={`${'Yes'}`}
              className="rounded-md bg-[#FCDFD4] p-2 px-4 text-[#2A2A2A] w-1/2"
                type={ "button"}
                    handleClick={()=> setModal(false)}
            />

            <DefaultButton
              text="No"
              className="rounded-md border-2 border-[#F25E26] bg-white p-2 text-[#2A2A2A] w-1/2"
              type="button"
             handleClick={()=> setModal(false)}
            />
            </div>


          </div>
        }
        isModalOpen={modal}
        showModal={modalEvent}
        handleOk={() => {}}
        handleCancel={() => setModal(false)}
      />

        <ModalComponent
        content={
          <div className="flex flex-col justify-center">
            <div className="flex justify-center items-center flex-col">

            </div>

               <CategoryEdit func={handleEditCategory} />


          </div>
        }
        isModalOpen={editmodal}
        showModal={modalEdit}
        handleOk={() => {}}
        handleCancel={() => setEditModal(false)}
      />
    </>
  );
};
