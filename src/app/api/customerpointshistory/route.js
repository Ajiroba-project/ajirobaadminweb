import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token');

        const { searchParams } = new URL(request.url);

        // console.log(searchParams, 'searchParams');

        const filter = searchParams.get("filter") || "";
        const start_date = searchParams.get("start_date") || "";
        const end_date = searchParams.get("end_date") || "";
        const page = searchParams.get("page") || "";
        const user_id = searchParams.get("user_id") || "";

        if (!user_id) {
            return NextResponse.json({ message: "user_id is required" }, { status: 400 });
        }

        const query = new URLSearchParams();
        if (filter) query.append("filter", filter);
        if (start_date) query.append("start_date", start_date);
        if (end_date) query.append("end_date", end_date);
        if (page) query.append("page", page);

        // console.log(query, 'query0-oooo');

        const headers = {
            "Content-Type": "application/json",
        };
        if (token?.value) {
            headers['Authorization'] = `token ${token.value}`;
        }

        const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://staging.ajiroba.ng/v1';
        const url = `${base}/admin/view_customer_points_history/${user_id}${query.toString() ? `?${query.toString()}` : ''}`;

        // console.log(url, 'url-------gggggg');

        const res = await fetch(url, {
            method: "GET",
            headers,
        });

        const data = await res.json();
        const status = res.status;


        // console.log(data, 'data');

        return NextResponse.json({ data, status });
    } catch (error) {
        // console.error('Error processing request:', error.message);
        return NextResponse.error(new Error('Internal Server Error'));
    }
}


