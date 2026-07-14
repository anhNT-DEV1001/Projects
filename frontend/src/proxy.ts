import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN_COOKIE =
  process.env.ACCESS_TOKEN_COOKIE_NAME || "access_token";
const REFRESH_TOKEN_COOKIE =
  process.env.REFRESH_TOKEN_COOKIE_NAME || "refresh_token";
const AUTH_ROUTES = new Set(["/login", "/register"]);

function hasAuthCookie(request: NextRequest) {
  return (
    request.cookies.has(ACCESS_TOKEN_COOKIE) ||
    request.cookies.has(REFRESH_TOKEN_COOKIE)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.has(pathname);
  const isAuthenticated = hasAuthCookie(request);

  if (!isAuthenticated && !isAuthRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
