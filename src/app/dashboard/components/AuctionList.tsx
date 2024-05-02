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

    const handleSearch = useCallback((searchVal: string) => {
      let filteredProducts = AuctionLists;

      if (searchVal) {
        filteredProducts = filteredProducts.filter((product: any) => {
          return product.name.toLowerCase().includes(searchVal.toLowerCase());
        });
      }
      setFilteredData(filteredProducts);
    }, []);

  return (
    <section className="flex flex-col">
      <ListFilter />

      <div className="my-4">
        <AuctionListCard object={filteredData} />
      </div>
    </section>
  );
};
