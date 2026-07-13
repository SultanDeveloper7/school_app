import { NextRequest, NextResponse } from "next/server";
import { JwtService } from "./core/jwt/jwt";
import { VerifyTokenResultType } from "./types/coreTypes/verifyTokenResult";
import connect from "./core/db/db";

const publicRoutes: string[] = ["/login", "/register", "/forgot-password", "/reset-password"];
const privateRoutes: string[] = ["/dashboard", "/profile", "/settings"];

export default async function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    if (privateRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    const jwtService = new JwtService();
    const decodedToken: VerifyTokenResultType = jwtService.verifyToken(token);
    let conn;
    if (!decodedToken.success) {
      if (decodedToken.error === "TOKEN_EXPIRED" && decodedToken.payload) {
        try {
          conn = await connect();
          const result = await jwtService.refreshToken(
            request.cookies.get("refresh_token")?.value || "",
            decodedToken.payload.user_id,
            conn,
          );
          if (result.status) {
            const response = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
              ? NextResponse.redirect(new URL("/dashboard", request.url))
              : NextResponse.next();

            response.cookies.set("access_token", `Bearer ${result.data.token}`, {
              httpOnly: true,
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            response.cookies.set("refresh_token", result.data.refreshToken, {
              httpOnly: true,
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            return response;
          } else {
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("access_token");
            response.cookies.delete("refresh_token");
            return response;
          }
        } catch (error) {
        } finally {
          if (conn) {
            await conn.end();
          }
        }
      } else if (decodedToken.error === "INVALID_TOKEN" || decodedToken.error === "TOKEN_NOT_ACTIVE") {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
      }
      if (privateRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
    if (publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  console.log("Proxying request:", request.url);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
