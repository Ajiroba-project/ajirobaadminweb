"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ListFilter } from "./ListFilter";
import { AuctionListCardCompleted } from "./Card";

import Cookies from "js-cookie";
import { useGetDatanew } from "@/hooks/useGetData";
import Loading from "@/app/components/Loading";
import { ListFilterAuction } from "./ListFilterAuction";

export const AuctionListCompleted = (() => {
    // filter by name
    const [filteredData, setFilteredData] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);


    const [userToken, setUserToken] = useState(Cookies.get("token"));

    // Construct URL with dynamic filters
    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/admin_auctions/`;
    if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const { data: productInfo, isLoading: productLoading } = useGetDatanew(
        url,
        "get_product_details",
        userToken || " "
    );

    useEffect(() => {
        setFilteredData(productInfo?.completed || []);
    }, [productInfo]);

    // Filter function (Search + Date)
    const handleSearch = useCallback((searchVal: string, start: string | null, end: string | null) => {
        setSearchTerm(searchVal);
        setStartDate(start);
        setEndDate(end);

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
        <section className="flex flex-col space-y-4 lg:space-y-6">
            <ListFilterAuction data={filteredData} onSearch={handleSearch} />

            <div className="w-full">
                <AuctionListCardCompleted object={filteredData} />
            </div>
        </section>
    );
});
