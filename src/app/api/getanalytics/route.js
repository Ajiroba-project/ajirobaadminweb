
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        // Extract the token from the Authorization header
        const token_ = request.headers.get('authorization')?.replace('Token ', '');
        if (!token_) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            );
        }
        // Append a cache buster to avoid stale responses
        const cacheBuster = `cache=${Date.now()}`;
        /*   https://jedida.onrender.com/md/staffs */
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/analytics/?${cacheBuster}`;

        const res = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token_}`,
            },
        });

        // Check if the response is OK
        if (!res.ok) {
            const errorData = await res.json();
            const errorMessage = errorData?.message || 'An error occurred with the external API';
            return NextResponse.json(
                { error: errorMessage },
                { status: res.status }
            );
        }

        // Parse response body as JSON
        const data = await res.json();

        // Return the successful response
        return NextResponse.json({ data, status: res.status });

    } catch (error) {
        // Handle unexpected errors
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Error processing request:', errorMessage);

        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
