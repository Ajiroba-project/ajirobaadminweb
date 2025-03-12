import { NextResponse } from "next/server";
import Cookies from 'js-cookie';
import { cookies } from "next/headers";


export async function POST(request) {

    try {
        const body = await request.json();
        const cacheBuster = `cache=${Date.now()}`;

        const cookieStore = cookies()
        const token = cookieStore.get('token')

        const payload = body

        const { id, ...payloadWithoutId } = body;



        /*  console.log(payloadWithoutId, 'payload',)
         console.log(id, 'id',) */

        const res = await fetch(`${process.env.BASE_URL}/admin/update_product/${id}/?${cacheBuster}`, {
            method: 'PUT',
            maxBodyLength: Infinity,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `token ${token.value}`
            },
            body: JSON.stringify(payloadWithoutId),
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
