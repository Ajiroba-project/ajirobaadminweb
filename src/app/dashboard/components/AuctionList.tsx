"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ListFilter } from "./ListFilter";
import { AuctionListCard } from "./Card";
import { AuctionLists } from "@/app/data";

export const AuctionList = (() => {
  const [filteredData, setFilteredData] = useState<any>([]);

  useEffect(() => {
    setFilteredData(AuctionLists);
  }, []);

  const handleSearch = useCallback((searchVal: string, dateVal: string) => {
    let filteredProducts = AuctionLists;

    // if (searchVal.length <= 2 && dateVal.length <= 2) {
    //   setFilteredData(AuctionLists);
    //   return;
    // }

    if (searchVal) {
      filteredProducts = filteredProducts.filter((product: any) => {
        return product.name.toLowerCase().includes(searchVal.toLowerCase());
      });
    }

    // Filter by date
    // if (dateVal) {
    //   filteredProducts = filteredProducts.filter((product: any) => {
    //     return product.date === dateVal;
    //   });
    // }
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
});
