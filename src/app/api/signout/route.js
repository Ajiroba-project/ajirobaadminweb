import { NextResponse } from "next/server";

import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cacheBuster = `cache=${Date.now()}`;

    const cookieStore = cookies()
    const token = cookieStore.get('token')



    if (!token || !token.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.BASE_URL}/auth/signout/?${cacheBuster}`,
      {
        method: "POST",
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token.value}`
        },
      }
    );


    const status = res.status;




    let data = null;
    let responseStatus = res.status;

    if (status !== 204) {
      data = await res.json();
    } else if (status === 204) {
      data = { message: "Signout successful" }
      responseStatus = 200;
    }



    return NextResponse.json({ data, status: responseStatus });


  } catch (error) {

    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
