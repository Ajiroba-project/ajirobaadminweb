import React from 'react'
import { useStore } from "@/store/nav-store";

export const Categories = () => {
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);

  const handleClick =()=>{
    console.log("click")
  }
  
  return (
    <section
      className={` ${
        !isNavbarOpen
          ? "lg:mt-[15%] xl:mt-[15%] md:mt-[15%] lg:ml-[20%] xl:ml-[20%] mr-[3%] md:ml-[20] mt-[38%]"
          : "mt-[30%] md:mt-[25%] mx-[5%] lg:mt-[10%] justify-center"
      }`}
    >
      

      <div className="flex justify-between">
        <p> Category List</p>
        <button className="bg-[#FCDFD4] p-2 px-5 rounded" onClick={handleClick}>Create</button>
      </div>


    </section>
  );
}
