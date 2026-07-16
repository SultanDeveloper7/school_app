import connect from "@/core/db/db";
import { response } from "@/core/response";
import { UserTableType } from "@/types/databaseTypes/userTableType";
import { LoginRequestType } from "@/types/requestTypes/loginRequestType";
import { NextRequest } from "next/server";
import crypto from "crypto";
import { LoginResponseType } from "@/types/responseTypes/loginResponseType";
import { JwtService } from "@/core/jwt/jwt";
import { PermissionsServices } from "@/core/permission/permissions";

export async function POST(req: NextRequest) {
  const formData = await req.json();
  const data: LoginRequestType = {
    email: formData.email as string,
    password: formData.password as string,
  };

  if (!data.email || !data.password) {
    return response(null, "All fields are required", "MISSING_FIELDS", 400);
  }
  let conn;
  try {
    conn = await connect();
    const [existingUser] = await conn.execute("SELECT * FROM users WHERE user_email = ?", [data.email]);
    const result = existingUser as UserTableType[];
    if (result.length === 0) {
      return response(null, "User not found", "USER_NOT_FOUND", 404);
    }
    const hashPassword = crypto.createHash("sha256").update(data.password).digest("hex");
    if (result[0].user_password !== hashPassword) {
      return response(null, "Invalid password", "INVALID_PASSWORD", 401);
    }
    const jwtService = new JwtService();
    const permissionsServices = new PermissionsServices();
    const userId = result[0].user_id;
    const userPermissions = await permissionsServices.getUserPermissions(userId);
    const jwtResult = jwtService.generateToken(
      {
        user_id: userId,
      },
      false,
      conn,
    );
    if (!jwtResult) {
      return response(null, "Failed to generate token", "TOKEN_GENERATION_FAILED", 500);
    }

    const loginResponse = response<LoginResponseType>(
      { token: jwtResult.token, refresh_token: jwtResult.refreshToken },
      "Login successful",
      "LOGIN_SUCCESSFUL",
      200,
    );
    loginResponse.cookies.set("access_token", `Bearer ${jwtResult.token}`, {
      httpOnly: true,
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    loginResponse.cookies.set("refresh_token", jwtResult.refreshToken, {
      httpOnly: true,
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return loginResponse;
  } catch (error) {
    return response(null, `Server error: ${error}`, "SERVER_ERROR", 500);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}
