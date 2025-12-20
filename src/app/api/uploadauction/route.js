import { NextResponse } from "next/server";
// import Cookies from 'js-cookie';
import { cookies } from "next/headers";


export async function POST(request) {

    try {
        const body = await request.json();
        const cacheBuster = `cache=${Date.now()}`;

        const cookieStore = cookies()
        const token = cookieStore.get('token')

        /*   console.log(token.value, 'token')

          console.log(body, 'body')
   */

        // console.log(body, 'body')
        const res = await fetch(`${process.env.BASE_URL}/admin/upload_auction/?${cacheBuster}`, {
            method: 'POST',
            maxBodyLength: Infinity,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `token ${token.value}`
            },
            body: JSON.stringify(body),
        });

        // Parse response body as JSON
        const data = await res.json();
        const status = res.status;

        // console.log(data, 'data')
        // console.log(status, 'status')


        // Return JSON response with data and status
        return NextResponse.json({ data, status });
    } catch (error) {
        // Handle any errors gracefully
        // console.error('Error processing request:', error.message);
        return NextResponse.error(new Error('Internal Server Error'));
    }
}
