import { NextResponse } from "next/server";
import Cookies from 'js-cookie';

export async function POST(request) {

    try {
        const body = await request.json();
        const cacheBuster = `cache=${Date.now()}`;

        const res = await fetch(`${process.env.BASE_URL}/admin/upload/?${cacheBuster}`, {
            method: 'POST',
            maxBodyLength: Infinity,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify(body),
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
