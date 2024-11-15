import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  const authToken = cookies().get("authToken");

  if (!authToken) {
    return NextResponse.json(
      { success: false, message: "No auth token found" },
      { status: 200 }
    );
  }
  cookies().delete("authToken");

  return NextResponse.json(
    { success: true, message: "Auth token deleted successfully" },
    { status: 200 }
  );
}