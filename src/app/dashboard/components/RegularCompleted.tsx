"use client"
import React, { useState, useEffect, useCallback } from "react";
import { ListFilter } from "./ListFilter";
import { ProductListCard } from "./Card";
import Cookies from "js-cookie";
import { useGetDatanew } from "@/hooks/useGetData";
import Loading from "@/app/components/Loading";

export const RegularCompleted = () => {
    // filter by name
    const [filteredData, setFilteredData] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const [userToken, setUserToken] = useState(Cookies.get("token"));

    // Construct URL with dynamic filters
    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/admin_products/`;
    if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const { data: productInfo, isLoading: productLoading } = useGetDatanew(
        url,
        "get_product_details",
        userToken || " "
    );

    useEffect(() => {
        setFilteredData(productInfo?.data || []);
    }, [productInfo]);

    // Filter function (Search + Date)
    const handleSearch = useCallback((searchVal: string, start: string | null, end: string | null) => {
        setSearchTerm(searchVal);
        setStartDate(start);
        setEndDate(end);

        // If we have date filters, the API will handle the filtering
        // We only need to filter by search term on the client side
        let filteredProducts: any[] = Array.isArray(productInfo?.data) ? productInfo.data : [];

        if (searchVal) {
            filteredProducts = filteredProducts.filter((product: any) =>
                product.name.toLowerCase().includes(searchVal.toLowerCase())
            );
        }

        setFilteredData(filteredProducts);
    }, [productInfo]);

    if (productLoading) {
        return <Loading />
    }

    return (
        <section className="flex flex-col">
            <ListFilter onSearch={handleSearch} />
            <div className="">
                <ProductListCard object={filteredData} />
            </div>
        </section>
    );
};
