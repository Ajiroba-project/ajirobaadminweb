// import { NextResponse } from "next/server";

// export async function POST(request) {
//     try {
//         const body = await request.json();
//         const cacheBuster = `cache=${Date.now()}`;

//         const res = await fetch(`${process.env.BASE_URL}/auth/reset_password/otp/?${cacheBuster}`, {
//             method: 'POST',
//             maxBodyLength: Infinity,
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(body),
//         });

//         // Parse response body as JSON
//         const data = await res.json();
//         const status = res.status;

//         // Return JSON response with data and status
//         return NextResponse.json({ data, status });
//     } catch (error) {
//         // Handle any errors gracefully
//         console.error('Error processing request:', error.message);
//         return NextResponse.error(new Error('Internal Server Error'));
//     }
// }

import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const body = await request.json();

        // console.log(body, 'bodyyy')
        const payload = {
            password: body.password,
        };

        const otp = body.otp
        /*   console.log(otp, 'otp')
          console.log(payload, 'payload') */

        const cacheBuster = `cache=${Date.now()}`;

        const res = await fetch(`${process.env.BASE_URL}/auth/reset_password/${otp}/?${cacheBuster}`, {
            method: 'PUT',
            maxBodyLength: Infinity,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        // Parse response body as JSON
        const data = await res.json();

        // console.log(data, 'data')
        // console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset_password/${otp}/?${cacheBuster}`, 'url')

        // Get response status
        const status = res.status;

        // Return JSON response with data and status

        // console.log({ data, status })
        return NextResponse.json({ data, status });


    } catch (error) {
        // Handle any errors gracefully
        console.error('Error processing request:', error.message);
        console.log(error, 'error')
        return NextResponse.error(new Error('Internal Server Error'));
    }
}
