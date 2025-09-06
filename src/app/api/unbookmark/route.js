import { NextResponse } from "next/server";

export async function POST(request) {

    try {
        const body = await request.json();

        const cacheBuster = `cache=${Date.now()}`;



        /*  console.log(body, 'bodyyy')
         console */

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/unbookmark_post/?${cacheBuster}`, {
            method: "POST",
            maxBodyLength: Infinity,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Token ${body.tkn}`
            },
            body: JSON.stringify({
                "post_id": body.post_id
            }),
        });

        const data = await res.json();
        const status = res.status;

        return NextResponse.json({ data, status });
    } catch (error) {

        console.error('Error processing request:', error.message);
        return NextResponse.error(new Error('Internal Server Error'));
    }
}