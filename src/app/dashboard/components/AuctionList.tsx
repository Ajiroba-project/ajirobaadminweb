"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ListFilter } from "./ListFilter";
import { AuctionListCard } from "./Card";
import { AuctionLists } from "@/app/data";

export const AuctionList = () => {
    const [filteredData, setFilteredData] = useState<any>([]);

    useEffect(() => {
      setFilteredData(AuctionLists);
    }, []);

    const handleSearch = useCallback((searchVal: any, dateVal: any) => {
      let filteredProducts = AuctionLists;

      if (searchVal) {
        filteredProducts = filteredProducts.filter((product: any) => {
          return product.name.toLowerCase().includes(searchVal.toLowerCase());
        });
      }

      // Filter by date
      if (dateVal) {
        filteredProducts = filteredProducts.filter((product: any) => {
          // Assuming product.date is the date field in your data
          // Modify this comparison based on your actual date field
          return product.date === dateVal;
        });
      }
      setFilteredData(filteredProducts);
    }, []);

  return (
    <section className="flex flex-col">
      <ListFilter onSearch={handleSearch} />

      <div className="my-4">
        <AuctionListCard object={filteredData} />
      </div>
    </section>
  );
};
