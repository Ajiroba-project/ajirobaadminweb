import { NextResponse } from "next/server";

export async function PUT(request) {
    // console.log(request, 'requestttt')
    try {
        const body = await request.json();
        // console.log(body, 'bodyyyyy')
        const cacheBuster = `cache=${Date.now()}`;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/edit_profile/?${cacheBuster}`, {
            method: "PUT",
            maxBodyLength: Infinity,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Token ${body.token}`
            },
            body: JSON.stringify(body.payload),
        });

        // Parse response body as JSON
        const data = await res.json();
        const status = res.status;

        // Return JSON response with data and status
        return NextResponse.json({ data, status });
    } catch (error) {
        // Handle any errors gracefully
        console.error('Error processing request:', error.message);
        return NextResponse.error(new Error('Internal Server Error'));
    }
}
