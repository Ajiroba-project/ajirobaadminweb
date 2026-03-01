"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function RQProviders({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    const [client] = React.useState(
        new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000, // 1 min – fewer refetches on slow networks
                    refetchOnWindowFocus: false,
                    retry: 2,
                    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
                },
            },
        })
    );

    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
}

export default RQProviders;
