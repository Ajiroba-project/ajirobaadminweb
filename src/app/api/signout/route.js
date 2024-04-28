import { NextResponse } from "next/server";
import Cookies from "js-cookie";

export async function POST(request) {
  try {
    const cacheBuster = `cache=${Date.now()}`;

    const res = await fetch(
      `${process.env.BASE_URL}/auth/signout/?${cacheBuster}`,
      {
        method: "POST",
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    const status = res.status;

    return NextResponse.json({ status });
  } catch (error) {
    console.error("Error processing request:", error.message);
    return NextResponse.error(new Error("Internal Server Error"));
  }
}
