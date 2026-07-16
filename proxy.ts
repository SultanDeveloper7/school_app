import { NextRequest, NextResponse } from "next/server";
import { JwtService } from "./core/jwt/jwt";
import { VerifyTokenResultType } from "./types/coreTypes/verifyTokenResult";
import connect from "./core/db/db";

const publicRoutes: string[] = ["/login", "/register", "/forgot-password", "/reset-password"];
const privateRoutes: string[] = ["/dashboard", "/profile", "/settings"];

export default async function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  console.log(`[JWT DEBUG] The request url: ${request.nextUrl}`);
  if (!token) {
    console.log(`[JWT DEBUG] 1: No token provided in cookies! redirecting to login...`);
    if (privateRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    console.log(`[JWT DEBUG] 2: There is token and will start validating`);
    const jwtService = new JwtService();
    const decodedToken: VerifyTokenResultType = jwtService.verifyToken(token);
    let conn;
    if (!decodedToken.success) {
      console.log(`[JWT DEBUG] 3: Failed verifying the token. msg:${decodedToken.message}`);
      if (decodedToken.error === "TOKEN_EXPIRED" && decodedToken.payload) {
        console.log(`[JWT DEBUG] 4: Checking if the token is expired and there is payload data`);
        try {
          conn = await connect();
          const refreshToken = request.cookies.get("refresh_token")?.value;
          if (!refreshToken) {
            console.log(`[JWT DEBUG] 5: Checking for refresh token in cookies`);
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("access_token");
            response.cookies.delete("refresh_token");
            return response;
          }

          const result = await jwtService.refreshToken(refreshToken, decodedToken.payload, conn);
          console.log(`[JWT DEBUG] 6: Trying to refresh the token :D`);
          if (result.status) {
            console.log(`[JWT DEBUG] 7: The token was refreshed and everything went well TOKEN: ${result.data.token}`);
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
            console.log(`[JWT DEBUG] 8: Failed refreshing the token :( with: ${result.message}`);
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("access_token");
            response.cookies.delete("refresh_token");
            return response;
          }
        } catch (error) {
          console.log(`[JWT DEBUG] 9: Weird catch error: ${error}`);
        } finally {
          if (conn) {
            await conn.end();
          }
        }
      } else if (decodedToken.error === "INVALID_TOKEN" || decodedToken.error === "TOKEN_NOT_ACTIVE") {
        console.log(`[JWT DEBUG] 10: If weird token then auto reject and clear cookies`);
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
      }
      console.log(`[JWT DEBUG] 11: Weird nothing happens probably there is no cookies`);
      if (privateRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    console.log(`[JWT DEBUG] 12: There is token and valid token :D`);
    if (publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
