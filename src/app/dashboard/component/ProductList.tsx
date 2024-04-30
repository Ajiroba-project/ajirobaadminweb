import React from "react";
import { SearchFilter } from "./ListFilter";

export const ProductList = () => {
  return (
    <section className="flex flex-col">
      <div className="flex justify-between">
        <SearchFilter />
        
      </div>
      <div></div>
    </section>
  );
};
