"use client"
import React, { useState, useEffect, useCallback } from "react";
import { ListFilter } from "./ListFilter";
import { ProductListCard } from "./Card";
import Cookies from "js-cookie";
import { useGetDatanew } from "@/hooks/useGetData";
import Loading from "@/app/components/Loading";

export const ProductList = () => {
  // filter by name
  const [filteredData, setFilteredData] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<any>([]);

  const [userToken, setUserToken] = useState(Cookies.get("token"));

  // Construct URL - remove date filtering from URL since we're doing client-side filtering
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/admin_products/`;

  const { data: productInfo, isLoading: productLoading, error } = useGetDatanew(
    url,
    "get_product_details",
    userToken || " "
  );

  useEffect(() => {
    // Store all products for client-side filtering
    if (productInfo?.data) {
      setAllProducts(productInfo.data);

      // Show available dates in the data for debugging
      const availableDates = productInfo.data.map((product: any) => {
        const date = new Date(product.date_created);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      });
      const uniqueDates = Array.from(new Set(availableDates)).sort();
    }

    setFilteredData(productInfo?.data || []);
  }, [productInfo, error]);

  // Fixed client-side date filtering function
  const filterByDate = useCallback((products: any[], start: string, end: string) => {

    const filtered = products.filter((product: any) => {
      if (!product.date_created) {
        return false;
      }

      // Parse the product date - it comes with timezone info like "2025-07-04T11:34:50.443034+01:00"
      const productDate = new Date(product.date_created);

      // Extract date in local timezone to match the filter date
      const year = productDate.getFullYear();
      const month = String(productDate.getMonth() + 1).padStart(2, '0');
      const day = String(productDate.getDate()).padStart(2, '0');
      const productDateString = `${year}-${month}-${day}`;

      // For single date filtering (start === end), check if dates match
      const isInRange = productDateString === start;


      return isInRange;
    });

    return filtered;
  }, []);

  // Filter function (Search + Date)
  const handleSearch = useCallback((searchVal: string, start: string | null, end: string | null) => {

    setSearchTerm(searchVal);
    setStartDate(start);
    setEndDate(end);

    let filteredProducts: any[] = allProducts;

    // Apply date filtering if dates are provided
    if (start && end) {
      filteredProducts = filterByDate(filteredProducts, start, end);
    }

    // Apply search filtering
    if (searchVal) {
      filteredProducts = filteredProducts.filter((product: any) =>
        product.name.toLowerCase().includes(searchVal.toLowerCase())
      );
    }

    setFilteredData(filteredProducts);
  }, [allProducts, filterByDate]);

  // Add effect to refetch data when date filters change
  useEffect(() => {
    if (startDate && endDate && allProducts.length > 0) {
      let filteredProducts = filterByDate(allProducts, startDate, endDate);

      if (searchTerm) {
        filteredProducts = filteredProducts.filter((product: any) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredData(filteredProducts);
    }
  }, [allProducts, startDate, endDate, searchTerm, filterByDate]);

  if (productLoading) {
    return <Loading />
  }

  return (
    <section className="flex flex-col space-y-4 lg:space-y-6">
      <ListFilter onSearch={handleSearch} />
      <div className="w-full">
        <ProductListCard object={filteredData} />
      </div>
    </section>
  );
};