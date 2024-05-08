"use client"
import React, {useState, useEffect, useCallback} from "react";
import { ListFilter } from "./ListFilter";
import { ProductListCard } from "./Card";
import {ProductLists} from "@/app/data"
import {Pagination} from "@/app/components/Pagination";




export const ProductList = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);



  // filter by name
  const [filteredData, setFilteredData] = useState<any>([]);

  useEffect(() => {
    
      const filteredProducts = ProductLists.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      );
      setFilteredData(filteredProducts);
  }, [currentPage, filteredData, itemsPerPage]);

  const handleSearch = useCallback((searchVal:any ,dateVal:any ) => {
    let filteredProducts = ProductLists;

    if (searchVal) {
      filteredProducts = filteredProducts.filter((product: any) => {
        return product.name.toLowerCase().includes(searchVal.toLowerCase());
      });
    }
    
    setFilteredData(filteredProducts);
  }, []);



  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);


  return (
    <section className="flex flex-col">
      <ListFilter onSearch={handleSearch} />
      <div className="my-4">
        <ProductListCard object={filteredData} />
      </div>
      <Pagination
        pageCount={pageCount}
        onPageChange={(pageNumber: number) => handlePageChange(pageNumber)}
        className="my-4 flex justify-center items-center gap-4 "
      />
    </section>
  );
};
