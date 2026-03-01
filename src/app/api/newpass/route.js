import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const body = await request.json();

      

        const payload = {
            password: body.password,
        };

        const otp = body.otp

        const cacheBuster = `cache=${Date.now()}`;

         

        const res = await fetch(`${process.env.BASE_URL}/auth/reset_password/${otp}/`, {
            method: 'PUT',
            maxBodyLength: Infinity,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        const status = res.status;

        return NextResponse.json({ data, status });


    } catch (error) {
        console.error('Error processing request:', error.message);
        console.log(error, 'error')
        return NextResponse.error(new Error('Internal Server Error'));
    }
}
