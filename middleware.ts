import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedRoutes = ["/profile"];

export default auth((req) => {
  const isAuthorized = !!req.auth?.user;

  if (!isAuthorized) {
    if (protectedRoutes.some((url) => req.nextUrl.pathname.startsWith(url)))
      return NextResponse.redirect(new URL("/", req.url));
  }

  return;
});

export const config = {
  matcher: ["/((?!$|api|_next/static|_next/image|images|favicon.ico).*)"],
};
