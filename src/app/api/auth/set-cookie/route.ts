import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { token } = await request.json();
  const response = NextResponse.json({ success: true });

  response.cookies.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600,
    path: "/",
  });

  return response;
}