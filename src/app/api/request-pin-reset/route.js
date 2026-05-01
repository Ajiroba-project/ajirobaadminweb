import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace(/^Token\s+/i, "").trim();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email || email === "N/A") {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const cacheBuster = `cache=${Date.now()}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const res = await fetch(
      `${baseUrl}/user/request_pin_reset/?${cacheBuster}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ email }),
      }
    );

    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    return NextResponse.json({ data, status: res.status });
  } catch (error) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
