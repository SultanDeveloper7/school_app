import connect from "@/core/db/db";
import { JwtService } from "@/core/jwt/jwt";
import { response } from "@/core/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const authorization = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  console.log("Authorization: ", authorization);
  console.log("Refresh Token: ", refreshToken);

  if (!authorization || !refreshToken) {
    return response(null, "Access or refresh token is missing", "TOKEN_MISSING", 401);
  }
  const token = authorization.replace("Bearer ", "");
  let conn;
  try {
    const jwtService = new JwtService();
    const payload = jwtService.verifyToken(token);
    conn = await connect();

    if (!payload.success) {
      if (payload.error === "TOKEN_EXPIRED" && payload.payload) {
        const userId = payload.payload.user_id;
        await jwtService.deleteRefreshTokenFromDb(userId, refreshToken, conn);
        return response(null, "Successfully logged out", "SUCCESS", 200);
      }
      return response(null, payload.message, payload.error, payload.code);
    }

    const userId = payload.payload.user_id;
    await jwtService.deleteRefreshTokenFromDb(userId, refreshToken, conn);
    return response(null, "Successfully logged out", "SUCCESS", 200);
  } catch (error) {
    return response(null, "Something went wrong", "UNKNOWN_ERROR", 501);
  } finally {
    if (conn) await conn.end();
  }
}
