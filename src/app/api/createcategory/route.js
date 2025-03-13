import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
    // console.log(request, 'requestttt')
    try {
        const body = await request.json();

        const cacheBuster = `cache=${Date.now()}`;

        const cookieStore = cookies()
        const token = cookieStore.get('token')


        /*  console.log(body.payload, 'bodyyyyyy') */

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/create_category/?${cacheBuster}`, {
            method: "POST",
            maxBodyLength: Infinity,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `token ${token.value}`
            },
            body: JSON.stringify(body.payload),
        });

        // Parse response body as JSON
        const data = await res.json();
        const status = res.status;

        // console.log(data, 'dataaaaaa', status, 'statusssss')

        // Return JSON response with data and status
        return NextResponse.json({ data, status });
    } catch (error) {
        // Handle any errors gracefully
        console.error('Error processing request:', error.message);
        return NextResponse.error(new Error('Internal Server Error'));
    }
}
