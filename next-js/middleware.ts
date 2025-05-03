import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const isHttps =
  req.headers.get("x-forwarded-proto") === "https" ||
  req.nextUrl.protocol === "https:" ||
  process.env.NODE_ENV === "production";
  
  const token = await getToken({ req, secureCookie: isHttps ,secret: process.env.AUTH_SECRET });
  console.log("Token in middleware:", token);
  const isLoggedIn = !!token;

  if (!isLoggedIn) {
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  } 

  return NextResponse.next();
}