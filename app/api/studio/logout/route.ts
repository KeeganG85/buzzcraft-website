import { NextResponse } from "next/server";
import { studioCookie } from "@/lib/studio";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(studioCookie, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
