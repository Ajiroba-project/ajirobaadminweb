import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const tokenHeader = request.headers.get('authorization');
        const token = tokenHeader?.replace('Token ', '');

        if (!token) {
            return NextResponse.json(
                { status: 'failed', message: 'Token is required' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { product_no, user_id } = body || {};

        if (!product_no || !user_id) {
            return NextResponse.json(
                { status: 'failed', message: 'product_no and user_id are required' },
                { status: 400 }
            );
        }

        const cacheBuster = `cache=${Date.now()}`;
        const apiUrl = `${process.env.BASE_URL}/admin/notify_winner/?${cacheBuster}`;

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({ product_no, user_id }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            return NextResponse.json(
                { status: 'failed', message: data?.message || 'An error occurred with the external API' },
                { status: res.status }
            );
        }

        // console.log(data, 'data')
        // console.log(res, 'res')

        return NextResponse.json({ status: 'success', message: data?.message || 'Winners notified successfully.' }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('notify_winner error:', errorMessage);
        return NextResponse.json(
            { status: 'failed', message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}


