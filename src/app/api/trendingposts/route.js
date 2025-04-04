import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        // Extract the token from the query parameters or headers

        const token_ = request.headers.get('authorization')?.replace('Token ', '');


        if (!token_) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        const cacheBuster = `cache=${Date.now()}`;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/all_posts/?${cacheBuster}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Token ${token_}`
            }
        });

        // Check if the response is OK
        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message || 'An error occurred' }, { status: res.status });
        }

        // Parse response body as JSON
        const data = await res.json();
        const status = res.status;

        // console.log(data, 'data')

        // Return JSON response with data and status
        return NextResponse.json({ data, status });
    } catch (error) {
        // Handle any errors gracefully
        console.error('Error processing request:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
