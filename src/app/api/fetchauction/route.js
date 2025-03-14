import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
    try {
        /*       const body = await request.json(); */
        const cacheBuster = `cache=${Date.now()}`;

        const cookieStore = cookies()
        const token = cookieStore.get('token')

        const { searchParams } = new URL(request.url);

        const id = searchParams.get("product_id");

        const headers = {
            "Content-Type": "application/json",
        };

        if (token.value) {
            headers['Authorization'] = `token ${token.value}`;
        }

        // /admin/view_product_transaction / 176409960
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/view_auction_transaction/${id}?&${cacheBuster}/`, {
            method: "GET",
            maxBodyLength: Infinity,
            headers: headers,

        });

        const data = await res.json();
        const status = res.status;


        return NextResponse.json({ data, status });
    } catch (error) {
        console.error('Error processing request:', error.message);
        return NextResponse.error(new Error('Internal Server Error'));
    }
}
