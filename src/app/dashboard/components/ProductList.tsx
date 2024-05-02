"use client"
import React, {useState, useEffect, useCallback} from "react";
import { ListFilter } from "./ListFilter";
import { ProductListCard } from "./Card";
import {ProductLists} from "@/app/data"


export const ProductList = () => {
  // filter by name
  const [filteredData, setFilteredData] = useState<any>([]);

  useEffect(() => {
    setFilteredData(ProductLists);
  }, []);

  const handleSearch = useCallback((searchVal: string) => {
    let filteredProducts = ProductLists;

    if (searchVal) {
      filteredProducts = filteredProducts.filter((product: any) => {
        return product.name.toLowerCase().includes(searchVal.toLowerCase());
      });
    }
    setFilteredData(filteredProducts);
  }, []);

  return (
    <section className="flex flex-col">
      <ListFilter onSearch={handleSearch} />
      <div className="my-4">
        <ProductListCard object={filteredData} />
      </div>
    </section>
  );
};
